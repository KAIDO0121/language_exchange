import os


basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite://")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_BLACKLIST_ENABLED = True  # enable blacklist feature
    JWT_BLACKLIST_TOKEN_CHECKS =[
        "access",
        "refresh",
    ]  # allow blacklisting for access and refresh tokens
    JWT_SECRET_KEY = "mdfk"
    UPLOADED_IMAGES_DEST = '/usr/src/app/project/static/images' # manage root folder