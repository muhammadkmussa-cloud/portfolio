"""Local static preview with Vercel-style clean URLs and a custom 404."""
import argparse
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path != "/" and not Path(path).suffix:
            candidate = Path(self.translate_path(path + ".html"))
            if candidate.is_file():
                self.path = path + ".html"
        super().do_GET()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            content = Path("404.html").read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(content)
            return
        super().send_error(code, message, explain)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Preview the static portfolio with clean URLs.")
    parser.add_argument("--port", type=int, default=8093)
    args = parser.parse_args()
    os.chdir(Path(__file__).resolve().parent.parent)
    print(f"Portfolio preview: http://127.0.0.1:{args.port}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", args.port), Handler).serve_forever()
