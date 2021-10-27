from re import U
from sqlalchemy.orm import relationship
from project.models import db
from typing import Dict, Union

langJSON = Dict[str, Union[int, str]]

class AcceptLanguage(db.Model):
    __tablename__ = 'accept_lang'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    # username = db.Column(db.String, db.ForeignKey("user.username"))
    lang_code = db.Column(db.String, nullable=False)
    lang_name = db.Column(db.String, nullable=False)
    
    user = relationship("User")
    def __init__(self, user_id: int, lang_code: str, lang_name: str):
        self._user_id = user_id
        self.lang_code = lang_code
        self.lang_name = lang_name

    # def json(self) -> langJSON:
    #     return {"lang_code": self.lang_code, 
    #     "lang_name": self.lang_name}

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()

class OfferLanguage(db.Model):
    __tablename__ = 'offer_lang'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    # username = db.Column(db.String, db.ForeignKey("user.username"))
    lang_code = db.Column(db.String, nullable=False)
    lang_name = db.Column(db.String, nullable=False)
    level = db.Column(db.Integer, nullable=False)
    
    user = relationship("User")
    def __init__(self, user_id: int, lang_code: str, lang_name: str, level: int):
        self._user_id = user_id
        self.lang_code = lang_code
        self.lang_name = lang_name
        self.level = level

    
    # def json(self) -> langJSON:
    #     return {"lang_code": self.lang_code, 
    #     "lang_name": self.lang_name, "level": self.level}

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()