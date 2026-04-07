from http.server import BaseHTTPRequestHandler
import json
import os


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        checks = {
            "mongo": bool(os.environ.get("MONGO_URL")),
            "ms_graph": all([
                os.environ.get("MS_TENANT_ID"),
                os.environ.get("MS_CLIENT_ID"),
                os.environ.get("MS_CLIENT_SECRET"),
            ]),
            "ms_from_email": bool(os.environ.get("MS_FROM_EMAIL")),
            "recipient_email": bool(os.environ.get("RECIPIENT_EMAIL")),
        }
        body = json.dumps(checks).encode()
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass
