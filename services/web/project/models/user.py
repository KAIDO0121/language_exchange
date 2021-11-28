from project.models import db
from project.models.lang import OfferLanguage
from flask_login import UserMixin
from project.models.lang import AcceptLanguage
from sqlalchemy import or_, and_

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    user_offer_langs = db.relationship('OfferLanguage', backref='User')
    user_acpt_langs = db.relationship('AcceptLanguage', backref='User')
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(128))
    bio = db.Column(db.Text)
    pic = db.Column(db.LargeBinary, nullable=True)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @classmethod
    def find_by_email(cls, email: str) -> "User":
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_username(cls, username: str) -> "User":
        return cls.query.filter_by(username=username).first()
    
    @classmethod
    def find_by_user_id(cls, _id: int) -> "User":
        return cls.query.filter_by(id=_id).first()

    @classmethod
    def get_user_langs(cls, **kwargs) -> "User":
        _id = kwargs.get("id")
        if not _id:  
            _id = kwargs.get("user")["id"]
      
        try:
            user_offer_langs = OfferLanguage.query.filter(OfferLanguage.user_id==_id).all()
            user_acpt_langs = AcceptLanguage.query.filter(AcceptLanguage.user_id==_id).all()
            
            return { "user_offer_langs": [lang.as_dict() for lang in user_offer_langs], 
            "user_acpt_langs": [lang.as_dict() for lang in user_acpt_langs] }

        except Exception as e:
            print(e)

    @classmethod
    def match_by_langs(cls,  payload: list) -> "User":
        try:

            acpt_1 = payload["user_acpt_langs"][0]
            acpt_2 = None
            acpt_3 = None
            users = set()
            if len(payload["user_acpt_langs"]) > 1 :
                acpt_2 = payload["user_acpt_langs"][1]
            if len(payload["user_acpt_langs"]) > 2 :
                acpt_3 = payload["user_acpt_langs"][2]

            for offer_lang in payload["user_offer_langs"]:
                
                    res = cls.query.join(AcceptLanguage).join(OfferLanguage).filter(and_(
                        AcceptLanguage.lang_name==offer_lang['lang_name'], 
                        AcceptLanguage.level<=offer_lang['level']
                    )).filter(or_(and_(OfferLanguage.lang_name >= acpt_1['lang_name'], OfferLanguage.level >= acpt_1['level'] ), 
                        and_(OfferLanguage.lang_name >= acpt_2['lang_name'], OfferLanguage.level >= acpt_2['level'] ), 
                        and_(OfferLanguage.lang_name >= acpt_3['lang_name'], OfferLanguage.level >= acpt_3['level'] ) 
                    )).distinct().all()

                    if res:
                        users.update(res)
            
            json_users = []

            for obj in list(users):
                json_users.append(obj.as_dict())

            langs = [User.get_user_langs(user=user) for user in json_users ]

            
            def populate_user_lang(index, user) :
                user["user_offer_langs"] = langs[index]["user_offer_langs"] 
                user["user_acpt_langs"] = langs[index]["user_acpt_langs"] 
                return user


            users_with_langs = [populate_user_lang(ind, user) for ind, user in enumerate(json_users) ]


            return users_with_langs

            
        except Exception as e:
            print(e)    

    def save_to_db(self) -> None:
        db.session.add(self)
        return self

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()