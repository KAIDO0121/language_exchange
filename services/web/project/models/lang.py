from sqlalchemy.orm import relationship
from project.models import db

class AcceptLanguage(db.Model):
    __tablename__ = 'accept_lang'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    lang_name = db.Column(db.String, nullable=False)
    

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        return self

class OfferLanguage(db.Model):
    __tablename__ = 'offer_lang'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    lang_name = db.Column(db.String, nullable=False)
    level = db.Column(db.Integer, nullable=False)

    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        return self