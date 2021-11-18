from project.models import db
from project.models.lang import OfferLanguage
from flask_login import UserMixin
from project.models.lang import AcceptLanguage
from sqlalchemy import union, or_, and_

class User(db.Model, UserMixin):
    __tablename__ = 'users'
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
    def match_by_langs(cls,  payload: list) -> "User":
        try:
            _users = []
            for offer_lang in payload["user_offer_lang"]:
                acpt_1 = payload["user_acpt_lang"][0]
                acpt_2 = None
                acpt_3 = None
                if len(payload["user_acpt_lang"]) > 1 :
                    acpt_2 = payload["user_acpt_lang"][1]
                if len(payload["user_acpt_lang"]) > 2 :
                    acpt_3 = payload["user_acpt_lang"][2]
                q = cls.query.join(AcceptLanguage).join(OfferLanguage).filter(and_(
                    AcceptLanguage.lang_name==offer_lang['lang_name'], 
                    AcceptLanguage.level==offer_lang['level']
                )).filter(or_(and_(OfferLanguage.lang_name == acpt_1['lang_name'], OfferLanguage.level == acpt_1['level'] ), 
                    and_(OfferLanguage.lang_name == acpt_2['lang_name'], OfferLanguage.level == acpt_2['level'] ), 
                    and_(OfferLanguage.lang_name == acpt_3['lang_name'], OfferLanguage.level == acpt_3['level'] ) 
                )).all()
                _users.append(q)
               
            all = union(*_users)
            # _users = cls.query.join(AcceptLanguage).join(OfferLanguage).filter(AcceptLanguage.lang_name==_langname)
            
            return all
        except Exception as e:
            print(e)    

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()
        return self

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()