from sqlalchemy.orm import session
from project.models import db
from project.models.lang import OfferLanguage
from flask_login import UserMixin
from project.models.lang import AcceptLanguage

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    user_offer_lang = db.relationship('OfferLanguage', backref='User')
    user_acpt_lang = db.relationship('AcceptLanguage', backref='User')
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(128))
    bio = db.Column(db.Text)
    pic = db.Column(db.LargeBinary, nullable=True)

    @classmethod
    def find_by_username(cls, username: str) -> "User":
        return cls.query.filter_by(username=username).first()
    
    @classmethod
    def find_by_email(cls, email: str) -> "User":
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_offer_lan(cls, _langname: str, _level: int) -> "User":
     
        try:
            _users = cls.query.join(OfferLanguage).filter(OfferLanguage.lang_name==_langname)
            if _level:
                _users = _users.filter(OfferLanguage.level>=_level)
           
            return _users.all()
        except Exception as e:
            print(e)
    
    @classmethod
    def find_by_acpt_lan(cls,  _langname: str) -> "User":
        try:
            _users = cls.query.join(AcceptLanguage).filter(AcceptLanguage.lang_name==_langname)

            return _users.all()
        except Exception as e:
            print(e)    

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()
        return self

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()