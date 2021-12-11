import os
import re
from typing import Union
from werkzeug.datastructures import FileStorage

from flask_uploads import UploadSet, IMAGES

IMAGE_SET = UploadSet("images", IMAGES)  # set name and allowed extensions


def save_image(image: FileStorage, folder: str = None, name: str = None) -> str:
    return IMAGE_SET.save(image, folder, name)


def get_path(filename: str = None, folder: str = None) -> str:
    return IMAGE_SET.path(filename, folder)


def _retrieve_filename(file: Union[str, FileStorage]) -> str:
    """
    Make our filename related functions generic, able to deal with FileStorage object as well as filename str.
    """
    if isinstance(file, FileStorage):
        return file.filename
    return file


def is_filename_safe(file: Union[str, FileStorage]) -> bool:
    """
    Check if a filename is secure according to our definition
    - starts with a-z A-Z 0-9 at least one time
    - only contains a-z A-Z 0-9 and _().-
    - followed by a dot (.) and a allowed_format at the end
    """
    filename = _retrieve_filename(file)

    allowed_format = "|".join(IMAGES)
    # format IMAGES into regex, eg: ('jpeg','png') --> 'jpeg|png'
    regex = f"^[a-zA-Z0-9][a-zA-Z0-9_()-\.]*\.({allowed_format})$"
    return re.match(regex, filename) is not None


def get_extension(file: Union[str, FileStorage]) -> str:
    """
    Return file's extension, for example
    get_extension('image.jpg') returns '.jpg'
    """
    filename = _retrieve_filename(file)
    return os.path.splitext(filename)[1]
