from flask import Flask
from .routes import router
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")
    app.register_blueprint(router)
    CORS(app, origins=["http://localhost:5173"])
    return app
