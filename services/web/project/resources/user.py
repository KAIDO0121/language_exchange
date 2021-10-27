from flask_restful import Resource
from flask import request
from project.ma import ma
from project.models.user import User
from project.models.lang import AcceptLanguage, OfferLanguage
from project.schemas.user import UserSchema
from project.schemas.lang import AcceptLanguageSchema, OfferLanguageSchema
from werkzeug.datastructures import FileStorage
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token
)
# from blacklist import BLACKLIST

BLANK_ERROR = "'{}' cannot be blank."
USER_ALREADY_EXISTS = "A user with that username already exists."
CREATED_SUCCESSFULLY = "User created successfully."
USER_NOT_FOUND = "User not found."
USER_DELETED = "User deleted."
INVALID_CREDENTIALS = "Invalid credentials!"
USER_LOGGED_OUT = "User <id={user_id}> successfully logged out."
EMAIL_ALREADY_EXISTS = "Email already exists."


user_schema = UserSchema()

offer_schema = OfferLanguageSchema()

# _user_parser = reqparse.RequestParser()
# _user_parser.add_argument(
#     "username", type=str, required=True, help=BLANK_ERROR.format("username")
# )

# _user_parser.add_argument(
#     "email", type=str, required=True, help=BLANK_ERROR.format("email")
# )

# _user_parser.add_argument(
#     "password", type=str, required=True, help=BLANK_ERROR.format("password")
# )


# _user_parser.add_argument(
#     "offer_language",type=dict, action='append', required=True, help=BLANK_ERROR.format("offer_language")
# )

# _user_parser.add_argument(
#     "accept_language",type=dict,  action='append', required=True, help=BLANK_ERROR.format("accept_language")
# )


# _user_parser.add_argument(
#     "bio", type=str
# )

# _user_parser.add_argument(
#     "pic", type=FileStorage, location='files'
# )

# _user_parser.add_argument(
#     "_langcode", type=str
# )

# _user_parser.add_argument(
#     "_level", type=int
# )


class UserLogin(Resource):
    @classmethod
    def post(cls):
        data = _user_parser.parse_args()

        user = User.find_by_username(data["username"])

        # this is what the `authenticate()` function did in security.py
        if user and check_password_hash(user.password, data["password"]):
            # identity= is what the identity() function did in security.py—now stored in the JWT
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)
            return {"access_token": access_token, "refresh_token": refresh_token}, 200

        return {"message": INVALID_CREDENTIALS}, 401


class UserRegister(Resource):
    @classmethod
    def post(cls):
        user_json = request.get_json()
        data = user_schema.load(user_json)
       
        if User.find_by_username(data["username"]):
            return {"message": USER_ALREADY_EXISTS}, 400

        if User.find_by_email(data["email"]):
            return {"message": EMAIL_ALREADY_EXISTS}, 400

        data["password"] = generate_password_hash(data["password"])

        if not 'bio' in data:
            data["bio"] = None

        if not 'pic' in data:
            data["pic"] = None
        
        
        user = User(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            bio=data["bio"],
            pic=data["pic"]
        )
        _id = user.save_to_db()
    
        for lang in data["accept_language"]:
            
            _lang = AcceptLanguage(
                lang_code=lang['langCode'], lang_name=lang['langName'], 
                user_id=_id)
            _lang.save_to_db()

        for lang in data["offer_language"]:
            _lang = OfferLanguage(
                level = lang['level'],lang_code=lang['langCode'], lang_name=lang['langName'], 
                user_id=_id)
            _lang.save_to_db()
           

        return {"message": CREATED_SUCCESSFULLY}, 201

class QueryByOfferLang(Resource):
    
    @classmethod
    def get(cls):
        args = request.args
        print(args)
        user = OfferLanguage.find_by_offer_lan(args._langcode, args._level)
        return offer_schema.dump(user), 200


class QueryByAcceptLang(Resource):
    
    @classmethod
    def get(cls, lang: dict):
        user = cls.query.filter(User.accept_language.contains(lang)).first()
        if not user:
            return {"message": USER_NOT_FOUND}, 404
        return user.json(), 200

