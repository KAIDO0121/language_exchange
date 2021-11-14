from project.ma import ma
from project.models.user import User
from project.schemas.lang import AcceptLanguageSchema, OfferLanguageSchema
from project.schemas.image import ImageSchema
from marshmallow import fields, validates, ValidationError
import re


class UserSchema(ma.SQLAlchemyAutoSchema):
   
    class Meta:
        load_only = ('password','pic', )
        exclude = ('id',)
        model = User
        load_instance = True
        
    @validates("username")
    def validate_username(self, value):
        is_valid = re.match("^(?=.{8,20}$)[a-zA-Z0-9_.-]+$", str(value))
        if not is_valid:
            raise ValidationError("User Name must be 8-20 characters, alphanumeric and special characters (_.-) is allowed.")

    @validates("email")
    def validate_email(self, value):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        is_valid = re.match(regex, str(value))
        if not is_valid:
            raise ValidationError("Email format is invalid")

    @validates("password")
    def validate_password(self, value):
        is_valid = re.match("^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$", str(value))
        if not is_valid:
            raise ValidationError("Password must be 6-15 characters, contain both alphanumeric and a special characters (!@#$%^&*).")
         

    user_acpt_lang = fields.Nested(AcceptLanguageSchema, many=True, required=True)
    user_offer_lang = fields.Nested(OfferLanguageSchema, many=True, required=True)

class UserAndLangSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ('username', 'pic', 'user_acpt_lang', 'user_offer_lang')
    user_acpt_lang= ma.Nested(AcceptLanguageSchema, many=True)
    user_offer_lang= ma.Nested(OfferLanguageSchema, many=True)
    
