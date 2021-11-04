from flask_restful import Resource
from flask import request
from project.libs import image_helper
from project.models.user import User
from project.models.lang import AcceptLanguage, OfferLanguage
from project.schemas.user import UserSchema, UserAndLangSchema
from project.schemas.lang import AcceptLanguageSchema, OfferLanguageSchema
from werkzeug.datastructures import FileStorage
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required
)
# from blacklist import BLACKLIST

USER_ALREADY_EXISTS = "A user with that username already exists."
USER_NOT_FOUND = "User not found."
USER_DELETED = "User deleted."
INVALID_CREDENTIALS = "Invalid credentials!"
USER_LOGGED_OUT = "User <id={user_id}> successfully logged out."
EMAIL_ALREADY_EXISTS = "Email already exists."


user_schema = UserSchema()

user_lang_schema = UserAndLangSchema(many=True)

offer_schema = OfferLanguageSchema(many=True)

acpt_schema = AcceptLanguageSchema(many=True)


class UserLogin(Resource):
    @classmethod
    def post(cls):
        user_json = request.get_json()
        user = User.find_by_username(user_json['username'])
        
        # this is what the `authenticate()` function did in security.py
        if user and check_password_hash(user.password, user_json['password']):
            # identity= is what the identity() function did in security.py—now stored in the JWT
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)
            return {"access_token": access_token, "refresh_token": refresh_token}, 200

        return {"message": INVALID_CREDENTIALS}, 401



class UserRegister(Resource):
    @classmethod
    def post(cls):
        user_json = request.get_json()
        
        # print(user_json)
        # user_json["pic"] = {}
        # user_json["pic"] = request.files["image"]
        #     # here we only return the basename of the image and hide the internal folder structure from our user
        # user_json["picName"] = ""
        # user_json["picName"] = request.files["image"].filename
        
        user = user_schema.load(user_json) ## JSON -> load -> 使用marshmallow驗證USER model
        
        if User.find_by_username(user.username):
            return {"message": USER_ALREADY_EXISTS}, 400

        if User.find_by_email(user.email):
            return {"message": EMAIL_ALREADY_EXISTS}, 400

        user.password = generate_password_hash(user.password)

        b = user.save_to_db()
       
        return user_schema.dump(b), 201

class QueryByOfferLang(Resource):
    
    @classmethod
    def get(cls):
        _langname = request.args.getlist('_langname')[0]
        _level = request.args.getlist('_level')
        if _level:
            _level = _level[0]
        
        users = User.find_by_offer_lan(_langname, _level)

        return user_lang_schema.dump(users), 200

class EditProfile(Resource): 
    @classmethod
    @jwt_required()
    def put(cls):
        user_json = request.get_json()
        user = User.find_by_username(user_json["username"])
        
        if user:
            user.bio = user_json["bio"]
            user.user_offer_lang = offer_schema.load(user_json["user_offer_lang"]) 
            user.user_acpt_lang = acpt_schema.load(user_json["user_acpt_lang"]) 
      
        user.save_to_db()

        return user_schema.dump(user), 200

class allLang(Resource): 
    @classmethod
    def get(cls):
        _langname = request.args.getlist('_langname')[0]
        a = User.query.join(OfferLanguage).filter_by(lang_name=_langname).all()
        print(a)
        return 1, 200

class QueryByAcceptLang(Resource):
    
    @classmethod
    def get(cls):
        
        users = User.find_by_acpt_lan(request.args.getlist('_langname')[0])

        return user_lang_schema.dump(users), 200

