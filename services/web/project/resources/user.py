from flask_restful import Resource
import re
from project.models import db
from flask import request
from project.models.user import User
from project.schemas.user import UserSchema
from project.schemas.lang import AcceptLanguageSchema, OfferLanguageSchema
import base64
from project.blacklist import BLACKLIST
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)

USER_ALREADY_EXISTS = "A user with that username already exists."
USER_NOT_FOUND = "User not found."
USER_DELETED = "User deleted."
INVALID_CREDENTIALS = "Invalid credentials!"
USER_LOGGED_OUT = "User <id={user_id}> successfully logged out."
EMAIL_ALREADY_EXISTS = "Email already exists."

allLang = [
    { 'code' : False, 'name' : 'Select a language' },
    { 'code' : 'ab', 'name' : 'Abkhazian' },
    { 'code' : 'aa', 'name' : 'Afar' },
    { 'code' : 'af', 'name' : 'Afrikaans' },
    { 'code' : 'ak', 'name' : 'Akan' },
    { 'code' : 'sq', 'name' : 'Albanian' },
    { 'code' : 'am', 'name' : 'Amharic' },
    { 'code' : 'ar', 'name' : 'Arabic' },
    { 'code' : 'an', 'name' : 'Aragonese' },
    { 'code' : 'hy', 'name' : 'Armenian' },
    { 'code' : 'as', 'name' : 'Assamese' },
    { 'code' : 'av', 'name' : 'Avaric' },
    { 'code' : 'ae', 'name' : 'Avestan' },
    { 'code' : 'ay', 'name' : 'Aymara' },
    { 'code' : 'az', 'name' : 'Azerbaijani' },
    { 'code' : 'bm', 'name' : 'Bambara' },
    { 'code' : 'ba', 'name' : 'Bashkir' },
    { 'code' : 'eu', 'name' : 'Basque' },
    { 'code' : 'be', 'name' : 'Belarusian' },
    { 'code' : 'bn', 'name' : 'Bengali' },
    { 'code' : 'bh', 'name' : 'Bihari languages' },
    { 'code' : 'bi', 'name' : 'Bislama' },
    { 'code' : 'bs', 'name' : 'Bosnian' },
    { 'code' : 'br', 'name' : 'Breton' },
    { 'code' : 'bg', 'name' : 'Bulgarian' },
    { 'code' : 'my', 'name' : 'Burmese' },
    { 'code' : 'ca', 'name' : 'Catalan, Valencian' },
    { 'code' : 'km', 'name' : 'Central Khmer' },
    { 'code' : 'ch', 'name' : 'Chamorro' },
    { 'code' : 'ce', 'name' : 'Chechen' },
    { 'code' : 'ny', 'name' : 'Chichewa, Chewa, Nyanja' },
    { 'code' : 'zh', 'name' : 'Chinese' },
    { 'code' : 'cu', 'name' : 'Church Slavonic, Old Bulgarian, Old Church Slavonic' },
    { 'code' : 'cv', 'name' : 'Chuvash' },
    { 'code' : 'kw', 'name' : 'Cornish' },
    { 'code' : 'co', 'name' : 'Corsican' },
    { 'code' : 'cr', 'name' : 'Cree' },
    { 'code' : 'hr', 'name' : 'Croatian' },
    { 'code' : 'cs', 'name' : 'Czech' },
    { 'code' : 'da', 'name' : 'Danish' },
    { 'code' : 'dv', 'name' : 'Divehi, Dhivehi, Maldivian' },
    { 'code' : 'nl', 'name' : 'Dutch, Flemish' },
    { 'code' : 'dz', 'name' : 'Dzongkha' },
    { 'code' : 'en', 'name' : 'English' },
    { 'code' : 'eo', 'name' : 'Esperanto' },
    { 'code' : 'et', 'name' : 'Estonian' },
    { 'code' : 'ee', 'name' : 'Ewe' },
    { 'code' : 'fo', 'name' : 'Faroese' },
    { 'code' : 'fj', 'name' : 'Fijian' },
    { 'code' : 'fi', 'name' : 'Finnish' },
    { 'code' : 'fr', 'name' : 'French' },
    { 'code' : 'ff', 'name' : 'Fulah' },
    { 'code' : 'gd', 'name' : 'Gaelic, Scottish Gaelic' },
    { 'code' : 'gl', 'name' : 'Galician' },
    { 'code' : 'lg', 'name' : 'Ganda' },
    { 'code' : 'ka', 'name' : 'Georgian' },
    { 'code' : 'de', 'name' : 'German' },
    { 'code' : 'ki', 'name' : 'Gikuyu, Kikuyu' },
    { 'code' : 'el', 'name' : 'Greek (Modern)' },
    { 'code' : 'kl', 'name' : 'Greenlandic, Kalaallisut' },
    { 'code' : 'gn', 'name' : 'Guarani' },
    { 'code' : 'gu', 'name' : 'Gujarati' },
    { 'code' : 'ht', 'name' : 'Haitian, Haitian Creole' },
    { 'code' : 'ha', 'name' : 'Hausa' },
    { 'code' : 'he', 'name' : 'Hebrew' },
    { 'code' : 'hz', 'name' : 'Herero' },
    { 'code' : 'hi', 'name' : 'Hindi' },
    { 'code' : 'ho', 'name' : 'Hiri Motu' },
    { 'code' : 'hu', 'name' : 'Hungarian' },
    { 'code' : 'is', 'name' : 'Icelandic' },
    { 'code' : 'io', 'name' : 'Ido' },
    { 'code' : 'ig', 'name' : 'Igbo' },
    { 'code' : 'id', 'name' : 'Indonesian' },
    { 'code' : 'ia', 'name' : 'Interlingua (International Auxiliary Language Association)' },
    { 'code' : 'ie', 'name' : 'Interlingue' },
    { 'code' : 'iu', 'name' : 'Inuktitut' },
    { 'code' : 'ik', 'name' : 'Inupiaq' },
    { 'code' : 'ga', 'name' : 'Irish' },
    { 'code' : 'it', 'name' : 'Italian' },
    { 'code' : 'ja', 'name' : 'Japanese' },
    { 'code' : 'jv', 'name' : 'Javanese' },
    { 'code' : 'kn', 'name' : 'Kannada' },
    { 'code' : 'kr', 'name' : 'Kanuri' },
    { 'code' : 'ks', 'name' : 'Kashmiri' },
    { 'code' : 'kk', 'name' : 'Kazakh' },
    { 'code' : 'rw', 'name' : 'Kinyarwanda' },
    { 'code' : 'kv', 'name' : 'Komi' },
    { 'code' : 'kg', 'name' : 'Kongo' },
    { 'code' : 'ko', 'name' : 'Korean' },
    { 'code' : 'kj', 'name' : 'Kwanyama, Kuanyama' },
    { 'code' : 'ku', 'name' : 'Kurdish' },
    { 'code' : 'ky', 'name' : 'Kyrgyz' },
    { 'code' : 'lo', 'name' : 'Lao' },
    { 'code' : 'la', 'name' : 'Latin' },
    { 'code' : 'lv', 'name' : 'Latvian' },
    { 'code' : 'lb', 'name' : 'Letzeburgesch, Luxembourgish' },
    { 'code' : 'li', 'name' : 'Limburgish, Limburgan, Limburger' },
    { 'code' : 'ln', 'name' : 'Lingala' },
    { 'code' : 'lt', 'name' : 'Lithuanian' },
    { 'code' : 'lu', 'name' : 'Luba-Katanga' },
    { 'code' : 'mk', 'name' : 'Macedonian' },
    { 'code' : 'mg', 'name' : 'Malagasy' },
    { 'code' : 'ms', 'name' : 'Malay' },
    { 'code' : 'ml', 'name' : 'Malayalam' },
    { 'code' : 'mt', 'name' : 'Maltese' },
    { 'code' : 'gv', 'name' : 'Manx' },
    { 'code' : 'mi', 'name' : 'Maori' },
    { 'code' : 'mr', 'name' : 'Marathi' },
    { 'code' : 'mh', 'name' : 'Marshallese' },
    { 'code' : 'ro', 'name' : 'Moldovan, Moldavian, Romanian' },
    { 'code' : 'mn', 'name' : 'Mongolian' },
    { 'code' : 'na', 'name' : 'Nauru' },
    { 'code' : 'nv', 'name' : 'Navajo, Navaho' },
    { 'code' : 'nd', 'name' : 'Northern Ndebele' },
    { 'code' : 'ng', 'name' : 'Ndonga' },
    { 'code' : 'ne', 'name' : 'Nepali' },
    { 'code' : 'se', 'name' : 'Northern Sami' },
    { 'code' : 'no', 'name' : 'Norwegian' },
    { 'code' : 'nb', 'name' : 'Norwegian Bokmål' },
    { 'code' : 'nn', 'name' : 'Norwegian Nynorsk' },
    { 'code' : 'ii', 'name' : 'Nuosu, Sichuan Yi' },
    { 'code' : 'oc', 'name' : 'Occitan (post 1500)' },
    { 'code' : 'oj', 'name' : 'Ojibwa' },
    { 'code' : 'or', 'name' : 'Oriya' },
    { 'code' : 'om', 'name' : 'Oromo' },
    { 'code' : 'os', 'name' : 'Ossetian, Ossetic' },
    { 'code' : 'pi', 'name' : 'Pali' },
    { 'code' : 'pa', 'name' : 'Panjabi, Punjabi' },
    { 'code' : 'ps', 'name' : 'Pashto, Pushto' },
    { 'code' : 'fa', 'name' : 'Persian' },
    { 'code' : 'pl', 'name' : 'Polish' },
    { 'code' : 'pt', 'name' : 'Portuguese' },
    { 'code' : 'qu', 'name' : 'Quechua' },
    { 'code' : 'rm', 'name' : 'Romansh' },
    { 'code' : 'rn', 'name' : 'Rundi' },
    { 'code' : 'ru', 'name' : 'Russian' },
    { 'code' : 'sm', 'name' : 'Samoan' },
    { 'code' : 'sg', 'name' : 'Sango' },
    { 'code' : 'sa', 'name' : 'Sanskrit' },
    { 'code' : 'sc', 'name' : 'Sardinian' },
    { 'code' : 'sr', 'name' : 'Serbian' },
    { 'code' : 'sn', 'name' : 'Shona' },
    { 'code' : 'sd', 'name' : 'Sindhi' },
    { 'code' : 'si', 'name' : 'Sinhala, Sinhalese' },
    { 'code' : 'sk', 'name' : 'Slovak' },
    { 'code' : 'sl', 'name' : 'Slovenian' },
    { 'code' : 'so', 'name' : 'Somali' },
    { 'code' : 'st', 'name' : 'Sotho, Southern' },
    { 'code' : 'nr', 'name' : 'South Ndebele' },
    { 'code' : 'es', 'name' : 'Spanish, Castilian' },
    { 'code' : 'su', 'name' : 'Sundanese' },
    { 'code' : 'sw', 'name' : 'Swahili' },
    { 'code' : 'ss', 'name' : 'Swati' },
    { 'code' : 'sv', 'name' : 'Swedish' },
    { 'code' : 'tl', 'name' : 'Tagalog' },
    { 'code' : 'ty', 'name' : 'Tahitian' },
    { 'code' : 'tg', 'name' : 'Tajik' },
    { 'code' : 'ta', 'name' : 'Tamil' },
    { 'code' : 'tt', 'name' : 'Tatar' },
    { 'code' : 'te', 'name' : 'Telugu' },
    { 'code' : 'th', 'name' : 'Thai' },
    { 'code' : 'bo', 'name' : 'Tibetan' },
    { 'code' : 'ti', 'name' : 'Tigrinya' },
    { 'code' : 'to', 'name' : 'Tonga (Tonga Islands)' },
    { 'code' : 'ts', 'name' : 'Tsonga' },
    { 'code' : 'tn', 'name' : 'Tswana' },
    { 'code' : 'tr', 'name' : 'Turkish' },
    { 'code' : 'tk', 'name' : 'Turkmen' },
    { 'code' : 'tw', 'name' : 'Twi' },
    { 'code' : 'ug', 'name' : 'Uighur, Uyghur' },
    { 'code' : 'uk', 'name' : 'Ukrainian' },
    { 'code' : 'ur', 'name' : 'Urdu' },
    { 'code' : 'uz', 'name' : 'Uzbek' },
    { 'code' : 've', 'name' : 'Venda' },
    { 'code' : 'vi', 'name' : 'Vietnamese' },
    { 'code' : 'vo', 'name' : 'Volap_k' },
    { 'code' : 'wa', 'name' : 'Walloon' },
    { 'code' : 'cy', 'name' : 'Welsh' },
    { 'code' : 'fy', 'name' : 'Western Frisian' },
    { 'code' : 'wo', 'name' : 'Wolof' },
    { 'code' : 'xh', 'name' : 'Xhosa' },
    { 'code' : 'yi', 'name' : 'Yiddish' },
    { 'code' : 'yo', 'name' : 'Yoruba' },
    { 'code' : 'za', 'name' : 'Zhuang, Chuang' },
    { 'code' : 'zu', 'name' : 'Zulu' }]

