from project.ma import ma
from project.models.lang import AcceptLanguage, OfferLanguage
from marshmallow import fields


class AcceptLanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = AcceptLanguage
        load_instance = True
        dump_only = ("id", "user_id",)
        include_fk = True


class OfferLanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = OfferLanguage
        load_instance = True
        dump_only = ("id", "user_id",)
        include_fk = True
