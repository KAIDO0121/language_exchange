from project.models import db
from project.models.lang import OfferLanguage
from flask_login import UserMixin
from project.models.lang import AcceptLanguage
from sqlalchemy import or_, and_
import base64


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
        user_dict = {}
        for c in self.__table__.columns:
            if c.name != "pic":
                user_dict[c.name] = getattr(self, c.name)
            elif getattr(self, c.name):
                pic = base64.b64encode(getattr(self, c.name)).decode('ascii')
                user_dict["pic"] = "data:image/png;base64, " + pic
            else:
                user_dict[c.name] = None
        return user_dict

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
    def update_user_langs(cls, id, offers, acpts) -> "User":
        try:
            user_offer_langs = OfferLanguage.query.filter(
                OfferLanguage.user_id == id).all()
            user_acpt_langs = AcceptLanguage.query.filter(
                AcceptLanguage.user_id == id).all()

            for i, lang in enumerate(user_offer_langs):
                lang.lang_name = offers[i]["lang_name"]
                lang.level = offers[i]["level"]

            for i, lang in enumerate(user_acpt_langs):
                lang.lang_name = acpts[i]["lang_name"]
                lang.level = acpts[i]["level"]

            db.session.commit()

        except Exception as e:
            print(e)

    @classmethod
    def get_user_langs(cls, **kwargs) -> "dict":
        _id = kwargs.get("id")
        if not _id:
            _id = kwargs.get("user")["id"]

        try:
            user_offer_langs = OfferLanguage.query.filter(
                OfferLanguage.user_id == _id).all()
            user_acpt_langs = AcceptLanguage.query.filter(
                AcceptLanguage.user_id == _id).all()

            return {"user_offer_langs": [lang.as_dict() for lang in user_offer_langs],
                    "user_acpt_langs": [lang.as_dict() for lang in user_acpt_langs]}

        except Exception as e:
            print(e)

    @classmethod
    def match_by_langs(cls,  payload: list) -> "dict":
        try:
            acpt_1 = payload["user_acpt_langs"][0]
            # dummy default value
            acpt_2 = {"lang_name": 'default', "level": float("inf")}
            acpt_3 = {"lang_name": 'default', "level": float("inf")}
            users = set()

            if len(payload["user_acpt_langs"]) > 1:
                acpt_2 = payload["user_acpt_langs"][1]
            if len(payload["user_acpt_langs"]) > 2:
                acpt_3 = payload["user_acpt_langs"][2]

            for offer_lang in payload["user_offer_langs"]:

                res = cls.query.join(AcceptLanguage).join(OfferLanguage).filter(and_(  # search someone is accepting my offer langs
                    AcceptLanguage.lang_name == offer_lang['lang_name'],
                    # and my offering level >= then someone's accecption
                    AcceptLanguage.level <= offer_lang['level']
                )).filter(and_(OfferLanguage.lang_name == acpt_1['lang_name'], OfferLanguage.level >= acpt_1['level']) |
                          and_(OfferLanguage.lang_name == acpt_2['lang_name'], OfferLanguage.level >= acpt_2['level']) |
                          and_(OfferLanguage.lang_name ==
                               acpt_3['lang_name'], OfferLanguage.level >= acpt_3['level'])
                          ).distinct().all()
                # and one of someone's offering level >= my accecption
                # distinct
                if res:
                    users.update(res)

            json_users = []

            for obj in list(users):  # jsonify user data
                json_users.append(obj.as_dict())

            # prepare user lang datas to list
            langs = [User.get_user_langs(user=user) for user in json_users]

            # { user_offer_langs:[ { lang:A, lv:2 }, { lang:B, lv:2 }, { lang:C, lv:3 }],
            # user_acpt_langs:[ { lang:A, lv:2 }, { lang:B, lv:2 }, { lang:C, lv:3 }] }

            def populate_user_lang(index, user):
                user["user_offer_langs"] = langs[index]["user_offer_langs"]
                user["user_acpt_langs"] = langs[index]["user_acpt_langs"]
                return user

            # { username : John,
            # user_offer_langs:[ { lang:A, lv:2 }, { lang:B, lv:2 }, { lang:C, lv:3 }],
            # user_acpt_langs:[ { lang:A, lv:2 }, { lang:B, lv:2 }, { lang:C, lv:3 }] }

            users_with_langs = [populate_user_lang(
                ind, user) for ind, user in enumerate(json_users)]

            return users_with_langs

        except Exception as e:
            print(e)

    def save_to_db(self):
        db.session.add(self)
        return self

    def commit(self) -> None:
        db.session.commit()