user_schema = UserSchema()

offer_schema = OfferLanguageSchema(many=True)

acpt_schema = AcceptLanguageSchema(many=True)


class UserLogout(Resource):
    @classmethod
    @jwt_required()
    def post(cls):
        jti = get_jwt()["jti"]
        BLACKLIST.add(jti)
        return {"message": "Logged out successfully", "errorCode": 0}, 200

class UserLogin(Resource):
    @classmethod
    def post(cls):
        user_json = request.get_json()
        user = User.find_by_username(user_json['username'])
        if user and check_password_hash(user.password, user_json['password']):
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)
            return {"access_token": access_token, "refresh_token": refresh_token, "errorCode": 0}, 200
        if not user:
            return {"message": "User name not found", "errorCode": 2}, 200
        if not check_password_hash(user.password, user_json['password']):
            return {"message": "Password wrong", "errorCode": 3}, 200

        return {"message": INVALID_CREDENTIALS, "errorCode": 1}, 200

class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def get(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user, fresh=False)
        return {"access_token": new_token}, 200

class UserRegister(Resource):
    @classmethod
    def post(cls):
        user_json = request.get_json()
        
        user = user_schema.load(user_json, session=db.session)

        user.password = generate_password_hash(user.password)
        try: # handling race condition
            b = user.save_to_db()
            # breaking the capsulation just for workaround 
            db.session.add_all(user.user_offer_langs)

            db.session.add_all(user.user_acpt_langs)

            db.session.commit()

            return { "user" : user_schema.dump(b), "errorCode": 0 }, 200

        except Exception as e:
            print(e)
            return { "message" : e, "errorCode": 1 }, 200

