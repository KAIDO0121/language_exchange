from project.ma import ma
from project.models.lang import AcceptLanguage, OfferLanguage
from marshmallow import fields


class AcceptLanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = AcceptLanguage
        load_instance = True
        dump_only = ("id", "user_id",)
    #    exclude = ("id", "user_id",)
        include_fk = True
    '''
    id = fields.Integer(dump_only=True)
    lang_name = fields.String(required=True)
    user_id = fields.Integer()
    '''

class OfferLanguageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = OfferLanguage
        load_instance = True
        dump_only = ("id", "user_id",)
    #    exclude = ("id", "user_id",)
        include_fk = True
    '''
    id = fields.Integer(dump_only=True)
    lang_name = fields.String(required=True)
    user_id = fields.Integer()
    level = fields.Integer()
    '''   


