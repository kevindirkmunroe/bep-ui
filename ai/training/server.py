from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

class FormHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        # 1. Determine the length of the incoming data payload
        content_length = int(self.headers['Content-Length'])

        # 2. Read and decode the raw data bytes
        post_data = self.rfile.read(content_length).decode('utf-8')

        # 3. Parse the data into a readable dictionary
        parsed_data = urllib.parse.parse_qs(post_data)

        print("\n--- RECEIVED FORM DATA ---")
        for key, value in parsed_data.items():
            print(f"KEY {key}: VALUE {value[0]}")
        print("--------------------------\n")

        # 3. Redirect the browser to /thank-you.html
        self.send_response(303)  # 303 See Other
        self.send_header('Location', '/submit-result.html')
        self.end_headers()

# Start the server on port 8000
server_address = ('', 8000)
httpd = HTTPServer(server_address, FormHandler)
print("Server running on http://localhost:8000...")
httpd.serve_forever()

