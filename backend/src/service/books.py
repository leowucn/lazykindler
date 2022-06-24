#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from flask import jsonify
import hashlib
from ..service import cover
import shutil
from pathlib import Path
from ..routes.books import ls_books

from ..service.collection import update_coll

from ..database.database import db
from ..core.kindle.meta.metadata import get_metadata
from ..util.util import add_md5_to_filename, generate_uuid, get_md5, get_now, is_all_chinese, difference, remove_md5_from_filename


def store_book_from_path(book_path, data_path):
    if_new_item = None
    uuid = generate_uuid()

    md5 = get_md5(book_path)
    book_meta_record = db.query(
        "select uuid from book_meta where md5='{}'".format(md5))
    if book_meta_record is not None and len(book_meta_record) > 0:
        uuid = book_meta_record[0]["uuid"]
        db.run_sql(
            "update tmp_book set create_time='{}' where uuid='{}'".format(get_now(), uuid))
        if_new_item = False
    else:
        # 书名
        title = ""
        # 出版商
        publisher = ""
        # 作者
        author = ""
        # 标签
        subjects = ""
        # 集合
        coll_uuids = ""

        book_size = os.path.getsize(book_path)

        meta = None
        has_error = False
        try:
            meta = get_metadata(book_path)
        except Exception as error:
            has_error = True
            print(
                "store_book_from_path------------book_path = {}, error = {}".format(book_path, error))
        finally:
            if has_error:
                return

        for key, value in meta.items():
            if key == "subject":
                res = []
                for v in value:
                    parts = v.split("-")
                    if len(parts):
                        for part in parts:
                            if is_all_chinese(part):
                                res.append(part)
                subjects = ";".join(res)
            if key == "updatedtitle":
                title = ';'.join(value)
            if key == "publisher":
                publisher = ';'.join(value)
            if key == "author":
                author = ";".join(value)

        if title is not None:
            title = title.strip()
        if publisher is not None:
            publisher = publisher.strip()
        if author is not None:
            author = author.strip()
        if subjects is not None:
            subjects = subjects.strip()

        if title == "":
            base = os.path.basename(book_path)
            title = os.path.splitext(base)[0]

        if title == "":
            title = None
        if publisher == "":
            publisher = None
        if author == "":
            author = None
        if subjects == "":
            subjects = None
        if coll_uuids == "":
            coll_uuids = None
        db.insert_book(uuid, title, None, author, subjects,
                       book_size, publisher, coll_uuids, md5, book_path)

        shutil.copy2(book_path, data_path)
        p1 = os.path.join(data_path, os.path.basename(book_path))
        p2 = add_md5_to_filename(p1)
        os.rename(p1, p2)

        if_new_item = True
    return if_new_item


def get_books_meta(storeType):
    data = []
    if storeType == 'no_tmp':
        # 查找正式存储的数据
        data = db.query(
            "select a.* from book_meta a where not exists (select null from tmp_book b where a.uuid = b.uuid);")
    else:
        # 查找临时存储的数据
        data = db.query(
            "select a.* from book_meta a where exists (select null from tmp_book b where a.uuid = b.uuid); ")

    data.sort(key=lambda x: x['size'], reverse=True)
    return jsonify(data)


def get_book_cover(uuid):
    data = db.query("select content from cover where uuid='{}';".format(uuid))
    if data is None or len(data) == 0:
        return ""
    return data[0]['content']


def delete_book(uuid):
    delete_book_data_by_uuid(uuid)

    db.run_sql("delete from book_meta where uuid='{}'".format(uuid))
    db.run_sql("delete from cover where uuid='{}'".format(uuid))
    db.run_sql("delete from tmp_book where uuid='{}'".format(uuid))

    colls = db.query(
        "select uuid, item_uuids from coll where item_uuids like '%{}%'".format(uuid))
    for coll in colls:
        item_uuids = coll['item_uuids'].split(';')
        item_uuids.remove(uuid)
        if item_uuids is None or len(item_uuids) == 0:
            db.run_sql_with_params(
                "update coll set item_uuids=? where uuid=?", (None, coll['uuid']))
        else:
            update_coll(';'.join(item_uuids),
                        coll['uuid'])
    return "success"


