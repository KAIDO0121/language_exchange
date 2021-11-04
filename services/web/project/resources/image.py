from flask_restful import Resource
from flask_uploads import UploadNotAllowed, IMAGES
from project.models.user import User
from flask import send_file, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import traceback
import os

from project.libs import image_helper
from project.schemas.image import ImageSchema
from project.schemas.user import UserSchema

image_schema = ImageSchema()

user_schema = UserSchema()


class ImageUpload(Resource):
    @jwt_required()
    def post(self):
        """
        This endpoint is used to upload an image file. It uses the
        JWT to retrieve user information and save the image in the user's folder.
        If a file with the same name exists in the user's folder, name conflicts
        will be automatically resolved by appending a underscore and a smallest
        unused integer. (eg. filename.png to filename_1.png).
        """
        data = image_schema.load(request.files)
        user_id = get_jwt_identity()
        folder = f"user_{user_id}"
        try:
            # save(self, storage, folder=None, name=None)
            image_path = image_helper.save_image(data["image"], folder=folder)
            # here we only return the basename of the image and hide the internal folder structure from our user
            basename = image_helper.get_basename(image_path)
            
            return {"message": f'{basename} uploaded' }, 201
        except UploadNotAllowed:  # forbidden file type
            
            extension = image_helper.get_extension(data["image"])
            return {"message": f'Extension {extension} is illegal' }, 400


class Image(Resource):
    @jwt_required()
    def get(self, filename: str):
        """
        This endpoint returns the requested image if exists. It will use JWT to
        retrieve user information and look for the image inside the user's folder.
        """
        user_id = get_jwt_identity()
        folder = f"user_{user_id}"
        # check if filename is URL secure
        if not image_helper.is_filename_safe(filename):
            return {"message": f'Filename: {filename} is illegal' }, 400
        try:
            # try to send the requested file to the user with status code 200
            
            return send_file(image_helper.get_path(filename, folder=folder))
        except FileNotFoundError as e:
            print(e)
            return {"message": f'Filename: {filename} is not found' }, 404

    @jwt_required()
    def delete(self, filename: str):
        """
        This endpoint is used to delete the requested image under the user's folder.
        It uses the JWT to retrieve user information.
        """
        user_id = get_jwt_identity()
        folder = f"user_{user_id}"

        # check if filename is URL secure
        if not image_helper.is_filename_safe(filename):
            return {"message": 'Filename: {filename} is not found' }, 400

        try:
            os.remove(image_helper.get_path(filename, folder=folder))
            return {"message": f'Filename: {filename} is deleted' }, 200
        except FileNotFoundError:
            return {"message": f'Filename: {filename} is not found' }, 404
        except:
            traceback.print_exc()
            return {"message": f'Deleting: {filename} failed' }, 500
            
class AvatarUpload(Resource):
    @jwt_required()
    def put(self):

        data = image_schema.load(request.files)

        ext = image_helper.get_extension(data["image"].filename)
       
        if ext[1:] not in IMAGES :
            return {"message": 'Extension: {ext} is illegal' }, 400

        fileName = image_helper.is_filename_safe(data["image"].filename)

        if not fileName :
            return {"message": 'Filename: {fileName} is illegal' }, 400

        user = User.query.filter_by(id=get_jwt_identity()).first()

        if user:                
            user.pic = data["image"].read()
        
            user.save_to_db()

            return {"message": f'Filename: Avatar is uploaded' }, 200

class Avatar(Resource):
    @classmethod
    def get(cls, user_id: int):
        """
        This endpoint returns the avatar of the user specified by user_id.
        """
        folder = "avatars"
        filename = f"user_{user_id}"
        avatar = image_helper.find_image_any_format(filename, folder)
        if avatar:
            return send_file(avatar)
        return {"message": gettext("avatar_not_found")}, 404
