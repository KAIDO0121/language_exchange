from project.models import db
from project.models.lang import OfferLanguage
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)

    # User Authentication fields
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(128))
    bio = db.Column(db.Text)
    pic = db.Column(db.LargeBinary, nullable=True)

    def __init__(self, email, username, password, bio, pic):
        self._id = id
        self.email = email
        self.username = username
        self.password = password
        self.bio = bio
        self.pic = pic

    @classmethod
    def find_by_username(cls, username: str) -> "User":
        return cls.query.filter_by(username=username).first()
    
    @classmethod
    def find_by_email(cls, email: str) -> "User":
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_offer_lan(cls, _langcode: str, _level: int) -> "User":
     
        ## 1. _langcode = en
        ## 2. _langcode = en and level = 3

        queries = [OfferLanguage.lang_code == _langcode]
        if _level:
            queries.append(OfferLanguage._level == _langcode)

        _users = OfferLanguage.query.filter(*queries)
        return _users
    
    @classmethod
    def find_by_acpt_lan(cls, lancode: str, _level: int) -> "User":
        _users = User.query.join(AcceptLanguage).filter_by(language_code = lancode, level = _level)
        return _users
    

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.flush()
        db.session.refresh(self)
        return self._id

    def delete_from_db(self) -> None:
        db.session.delete(self)
        db.session.commit()