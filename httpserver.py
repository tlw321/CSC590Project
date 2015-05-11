from http.server import HTTPServer,SimpleHTTPRequestHandler
from socketserver import BaseServer
import ssl

certificate_file = 'keycert.pem'
httpd = HTTPServer(('localhost', 1443), SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket (httpd.socket, certfile=certificate_file, server_side=True)
httpd.serve_forever()
