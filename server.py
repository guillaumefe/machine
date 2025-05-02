#!/usr/bin/env python3
# sauvez ce fichier sous server.py et lancez-le avec `python server.py`

from http.server import HTTPServer, SimpleHTTPRequestHandler

class COOPCOEPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Cross‑Origin isolation
        self.send_header("Cross-Origin-Opener-Policy",  "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy","require-corp")
        super().end_headers()

if __name__ == "__main__":
    port = 3000
    print(f"🌐 Serving on http://localhost:{port}/ (secure context via localhost)")
    httpd = HTTPServer(("0.0.0.0", port), COOPCOEPRequestHandler)
    httpd.serve_forever()