class MatchUserByLang(Resource):
    @classmethod
    def post(cls):
        payload = request.get_json()
        users = User.match_by_langs(payload)

        return { "users" : users, "errorCode": 0 }, 200

class EditProfile(Resource): 
    @classmethod
    @jwt_required()
    def put(cls):
        
        user = User.find_by_user_id(get_jwt_identity())
        
        user_json = request.get_json()

        if user:
            user.bio = user_json["bio"]

            user.update_user_langs(get_jwt_identity(), user_json["user_offer_langs"], user_json["user_acpt_langs"])

            return { "message":"OK", "errorCode": 0}, 200

        else:
            return {"message": "Invalid credential", "errorCode": 1}, 200

class GetAllLang(Resource): 
    @classmethod
    def get(cls):
        return allLang, 200

class GetMyProfile(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        
        user = User.find_by_user_id(get_jwt_identity())

        _user = user_schema.dump(user)
        
        if user.pic:
            pic = base64.b64encode(user.pic).decode('ascii') 
            _user["pic"] = "data:image/png;base64, " + pic

        return { "userprofile":_user, "errorCode": 0 }, 200

class GetUserProfile(Resource):
    @classmethod
    def get(cls):
        id = request.args.get('id')
        try:
            user = User.find_by_user_id(id)
            if user:
                _user = user_schema.dump(user)
                
                if user.pic:
                    pic = base64.b64encode(user.pic).decode('ascii') 
                    _user["pic"] = "data:image/png;base64, " + pic

                return { "userprofile":_user, "errorCode": 0 }, 200
            else:
                return { "userprofile": None, "errorCode": 1 }, 200
        except Exception as e:
            print(e)    
            return { "message": e, "errorCode": 2 }, 200

class GetMyLangs(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        try:
            langs = User.get_user_langs(id=get_jwt_identity())
            return {"langs":langs, "errorCode": 0}, 200
        except Exception as e:
            print(e)    

class GetUserLangs(Resource):
    @classmethod
    def get(cls):
        id = request.args.get('id')
        try:
            langs = User.get_user_langs(id=id)
            return {"langs":langs, "errorCode": 0}, 200
        except Exception as e:
            print(e)    
            return { "message": e, "errorCode": 2 }, 200

class CheckUserName(Resource):
    @classmethod
    def get(cls):
        if request.args.getlist('username'):
            user_name = request.args.getlist('username')[0]
            is_valid = re.match("^(?=.{8,20}$)[a-zA-Z0-9_.-]+$", user_name)
        
            if not is_valid:
                return {"message": "User Name must be 8-20 characters, alphanumeric and special characters (_.-) is allowed.", "errorCode": 1 }, 200

            if User.find_by_username(user_name):
                return {"message": USER_ALREADY_EXISTS, "errorCode": 2 }, 200
        
            return {"message": "User Name is available", "errorCode": 0 }, 200
        else:
            return {"message": "User Name must be 8-20 characters, alphanumeric and special characters (_.-) is allowed.", "errorCode": 1 }, 200

class CheckEmail(Resource):
    @classmethod
    def get(cls):
        if request.args.getlist('email'):
            regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            email = request.args.getlist('email')[0]
            is_valid = re.match(regex, email)

            if not is_valid:
                return {"message": "Email format is invalid", "errorCode": 1 }, 200

            if User.find_by_email(email):
                return {"message": EMAIL_ALREADY_EXISTS, "errorCode": 2 }, 200
        
            return {"message": "Email is available", "errorCode": 0 }, 200
        else:
            return {"message": "Email format is invalid", "errorCode": 1 }, 200