from project.ma import ma
from project.models.user import User
from marshmallow import validates, ValidationError
import re


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        load_only = ('password','pic',)
        exclude = ('id',)
        model = User
        load_instance = True
        include_relationships = True
        
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

    '''
class UserAndLangSchema(Schema):

    class Meta:
        model = User
        exclude = ('id', 'password',)
        load_instance = True
        include_relationships = True


        name = fields.Str()
        email = fields.Email()
        created_at = fields.DateTime()
  

    email = fields.Email()
    username = fields.Str()
    password = fields.Str()
    bio = fields.Str()
    pic = fields.Str()
    id = fields.Int()

    unknown = EXCLUDE
    '''

    