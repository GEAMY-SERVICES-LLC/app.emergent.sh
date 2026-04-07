from http.server import BaseHTTPRequestHandler
import json
import os
import uuid
from datetime import datetime, timezone

try:
    from pymongo import MongoClient
    MONGO_AVAILABLE = True
except ImportError:
    MONGO_AVAILABLE = False

try:
    import msal
    import requests as req
    GRAPH_AVAILABLE = True
except ImportError:
    GRAPH_AVAILABLE = False


def _env(key):
    """Read env var, checking both UPPER and lower case."""
    return os.environ.get(key.upper()) or os.environ.get(key.lower()) or ""


def get_db():
    mongo_url = _env("MONGO_URL")
    db_name = _env("DB_NAME") or "geamy"
    client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
    return client[db_name]


def send_email(name, email, phone, service, message):
    """Send email via Microsoft Graph REST API."""
    tenant_id    = _env("MS_TENANT_ID")
    client_id    = _env("MS_CLIENT_ID")
    client_secret = _env("MS_CLIENT_SECRET")
    from_email   = _env("MS_FROM_EMAIL") or "bot@geamyservices.com"
    to_email     = _env("RECIPIENT_EMAIL") or "gerardo@geamyservices.com"

    if not all([tenant_id, client_id, client_secret]):
        print("Microsoft Graph credentials not configured - email skipped")
        return False

    try:
        app_msal = msal.ConfidentialClientApplication(
            client_id,
            authority=f"https://login.microsoftonline.com/{tenant_id}",
            client_credential=client_secret,
        )
        token = app_msal.acquire_token_for_client(
            scopes=["https://graph.microsoft.com/.default"]
        )

        if "access_token" not in token:
            print(f"MSAL token error: {token.get('error_description')}")
            return False

        html_body = f"""
        <html><body style="font-family:monospace;background:#f5f5f5">
        <div style="max-width:600px;margin:0 auto;background:#fff;padding:20px">
          <div style="background:#040810;color:#00d4ff;padding:20px;text-align:center">
            <h2>New Contact Form Submission</h2><p>Geamy Services LLC</p>
          </div>
          <p><b>Name:</b> {name}</p>
          <p><b>Email:</b> {email}</p>
          <p><b>Phone:</b> {phone or "Not provided"}</p>
          <p><b>Service:</b> {service}</p>
          <p><b>Message:</b><br>{message}</p>
          <div style="margin-top:20px;font-size:12px;color:#666;text-align:center">
            Sent automatically from geamyservices.com
          </div>
        </div></body></html>
        """

        response = req.post(
            f"https://graph.microsoft.com/v1.0/users/{from_email}/sendMail",
            json={
                "message": {
                    "subject": f"New Contact: {service} - {name}",
                    "body": {"contentType": "HTML", "content": html_body},
                    "toRecipients": [{"emailAddress": {"address": to_email}}],
                },
                "saveToSentItems": True,
            },
            headers={
                "Authorization": f"Bearer {token['access_token']}",
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        return response.status_code == 202
    except Exception as e:
        print(f"Email error: {e}")
        return False


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(length))
        except Exception:
            self._respond(400, {"error": "Invalid JSON"})
            return

        name    = str(data.get("name", "")).strip()
        email   = str(data.get("email", "")).strip()
        service = str(data.get("service", "")).strip()
        message = str(data.get("message", "")).strip()
        phone   = str(data.get("phone", "")).strip()

        if not all([name, email, service, message]):
            self._respond(400, {"error": "Missing required fields: name, email, service, message"})
            return

        submission_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        doc = {
            "id": submission_id,
            "name": name,
            "email": email,
            "phone": phone,
            "service": service,
            "message": message,
            "status": "new",
            "created_at": now,
            "email_sent": False,
        }

        # Save to MongoDB
        db = None
        if MONGO_AVAILABLE:
            try:
                db = get_db()
                db.contacts.insert_one(doc)
            except Exception as e:
                print(f"MongoDB error: {e}")

        # Send email
        email_sent = False
        if GRAPH_AVAILABLE:
            email_sent = send_email(name, email, phone, service, message)
            if db and email_sent:
                try:
                    db.contacts.update_one(
                        {"id": submission_id}, {"$set": {"email_sent": True}}
                    )
                except Exception:
                    pass

        self._respond(202, {
            "message": "Thank you for contacting us. We'll get back to you soon.",
            "id": submission_id,
            "status": "received",
        })

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _respond(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass  # suppress default access logs
