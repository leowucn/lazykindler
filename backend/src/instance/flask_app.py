# instance/flask_app.py

# third-party imports
from flask import Flask
from flask_cors import CORS
import os
import time

from ..service.clipping import ClippingHelper

from ..routes import books, clipping, collection, comment


# flask application initialization
app = Flask(__name__)

# cross origin resource sharing
# CORS(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

pid = os.fork()
if pid == 0:
    while True:
        time.sleep(10)
        clipping_helper = ClippingHelper()
        clipping_helper.import_clippings()

app.add_url_rule('/api/book/upload',
                 view_func=books.store_books, methods=['POST'])
app.add_url_rule('/api/book/all_meta',
                 view_func=books.get_books_meta, methods=['GET'])
app.add_url_rule('/api/book/get/uuids',
                 view_func=books.get_books_meta_by_uuids, methods=['GET'])
app.add_url_rule('/api/book/update',
                 view_func=books.update_book_meta, methods=['POST'])
app.add_url_rule('/api/book/update/cover',
                 view_func=books.update_book_cover, methods=['POST'])
app.add_url_rule('/api/book/cover',
                 view_func=books.get_book_cover, methods=['GET'])
app.add_url_rule('/api/book/delete',
                 view_func=books.delete_book, methods=['DELETE'])
app.add_url_rule('/api/book/delete/bykeyword',
                 view_func=books.delete_book_by_keyword, methods=['DELETE'])
app.add_url_rule('/api/book/delete/all',
                 view_func=books.delete_all_books, methods=['DELETE'])
app.add_url_rule('/api/book/delete/all/tmp',
                 view_func=books.delete_all_tmp_books, methods=['DELETE'])
app.add_url_rule('/api/book/download',
                 view_func=books.download_file, methods=['GET'])
app.add_url_rule('/api/book/download/all',
                 view_func=books.download_all_files, methods=['GET'])
app.add_url_rule('/api/book/read/uuid',
                 view_func=books.download_file_for_read, methods=['GET'])

app.add_url_rule('/api/collection/create',
                 view_func=collection.create_collection, methods=['POST'])
app.add_url_rule('/api/collection/get/all',
                 view_func=collection.get_all_collections, methods=['GET'])
app.add_url_rule('/api/collection/get/multiple',
                 view_func=collection.get_multiple_collections, methods=['GET'])
app.add_url_rule('/api/collection/delete/withoutitems',
                 view_func=collection.delete_coll_without_items, methods=['DELETE'])
app.add_url_rule('/api/collection/delete/withitems',
                 view_func=collection.delete_coll_with_items, methods=['DELETE'])
app.add_url_rule('/api/collection/delete/bykeyword',
                 view_func=collection.delete_coll_by_keyword, methods=['DELETE'])
app.add_url_rule('/api/collection/update',
                 view_func=collection.update_coll, methods=['POST'])
app.add_url_rule('/api/collection/update/cover',
                 view_func=collection.update_coll_cover, methods=['POST'])

app.add_url_rule('/api/clipping/get/all',
                 view_func=clipping.get_all_clippings, methods=['GET'])
app.add_url_rule('/api/clipping/get/uuids',
                 view_func=clipping.get_clipping_by_uuids, methods=['GET'])
app.add_url_rule('/api/clipping/delete',
                 view_func=clipping.delete_clipping, methods=['DELETE'])
app.add_url_rule('/api/clipping/update',
                 view_func=clipping.update_clipping, methods=['POST'])
app.add_url_rule('/api/clipping/delete/all',
                 view_func=clipping.delete_all_clipping, methods=['DELETE'])
app.add_url_rule('/api/clipping/highlight/add',
                 view_func=clipping.add_highlight_to_clipping, methods=['POST'])
app.add_url_rule('/api/clipping/highlight/delete',
                 view_func=clipping.delete_highlight_from_clipping, methods=['POST'])


app.add_url_rule('/api/comment/get/by_related_uuid',
                 view_func=comment.get_comments_of_related_uuid, methods=['GET'])
app.add_url_rule('/api/comment/create',
                 view_func=comment.create_comment, methods=['POST'])
app.add_url_rule('/api/comment/update',
                 view_func=comment.update_comment, methods=['POST'])
app.add_url_rule('/api/comment/delete',
                 view_func=comment.delete_comment, methods=['DELETE'])
