from project.models import db


class AcceptLanguage(db.Model):
    __tablename__ = 'accept_lang'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    lang_name = db.Column(db.String, nullable=False)
    level = db.Column(db.Integer, nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def edit_entry(self, updated):
        self.level = updated["level"]
        self.lang_name = updated["lang_name"]
        db.session.commit()

    def save_to_db(self, langs):
        db.session.add_all(langs)


class OfferLanguage(db.Model):
    __tablename__ = 'offer_lang'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    lang_name = db.Column(db.String, nullable=False)
    level = db.Column(db.Integer, nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def save_to_db(self, langs):
        db.session.add_all(langs)

    def commit(self):
        db.session.commit()
