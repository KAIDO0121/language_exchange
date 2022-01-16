from flask import Flask
from flask_jwt_extended import JWTManager
from project.blacklist import BLACKLIST
from flask_restful import Api
from flask_uploads import configure_uploads, patch_request_class
from project.resources.user import TokenRefresh, GetUserLangs, GetUserProfile, MatchUserByLang, CheckEmail, GetMyLangs, UserLogout, CheckUserName, UserRegister, UserLogin, EditProfile, GetMyProfile, GetAllLang
from project.resources.image import AvatarUpload
from project.ma import ma
from project.libs.image_helper import IMAGE_SET


def create_app():

    app = Flask(__name__)
    app.config.from_object('project.config.Config')
    # restrict max upload image size to 10MB
    patch_request_class(app, 10 * 1024 * 1024)
    configure_uploads(app, IMAGE_SET)
    from project.models import db
    db.init_app(app)
    ma.init_app(app)
    api = Api(app)
    jwt = JWTManager(app)
    # This method will check if a token is blacklisted, and will be called automatically when blacklist is enabled

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blacklist(decrypted_token, jwt_payload):
        return jwt_payload["jti"] in BLACKLIST

    api.add_resource(UserRegister, "/api/register")
    api.add_resource(CheckEmail, "/api/checkEmail")
    api.add_resource(CheckUserName, "/api/checkUserName")
    api.add_resource(UserLogin, "/api/login")
    api.add_resource(MatchUserByLang, "/api/matchUserByLang")
    api.add_resource(EditProfile, "/api/editProfile")
    api.add_resource(AvatarUpload, "/api/uploadPic")
    api.add_resource(GetMyProfile, "/api/getMyProfile")
    api.add_resource(GetAllLang, "/api/getAllLang")
    api.add_resource(TokenRefresh, "/api/tokenRefresh")
    api.add_resource(UserLogout, "/api/logout")
    api.add_resource(GetMyLangs, "/api/getMyLangs")
    api.add_resource(GetUserProfile, "/api/getUserProfile")
    api.add_resource(GetUserLangs, "/api/getUserLangs")

    return app