def update_book_meta(uuid, key, value):
    value = value.strip()
    value = value.replace(' ', '')
    value = value.removesuffix(';')

    if key == "coll_uuids":
        db.run_sql("delete from tmp_book where uuid='{}'".format(uuid))

        book_meta = db.query(
            "select coll_uuids from book_meta where uuid='{}';".format(uuid))[0]
        old_coll_uuids = []
        if book_meta["coll_uuids"] is not None:
            old_coll_uuids = book_meta["coll_uuids"].split(";")

        new_coll_uuids = []
        if value is not None:
            new_coll_uuids = value.split(";")
            if "" in new_coll_uuids:
                new_coll_uuids.remove("")

        # 处理删掉的集合，从集合中删掉书籍
        for coll_uuid in difference(old_coll_uuids, new_coll_uuids):
            coll_info = db.query(
                "select item_uuids from coll where uuid='{}';".format(coll_uuid))[0]
            coll_item_uuids = []
            if coll_info["item_uuids"] is not None:
                l = coll_info["item_uuids"].split(";")
                l.remove(uuid)
                if l is not None and len(l) > 0:
                    coll_item_uuids = l
            if len(coll_item_uuids) == 0:
                db.run_sql(
                    "update coll set item_uuids='{}' where uuid='{}'".format(None, coll_uuid))
            else:
                db.run_sql("update coll set item_uuids='{}' where uuid='{}'".format(
                    ";".join(coll_item_uuids), coll_uuid))

        # 处理新增书籍的集合
        for coll_uuid in difference(new_coll_uuids, old_coll_uuids):
            coll_info = db.query(
                "select item_uuids from coll where uuid='{}';".format(coll_uuid))[0]
            coll_item_uuids = []
            if coll_info["item_uuids"] is not None:
                l = coll_info["item_uuids"].split(";")
                l.append(uuid)
                coll_item_uuids = l
            else:
                coll_item_uuids.append(uuid)
            db.run_sql("update coll set item_uuids='{}' where uuid='{}'".format(
                ";".join(coll_item_uuids), coll_uuid))

    if value is None or value == "":
        db.run_sql_with_params(
            "update book_meta set {}=? where uuid=?".format(key), (None, uuid))
        return "success"
    else:
        db.run_sql("update book_meta set {}='{}' where uuid='{}'".format(
            key, value, uuid))
    return "success"


def get_books_meta_by_uuids(uuids):
    result = []
    for uuid in uuids:
        book_meta_list = db.query(
            "select * from book_meta where uuid='{}'".format(uuid))
        result = result + book_meta_list
    result.sort(key=lambda x: x['size'], reverse=True)
    return jsonify(result)


def delete_books_by_keyword(store_type, keyword, value):
    value = value.strip()
    uuids = []

    if value == "无标签":
        value = None
    if value == "无作者":
        value = None
    if value == "无出版社":
        value = None

    if store_type == "no_tmp":
        if keyword == "评分":
            if value is None:
                books = db.query(
                    "select uuid from book_meta a where stars is NULL and not exists (select null from tmp_book b where a.uuid = b.uuid);")
                for book in books:
                    uuids.append(book['uuid'])
            else:
                books = db.query(
                    "select uuid from book_meta a where stars='{}' and not exists (select null from tmp_book b where a.uuid = b.uuid);".format(int(value)))
                for book in books:
                    uuids.append(book['uuid'])
        elif keyword == "标签":
            if value is None:
                books = db.query(
                    "select uuid from book_meta a where subjects is NULL and not exists (select null from tmp_book b where a.uuid = b.uuid);")
                for book in books:
                    uuids.append(book['uuid'])
            else:
                books = db.query(
                    "select uuid from book_meta a where subjects like '^{};%' or subjects like '%;{}$' or subjects like '%;{};%' or subjects='{}' and not exists (select null from tmp_book b where a.uuid = b.uuid);".format(
                        value, value, value, value))
                for book in books:
                    uuids.append(book['uuid'])
        elif keyword == "作者":
            if value is None:
                books = db.query(
                    "select uuid from book_meta a where author is NULL and not exists (select null from tmp_book b where a.uuid = b.uuid);")
                for book in books:
                    uuids.append(book['uuid'])
            else:
                books = db.query(
                    "select uuid from book_meta a where author='{}' and not exists (select null from tmp_book b where a.uuid = b.uuid);".format(value))
                for book in books:
                    uuids.append(book['uuid'])
        elif keyword == "出版社":
            if value is None:
                books = db.query(
                    "select uuid from book_meta a where publisher is NULL and not exists (select null from tmp_book b where a.uuid = b.uuid);")
                for book in books:
                    uuids.append(book['uuid'])
            else:
                books = db.query(
                    "select uuid from book_meta a where publisher='{}' and not exists (select null from tmp_book b where a.uuid = b.uuid);".format(value))
                for book in books:
                    uuids.append(book['uuid'])
    else:
        if keyword == "评分":
            if value is None:
                books = db.query(
                    "select uuid from book_meta a where stars is NULL and exists (select null from tmp_book b where a.uuid = b.uuid);")
                for book in books:
                    uuids.append(book['uuid'])
            else:
                books = db.query(
                    "select uuid from book_meta a where stars='{}' and exists (select null from tmp_book b where a.uuid = b.uuid);".format(int(value)))
                for book in books:
                    uuids.append(book['uuid'])
        elif keyword == "标签":
            if value is None:
                books = db.query(
                    "select uuid from book_meta a where subjects is NULL and exists (select null from tmp_book b where a.uuid = b.uuid);")
                for book in books:
                    uuids.append(book['uuid'])
            else:
                books = db.query(
                    "select uuid from book_meta a where subjects like '^{};%' or subjects like '%;{}$' or subjects like '%;{};%' or subjects='{}' and exists (select null from tmp_book b where a.uuid = b.uuid);".format(
                        value, value, value, value))
                for book in books:
                    uuids.append(book['uuid'])
        elif keyword == "作者":
            if value is None:
                books = db.query(
                    "select uuid from book_meta a where author is NULL and exists (select null from tmp_book b where a.uuid = b.uuid);")
                for book in books:
                    uuids.append(book['uuid'])
            else:
                books = db.query(
                    "select uuid from book_meta a where author='{}' and exists (select null from tmp_book b where a.uuid = b.uuid);".format(value))
                for book in books:
                    uuids.append(book['uuid'])
        elif keyword == "出版社":
            if value is None:
                books = db.query(
                    "select uuid from book_meta a where publisher is NULL and exists (select null from tmp_book b where a.uuid = b.uuid);")
                for book in books:
                    uuids.append(book['uuid'])
            else:
                books = db.query(
                    "select uuid from book_meta a where publisher='{}' and exists (select null from tmp_book b where a.uuid = b.uuid);".format(value))
                for book in books:
                    uuids.append(book['uuid'])

    for uuid in uuids:
        delete_book(uuid)

    return "success"


