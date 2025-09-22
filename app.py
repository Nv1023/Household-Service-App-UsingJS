from flask import Flask, jsonify, render_template
from flask_security import Security, SQLAlchemySessionUserDatastore
from backend.config import LocalDevelopmentConfig
from backend.models import db, User_Info, Role_Info
from backend.create_initial_data import create_initial_data
from flask_cors import CORS
from flask_caching import Cache
from backend.celery import celery_init_app  
from flask_mail import Mail
import flask_excel as excel


def init_app():
    app = Flask(
        __name__,
        template_folder="frontend",  
        static_folder="frontend", 
        static_url_path="/static"
    )
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    CORS(app) 
    cache = Cache(app)
    mail = Mail(app)

    datastore = SQLAlchemySessionUserDatastore(db.session, User_Info, Role_Info)
    app.cache = cache
    app.mail = mail
    security = Security(app, datastore, register_blueprint=False)

    with app.app_context():
        from backend.resource import api
        api.init_app(app)  
        create_initial_data(security, datastore)  

    return app


app = init_app()

celery_app = celery_init_app(app)

celery_app.autodiscover_tasks(['backend.celery'])

excel.init_excel(app)


@app.route("/")
def index():
    return render_template("index.html")

@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

@app.errorhandler(404)
def not_found(error):
    return jsonify({"message": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({"message": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)