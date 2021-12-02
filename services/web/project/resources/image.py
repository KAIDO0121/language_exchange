from flask_restful import Resource
from flask_uploads import UploadNotAllowed, IMAGES
from project.models.user import User
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

from project.libs import image_helper
from project.schemas.image import ImageSchema
from project.schemas.user import UserSchema

image_schema = ImageSchema()

user_schema = UserSchema()


class AvatarUpload(Resource):
    @jwt_required()
    def put(self):

        data = image_schema.load(request.files)

        ext = image_helper.get_extension(data["image"].filename)
       
        if ext[1:] not in IMAGES :
            return {"message": 'Extension: {ext} is illegal', "errorCode": 1 }, 200

        fileName = image_helper.is_filename_safe(data["image"].filename)

        if not fileName :
            return {"message": 'Filename: {fileName} is illegal', "errorCode": 2 }, 200

        user = User.find_by_user_id(get_jwt_identity())

        if user:                
            user.pic = data["image"].read()
        
            user.commit()

            return {"message": f'Filename: {data["image"].filename} is uploaded', "errorCode": 0 }, 200
        else:
            return {"message": "Invalid credential", "errorCode": 3 }, 200

