#app/ __init__.py
from flask import Flask
from flask_cors import CORS
from .routes import api_bp

def create_app():
    app = Flask(__name__)
    # aca se puede cargar la configuracion, Cors, DB, etc.
    CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

    app.register_blueprint(api_bp, url_prefix='/api')
    return app