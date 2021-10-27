from project.ma import ma
from project.models.lang import AcceptLanguage, OfferLanguage


class AcceptLanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = AcceptLanguage
        dump_only = ("id",)

class OfferLanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = OfferLanguage
        dump_only = ("id",)

