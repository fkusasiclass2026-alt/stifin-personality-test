import os
import sys
from urllib.parse import parse_qs, urlencode

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app import app as flask_app

class VercelPathMiddleware:
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        qs = environ.get('QUERY_STRING', '')
        if '__vercel_path__' in qs:
            params = parse_qs(qs, keep_blank_values=True)
            if '__vercel_path__' in params:
                target_path = params.pop('__vercel_path__')[0]
                while '//' in target_path:
                    target_path = target_path.replace('//', '/')
                if not target_path.startswith('/'):
                    target_path = '/' + target_path
                if len(target_path) > 1 and target_path.endswith('/'):
                    target_path = target_path[:-1]
                environ['PATH_INFO'] = target_path
                environ['QUERY_STRING'] = urlencode(params, doseq=True)
        return self.wsgi_app(environ, start_response)

app = VercelPathMiddleware(flask_app)
