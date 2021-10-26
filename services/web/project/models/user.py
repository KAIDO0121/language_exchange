from project.models import db
from sqlalchemy.dialects.postgresql import JSONB
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)

    # User Authentication fields
    email = db.Column(db.String(255), nullable=False, unique=True)
    email_confirmed_at = db.Column(db.DateTime())
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(128))
    offer_language = db.Column(JSONB)
    accept_language = db.Column(JSONB)
    profile = db.Column(db.String(500), nullable=True)
    pic = db.Column(db.LargeBinary, nullable=True)

    def __init__(self, email, username, password, offer_language, accept_language, profile, pic):
        self.email = email
        self.username = username
        self.password = password
        self.offer_language = offer_language
        self.accept_language = accept_language
        self.profile = profile
        self.pic = pic

    @classmethod
    def find_by_username(cls, username: str) -> "User":
        return cls.query.filter_by(username=username).first()
    
    @classmethod
    def find_by_email(cls, email: str) -> "User":
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_offer_lan(cls, lancode: str, _level: int) -> "User":
        _users = User.query.join(OfferLanguage).filter_by(language_code = lancode, level = _level)
        return _users
    
    @classmethod
    def find_by_acpt_lan(cls, lancode: str, _level: int) -> "User":
        _users = User.query.join(AcceptLanguage).filter_by(language_code = lancode, level = _level)
        return _users

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()