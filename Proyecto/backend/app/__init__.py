from flask import Flask
from .routes import router
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")
    app.register_blueprint(router)
    #CORS(app, origins=["https://intentorepositorio.onrender.com"], methods=["GET", "POST", "PUT", "DELETE"], allow_headers=["Content-Type"])
    #CORS(app, origins=["http://localhost:5173"])
    CORS(app)
    return app
