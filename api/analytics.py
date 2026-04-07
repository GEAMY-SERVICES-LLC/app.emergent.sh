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


def _env(key):
    return os.environ.get(key.upper()) or os.environ.get(key.lower()) or ""


def get_db():
    mongo_url = _env("MONGO_URL")
    db_name = _env("DB_NAME") or "geamy"
    client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
    return client[db_name]


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

        event_type = str(data.get("event_type", "")).strip()
        if not event_type:
            self._respond(400, {"error": "Missing event_type"})
            return

        event_id = str(uuid.uuid4())
        doc = {
            "id": event_id,
            "event_type": event_type,
            "page": str(data.get("page", "")),
            "metadata": data.get("metadata", {}),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        if MONGO_AVAILABLE:
            try:
                db = get_db()
                db.analytics.insert_one(doc)
            except Exception as e:
                print(f"MongoDB error: {e}")

        self._respond(200, {"status": "tracked", "id": event_id})

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
        pass
