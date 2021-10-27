from flask import Flask
from flask_restful import Api
from project.resources.user import UserRegister, QueryByOfferLang, QueryByAcceptLang
from flask_migrate import Migrate
from project.ma import ma
   
def create_app():
    
    app = Flask(__name__)
    app.config.from_object('project.config.Config')
    from project.models import db
    db.init_app(app) 
    ma.init_app(app)
    Migrate(app, db)
    api = Api(app)
    api.add_resource(UserRegister, "/register")
    api.add_resource(QueryByOfferLang, "/searchOfferLang")
    api.add_resource(QueryByAcceptLang, "/searchAcptLang")
    return app
