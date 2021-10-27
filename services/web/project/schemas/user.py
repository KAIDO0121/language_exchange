from project.ma import ma
from project.models.user import User
from marshmallow import INCLUDE

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        dump_only = ("id",)
        unknown = INCLUDE
