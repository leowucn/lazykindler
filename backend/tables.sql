-- 存放书籍的相关元数据信息
CREATE TABLE book_meta (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid                TEXT,
    name                TEXT,         -- 书名
    asin                TEXT,         -- asin
    description         TEXT,         -- 描述
    author              TEXT,         -- 作者
	subjects            TEXT,         -- 标签
	stars               INTEGER,      -- 评分。满分10分
    size                INTEGER,      -- 图书大小
    publisher           TEXT,         -- 出版商
	coll_uuids          LONGTEXT,     -- colls uuids列表，分号相隔
	done_dates          TEXT,         -- 读完日期
	md5                 TEXT,         -- md5
	create_time         TEXT          -- 创建时间
);

-- 存放书籍封面
CREATE TABLE cover (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid           TEXT,
    name           TEXT,         -- 书名
    size           INTEGER,      -- 文件大小
	content        LONGTEXT,     -- 内容
	create_time    TEXT          -- 创建时间
);

-- 临时导入的书籍
CREATE TABLE tmp_book (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid                TEXT,
    create_time         TEXT
);

-- 集合
CREATE TABLE coll (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid                TEXT,
	name                TEXT,           -- 集合名
	coll_type           TEXT,           -- 类型，取值 book clipping
	description         TEXT,           -- 描述
    item_uuids          LONGTEXT,       -- item uuid集合
	subjects            TEXT,           -- 标签
	stars               INTEGER,        -- 评分。满分10分
    create_time         TEXT
);

-- 存放clipping
CREATE TABLE clipping (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid                TEXT,
	book_name           TEXT,         -- 书名
    author              TEXT,         -- 作者
    content             TEXT,         -- 剪切内容
	addDate             TEXT,         -- 添加时间
	subjects            TEXT,         -- 标签
	stars               INTEGER,      -- 评分。满分10分
	highlights          TEXT,         -- 高亮部分。如果有多个高亮，用 ___ 连接
	coll_uuids          LONGTEXT,     -- clipping_collections uuids列表，分号相隔
	md5                 TEXT,         -- md5
	deleted             INTEGER,      -- 是否被删除。1: 删除
	create_time         TEXT          -- 创建时间
);

-- 存放 comment
CREATE TABLE comment (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	uuid                TEXT,
	related_uuid        TEXT,         -- 被关联的uuid。比如该评论属于某个摘抄的
    content             TEXT,         -- 内容
	create_time         TEXT          -- 创建时间
);