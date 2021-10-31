from project.ma import ma
from project.models.user import User
from project.schemas.lang import AcceptLanguageSchema, OfferLanguageSchema
from marshmallow import fields



class UserSchema(ma.SQLAlchemyAutoSchema):
   
    class Meta:
        load_only = ('password',)
        model = User
        load_instance = True
        
    '''
    id = fields.Integer(dump_only=True)
    username = fields.String(required=True)
    email = fields.String(required=True)
    password = fields.String(required=True)
    bio = fields.String()
    '''
    user_acpt_lang = fields.Nested(AcceptLanguageSchema, many=True, required=True)
    user_offer_lang = fields.Nested(OfferLanguageSchema, many=True, required=True)
    

class UserAndLangSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ('username', 'pic', 'user_acpt_lang', 'user_offer_lang')
    user_acpt_lang= ma.Nested(AcceptLanguageSchema, many=True)
    user_offer_lang= ma.Nested(OfferLanguageSchema, many=True)
    
