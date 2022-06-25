#!/usr/bin/env python
# -*- encoding: utf-8

import imghdr

from .File import MOBIFile


def get_mobi_cover(path):
    mobi_file = MOBIFile(path)
    cover_data = mobi_file.get_cover_image()

    img_format = imghdr.what(None, h=cover_data)
    return {
        "cover_format": img_format,
        "content": cover_data,
    }
