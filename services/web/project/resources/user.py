from flask_restful import Resource, reqparse
from project.models.user import User
from project.models.lang import AcceptLanguage, OfferLanguage
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

_user_parser = reqparse.RequestParser()
_user_parser.add_argument(
    "username", type=str, required=True, help=BLANK_ERROR.format("username")
)

_user_parser.add_argument(
    "email", type=str, required=True, help=BLANK_ERROR.format("email")
)

_user_parser.add_argument(
    "password", type=str, required=True, help=BLANK_ERROR.format("password")
)


_user_parser.add_argument(
    "offer_language",type=dict, action='append', required=True, help=BLANK_ERROR.format("offer_language")
)

_user_parser.add_argument(
    "accept_language",type=dict,  action='append', required=True, help=BLANK_ERROR.format("accept_language")
)


_user_parser.add_argument(
    "bio", type=str
)

_user_parser.add_argument(
    "pic", type=FileStorage, location='files'
)


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
        data = _user_parser.parse_args()
    
        if User.find_by_username(data["username"]):
            return {"message": USER_ALREADY_EXISTS}, 400

        if User.find_by_email(data["email"]):
            return {"message": EMAIL_ALREADY_EXISTS}, 400

        data.password = generate_password_hash(data.password)
        
        user = User(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            bio=data["bio"],
            pic=data["pic"]
        )
        '''
        [{
                "lang_code":"en",
                "lang_name":"English",
                "level":"3"
            },{
                "lang_code":"jp",
                "lang_name":"Japanese",
                "level":"6"
            }]
        '''
        testlang = []

        created_user = user.save_to_db()
    
        for lang in data["accept_language"]:
            
            _lang = AcceptLanguage(
                lang_code=lang.lang_code, lang_name=lang.lang_name, 
                user_id=created_user.id)
            _lang.save_to_db()

        for lang in data["offer_language"]:
            _lang = OfferLanguage(
                level = lang.level,lang_code=lang.lang_code, lang_name=lang.lang_name, 
                user_id=created_user.id)
            _lang.save_to_db()
            testlang.append(_lang.json())

        return {"message": CREATED_SUCCESSFULLY, "lang":testlang}, 201


class QueryByOfferLang(Resource):
   
    @classmethod
    def get(cls, lang: dict):
        user = cls.query.filter(User.offer_language.contains(lang)).first()
        if not user:
            return {"message": USER_NOT_FOUND}, 404
        return user.json(), 200


class QueryByAcceptLang(Resource):
    
    @classmethod
    def get(cls, lang: dict):
        user = cls.query.filter(User.accept_language.contains(lang)).first()
        if not user:
            return {"message": USER_NOT_FOUND}, 404
        return user.json(), 200

