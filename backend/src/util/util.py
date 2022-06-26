from flask import jsonify
import hashlib
import uuid
import os
import pathlib
import hashlib
from pathlib import Path
import epub_meta


def get_book_meta_info(book_path):
    return epub_meta.get_epub_metadata(
        book_path, read_cover_image=True, read_toc=True)


# 支持的电子书格式
supportedBookFormat = {
    ".mobi": True,
    ".azw3": True,
}


def if_ext_supported(ext):
    return ext.lower() in supportedBookFormat


def ls_books(dir):
    files = list()
    for item in os.listdir(dir):
        abspath = os.path.join(dir, item)
        try:
            if os.path.isdir(abspath):
                files = files + ls_books(abspath)
            else:
                if if_ext_supported(pathlib.Path(abspath).suffix):
                    files.append(abspath)
                # else:
                #     print("ls_books. 忽略文件: ", abspath)
        except FileNotFoundError as err:
            print('invalid directory\n', 'Error: ', err)
    return files


def handle_error(err_msg):
    status_code = 500
    success = False
    response = {
        'success': success,
        'error': {
            'message': err_msg
        }
    }

    return jsonify(response), status_code


def generate_uuid():
    return str(uuid.uuid4())


def get_md5(filepath):
    md5_hash = hashlib.md5()
    with open(filepath, "rb") as f:
        # Read and update hash in chunks of 4K
        for byte_block in iter(lambda: f.read(4096), b""):
            md5_hash.update(byte_block)
        return md5_hash.hexdigest()


def get_now():
    from datetime import datetime
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def is_all_chinese(strs):
    for _char in strs:
        if not '\u4e00' <= _char <= '\u9fa5':
            return False
    return True


# 返回 list1 去掉 list2 元素后的数组
def difference(list1, list2):
    list_difference = []
    for item in list1:
        if item not in list2:
            list_difference.append(item)
    return list_difference


def utf8len(s):
    return len(s.encode('utf-8'))


def add_md5_to_filename(filepath):
    filename, file_extension = os.path.splitext(filepath)
    print(file_extension)
    md5 = get_md5(filepath)

    con_str = "______"
    if con_str + md5 + file_extension not in filepath:
        return filename + con_str + md5 + file_extension
    return filepath


def remove_md5_from_filename(filepath):
    filename, file_extension = os.path.splitext(filepath)
    return filename.split("______", 1)[0] + file_extension


def escape_string(str):
    return str.translate(str.maketrans({"-":  r"\-",
                                        "]":  r"\]",
                                        "[":  r"\[",
                                        "【":  r"\【",
                                        "】":  r"\】",
                                        "&":  r"\&",
                                        ".":  r"\.",
                                        "/":  r"\/",
                                        "•":  r"\•",
                                        "\\": r"\\",
                                        "^":  r"\^",
                                        "$":  r"\$",
                                        "(":  r"\(",
                                        ")":  r"\)",
                                        "《":  r"\《",
                                        "》":  r"\》",
                                        "*":  r"\*",
                                        ".":  r"\.",

                                        "*":  r"\*",
                                        "+":  r"\+",
                                        "?":  r"\?",
                                        "{":  r"\{",
                                        "|":  r"\|",
                                        ",":  r"\,",
                                        "!":  r"\!",
                                        "~":  r"\~",
                                        })
                         )
