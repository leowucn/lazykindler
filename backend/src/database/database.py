import sqlite3
from sqlite3 import Error
import sys
import base64
from pathlib import Path
from ..util.util import get_book_meta_info, get_now


class DB:
    def __init__(self):
        """ create a database connection to the SQLite database
                specified by the db_file
            :param db_file: database file
            :return: Connection object or None
            """
        self.conn = None
        try:
            import os.path
            path = Path(os.path.dirname(os.path.abspath(__file__))
                        ).parent.parent.absolute()
            db_path = os.path.join(path, "lazykindler.db")

            if not os.path.isfile(db_path):
                open(db_path, 'w+')
                sql_file_path = os.path.join(path, "tables.sql")
                with open(sql_file_path, 'r') as sql_file:
                    sql_script = sql_file.read()
                    con = sqlite3.connect(db_path)
                    cursor = con.cursor()
                    cursor.executescript(sql_script)
                    con.commit()
                    con.close()

            self.conn = sqlite3.connect(db_path, check_same_thread=False)
            self.conn.isolation_level = None
        except Error as e:
            print(e)

    def run_sql(self, sql):
        """
        执行sql,不返回结果
        :return:
        """
        cur = self.conn.cursor()
        cur.execute(sql)
        self.conn.commit()

    def run_sql_with_params(self, sql, params):
        """
        执行sql,不返回结果
        :return:
        """
        cur = self.conn.cursor()
        cur.execute(sql, params)
        self.conn.commit()

    def query(self, sql):
        try:
            cursor = self.conn.cursor()
            cursor.execute(sql)

            desc = cursor.description
            column_names = [col[0] for col in desc]
            data = [dict(zip(column_names, row))
                    for row in cursor.fetchall()]
            return data

        except Exception as error:
            print("Failed to get record. ", error)

    def insert_book(self, uuid, title, description, author, subjects, book_size, publisher, coll_uuids,
                    md5, book_path):
        cursor = self.conn.cursor()
        cursor.execute("begin")

        try:
            # 插入书籍元数据信息
            sql = """INSERT INTO book_meta (uuid, name, description, author, subjects, stars, size, publisher, coll_uuids, done_dates, md5, create_time) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) """
            err = None
            cover = None
            try:
                cover = get_book_meta_info(
                    book_path)['cover_image_content']
            except Exception as error:
                err = error
            finally:
                if err is not None:
                    cover = None

            data_tuple = (
                uuid,
                title,
                description,
                author,
                subjects,
                0,
                book_size,
                publisher,
                coll_uuids,
                "",
                md5,
                get_now()
            )
            cursor.execute(sql, data_tuple)

            # 插入书籍封面信息
            sql = """INSERT INTO cover (uuid, name, size, content, create_time ) 
                                        VALUES (?, ?, ?, ?, ?) """
            if cover is not None:
                data_tuple = (uuid, title, sys.getsizeof(
                    cover), cover, get_now())
                cursor.execute(sql, data_tuple)

            # 插入临时书籍
            sql = """INSERT INTO tmp_book (uuid, create_time) VALUES (?, ?) """
            data_tuple = (uuid, get_now())
            cursor.execute(sql, data_tuple)

        except Exception as error:
            self.conn.execute("rollback")
            print("Failed to insert books. ", error)

        self.conn.commit()
        cursor.close()

    def insert_coll(self, uuid, name, coll_type, description, subjects, stars, cover_content):
        cursor = self.conn.cursor()
        cursor.execute("begin")
        try:

            sql = """INSERT INTO coll (uuid, name, coll_type, description, subjects, stars, create_time) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?) """
            data_tuple = (
                uuid,
                name,
                coll_type,
                description,
                subjects,
                stars,
                get_now()
            )
            cursor.execute(sql, data_tuple)

            if cover_content is not None:
                sql = """INSERT INTO cover (uuid, name, size, content, create_time ) 
                                            VALUES (?, ?, ?, ?, ?) """
                data_tuple = (uuid, name, sys.getsizeof(
                    cover_content), cover_content, get_now())
                cursor.execute(sql, data_tuple)

        except Exception as error:
            self.conn.execute("rollback")
            print("Failed to insert coll. ", error)

        self.conn.commit()
        cursor.close()

    def insert_clipping(self, uuid, book_name, author, content, addDate, md5):
        cursor = self.conn.cursor()
        cursor.execute("begin")
        try:
            sql = """INSERT INTO clipping (uuid, book_name, author, content, addDate, md5, stars, create_time) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?) """
            data_tuple = (
                uuid,
                book_name,
                author,
                content,
                addDate,
                md5,
                0,
                get_now()
            )
            cursor.execute(sql, data_tuple)

        except Exception as error:
            self.conn.execute("rollback")
            print("Failed to insert clipping. ", error)

        self.conn.commit()
        cursor.close()

    def insert_comment(self, uuid, related_uuid, content):
        cursor = self.conn.cursor()
        cursor.execute("begin")
        try:
            sql = """INSERT INTO comment (uuid, related_uuid, content, create_time) 
                                        VALUES (?, ?, ?, ?) """
            data_tuple = (
                uuid,
                related_uuid,
                content,
                get_now()
            )
            cursor.execute(sql, data_tuple)

        except Exception as error:
            self.conn.execute("rollback")
            print("Failed to insert comment. ", error)

        self.conn.commit()
        cursor.close()


db = DB()
