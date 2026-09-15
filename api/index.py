import os
import sys

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app import app as flask_app

class VercelPathMiddleware:
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        matched = environ.get('HTTP_X_MATCHED_PATH') or environ.get('HTTP_X_VERCEL_FORWARDED_PATH')
        if matched:
            environ['PATH_INFO'] = matched
        elif environ.get('PATH_INFO') in ('/api/index', '/api/index.py', '/api'):
            environ['PATH_INFO'] = '/'
        return self.wsgi_app(environ, start_response)

app = VercelPathMiddleware(flask_app)