def delete_all_books():
    books = db.query(
        "select uuid from book_meta")
    for book in books:
        db.run_sql("delete from cover where uuid='{}';".format(book['uuid']))

    colls = db.query(
        "select uuid from coll where coll_type='book'")
    for coll in colls:
        db.run_sql("delete from cover where uuid='{}'".format(coll['uuid']))

    db.run_sql("delete from book_meta")
    db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'book_meta'")

    db.run_sql("delete from coll where coll_type='book'")

    db.run_sql("delete from tmp_book")
    db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'tmp_book'")

    covers = db.query("select uuid from cover")
    if covers is None or len(covers) == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'cover'")

    colls = db.query("select uuid from coll")
    if colls is None or len(colls) == 0:
        db.run_sql("DELETE FROM sqlite_sequence WHERE name = 'coll'")

    path = Path(os.path.dirname(os.path.abspath(__file__))
                ).parent.parent.absolute()
    data_path = os.path.join(path, "data")
    isExist = os.path.exists(data_path)
    if isExist:
        shutil.rmtree(data_path)
    return "success"


def delete_all_tmp_books():
    books = db.query(
        "select uuid from tmp_book")
    for book in books:
        delete_book(book["uuid"])

    db.run_sql("delete from tmp_book")
    return "success"


def upsert_book_cover(uuid, cover_str):
    book_info = db.query(
        "select name from book_meta where uuid='{}'".format(uuid))[0]
    cover.upsert_book_cover(uuid, book_info['name'], cover_str)
    return "success"


# 从data目录删除书籍文件
def delete_book_data_by_uuid(uuid):
    book_info = db.query(
        "select md5 from book_meta where uuid='{}'".format(uuid))[0]
    target_md5 = book_info['md5']

    path = Path(os.path.dirname(os.path.abspath(__file__))
                ).parent.parent.absolute()
    data_path = os.path.join(path, "data")
    is_exist = os.path.exists(data_path)
    if not is_exist:
        return "success"

    filepaths = ls_books(data_path)
    for filepath in filepaths:
        if target_md5 in filepath:
            try:
                os.remove(filepath)
                break
            except OSError:
                break
    return "success"


def download_file(uuid):
    book_info = db.query(
        "select md5 from book_meta where uuid='{}'".format(uuid))[0]
    target_md5 = book_info['md5']

    path = Path(os.path.dirname(os.path.abspath(__file__))
                ).parent.parent.absolute()
    data_path = os.path.join(path, "data")
    is_exist = os.path.exists(data_path)
    if not is_exist:
        return "success"

    download_dir = str(Path.home() / "Downloads")
    if not os.path.isdir(download_dir):
        download_dir = str(Path.home() / "下载")

    filepaths = ls_books(data_path)
    for filepath in filepaths:
        if target_md5 in filepath:
            shutil.copy2(filepath, download_dir)

            md5_filename = os.path.basename(filepath)
            original_filename = remove_md5_from_filename(md5_filename)

            p1 = os.path.join(download_dir, md5_filename)
            p2 = os.path.join(download_dir, original_filename)
            os.rename(p1, p2)
            break
    return "success"


def download_all_files():
    download_dir = str(Path.home() / "Downloads")
    if not os.path.isdir(download_dir):
        download_dir = str(Path.home() / "下载")

    target_dir = os.path.join(download_dir, "lazykindler")
    isExist = os.path.exists(target_dir)
    if not isExist:
        os.makedirs(target_dir)

    path = Path(os.path.dirname(os.path.abspath(__file__))
                ).parent.parent.absolute()
    data_path = os.path.join(path, "data")
    is_exist = os.path.exists(data_path)
    if not is_exist:
        return "success"

    filepaths = ls_books(data_path)
    for filepath in filepaths:
        shutil.copy2(filepath, target_dir)

        md5_filename = os.path.basename(filepath)
        original_filename = remove_md5_from_filename(md5_filename)

        p1 = os.path.join(target_dir, md5_filename)
        p2 = os.path.join(target_dir, original_filename)
        os.rename(p1, p2)
    return "success"
