<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->

<img src="./header.svg" width="800" height="400" alt="Click to see the source">

# Lazy Kindler

# 支持的平台

目前只适配了 `mac` 平台，在 window 平台运行会有未知错误。

# 支持的电子书类型

mobi 和 azw3。其他类型的电子书在导入时会自动被忽略。\
如果时间充裕，后期可以考虑支持其他类型。

# 要解决的问题

从网上下载好几 Gb kindle 电子书以后，如何高效的管理这些电子书？
批量下载电子书的渠道很多，数千本一起打包下载也很常见。另外电子书的质量参差不齐, 有普通作家写的，也有世界大文豪写的。种类也很多，有科幻类、言情类、玄幻类型等等。如果每次找书都在一个包含了几千本书的目录里查找，可想而知效率是如何低下。因此有必要对这些电子书通过更好的方式进行管理，方便我们根据细分的偏好缩小需要查找的电子书范围，从而快速找到我们希望寻找的书籍，避免浪费过多查找时间。

# 功能介绍

## 书籍相关

### 书籍导入

点击`上传文件`按钮，平台将递归扫描 `~/Download`、`~/下载`、`~/Desktop`、`~/桌面` 等目录下受支持的电子书文件。相同文件不会重复上传。\

支持导入 mobi 和 azw3 格式的电子书, 目前平台不支持电子书格式转换。要找指定格式的电子书很容易，我一般在这个网站找电子书 http://www.fast8.com 。 这个网站的好处是书籍全，下载时提供了多种格式选择，直接下载指定格式的书籍，避免了电子书格式转换的时间开销。

### 书籍信息解析

导入电子书以后，平台会自动从受支持的电子书文件里提取电子书的元数据信息包括电子书封面、作者、出版社等等，用于页面展示和管理。

### 集合

比如我们可以创建 科幻小书集合、奇幻小说集合、言情小说集合等等，每个集合都可以从书库中选择并添加书籍，还可以对集合进行打分、添加标签、添加封面等等操作。这样我们就有了多个书籍的分类，此后可以直接从这些分类里查找书籍。

### 展示

为了让书籍从不同维度进行多种多样的展示，我们可以给书籍打分和添加标签，还可以修改作者以及出版社，书籍可以从评分、标签、作者、出版社等不同角度进行展示。

### 下载

平台里的书籍都可以在操作里点击`下载`，下载后书籍会被存放到用户主目录的 `下载` 或者 `Download`。

### 阅读

平台提供了阅读书籍的基本功能。平台支持上传的书籍格式是 `azw3` 和 `mobi`，目前没找到使用 reactjs 实现的合适的阅读这两种格式电子书的库，因此在开始阅读书籍时，平台会把这两种格式转换为 `epub`格式，使用的工具是 `/Applications/calibre.app/Contents/MacOS/ebook-convert`，因此要求使用平台时电脑要安装 `calibre`软件。因为阅读书籍涉及到电子书格式转换，所以第一次阅读某一本书籍时阅读器打开速度会比较慢，后面再次打开就快了。转换后的书籍被存放到了目录 `backend/data`。

### 处理流程

在 `书籍 -> 书库` 页面下展示的书籍属于我们正式存储的书籍，刚导入的书籍会被展示在 `书籍 -> 临时导入` 页面下。书籍被添加到指定集合以后，会被自动转移到 `书籍 -> 书库` 页面下。这样可以方便我们区分需要长期存储的书籍和临时导入的书籍，之所以要做区分，是因为长期存储的书籍经过了我们的筛选，删掉了不喜欢的书籍，并且进行了分类，而临时导入的书籍一般五花八门。如果对长期存储的书籍和临时导入的书籍不做区分，这样对管理会带来一些不便。

### 关于备份

平台的数据库采用了 `sqlite3`，目的是为了方便备份。初次启动平台时，会自动创建并初始化该数据库文件。数据库位置是 `backend/lazykindler.db`，该文件包含了平台的所有数据信息。另外往平台导入的书籍都被复制到了 `backend/data` 目录下，这样很方便备份。需要注意的是，平台为了方便操作，在 `backend/data` 下的书籍名后面都被添加了 `md5`。因此如果要对平台里所有书籍以及数据进行备份，只需要保存 `backend/lazykindler.db` 和 `backend/data` 这两个目录，下次在其他地方启动服务前，只要把`backend/lazykindler.db` 和 `backend/data` 复制到对应位置即可。

## kindle

### 导入 kindle clippings 文件内容

这个功能目前只支持 mac 平台使用。kindle 连接电脑后，平台会自动检测 kindle 是否连接，然后把 kindle 的 My Clippings.txt 导入到系统，用于统一管理和多维度展示. 当 kindle 的 My Clippings.txt 文件发生变化后，平台会自动导入 My Clippings.txt 文件里新增的部分，不会重复导入。这些过程都是自动完成的，不需要用户介入。用户只要刷新页面就能看到新增的 clipping。
需要注意的是，kindle 会把添加的高亮笔记处理成一坨文字，即使是多个段落有换行的文字在 My Clippings.txt 里也是一坨。layerkindler 通过巧妙的办法，在把 kindle 的 My Clippings.txt 中的高亮笔记在导入平台时，自动进行了换行处理，如下所示。

<img width="520" alt="Snipaste_2022-02-07_23-33-55" src="https://user-images.githubusercontent.com/16133390/168738445-5b796c99-edd8-4dfc-a1eb-7f84c96b0277.jpg">

### 对 clipping 进行高亮操作

clipping 是我们在读书时对有感触的文字进行高亮操作后记录下来的部分文字或者相关段落，往往是因为其中一句话或者一个词。当我们把 My Clippings.txt 导入平台后，在后期整理时，有必要对当时引起你共鸣的句或词进行高亮操作，方便我们在过了许久以后面对一大坨文字时，直接找到重点内容。
使用 lazykindler，你可以很轻易的做二次高亮操作.

<img width="520" alt="Snipaste_2022-02-07_23-33-55" src="https://user-images.githubusercontent.com/16133390/169091261-17f64dfc-4217-425c-b7b6-fe11aaf83b14.jpg">

### 对 clipping 添加评论

kindle 里的高亮笔记是读书时得到共鸣的地方，可以记录一下当时的想法。

![Xnip2022-05-21_11-19-05](https://user-images.githubusercontent.com/16133390/169633455-058f6380-d804-4dbf-963a-22283b74db13.jpg)

# 运行环境要求

python 3.10.4 \
nodejs v16.14.2 \
Calibre 软件 \

其他版本未经测试

# 启动服务

## 安装依赖

在项目 backend 目录执行

```
pip3 install -r requirements.txt
```

在项目 frontend 目录执行

```
yarn install
```

## 启动服务

在项目 backend 目录执行

```
python3 app.py
```

在项目 frontend 目录执行

```
yarn start
```

然后浏览器访问 http://localhost:8000

## 注意

平台仅为个人设计，没有登陆注册等功能。

# 平台展示

下面是我本地自己上传了书籍并配置了集合后的截图
<img width="1438" alt="Snipaste_2022-03-04_18-45-41" src="https://user-images.githubusercontent.com/16133390/169343497-36d6378a-6a59-45c3-b188-aa258d70c1b5.jpg">
<img width="1438" alt="Snipaste_2022-03-04_18-45-41" src="https://user-images.githubusercontent.com/16133390/169343459-9d37e57d-46f0-4759-9612-e39641a4a842.jpg">

<img width="1438" alt="Snipaste_2022-03-04_18-45-41" src="https://user-images.githubusercontent.com/16133390/167545605-2484499d-c53f-4819-9492-c3147b3ffca6.jpg">
<img width="1438" alt="Snipaste_2022-03-04_18-45-43" src="https://user-images.githubusercontent.com/16133390/167545628-82ce810d-0c77-448e-8b5c-152c859148aa.jpg">
<img width="1438" alt="Snipaste_2022-03-04_18-45-42" src="https://user-images.githubusercontent.com/16133390/167545619-34eb7788-fa19-4262-9417-4ed490e464ac.jpg">

![Xnip2022-06-26_22-37-42](https://user-images.githubusercontent.com/16133390/175819585-a5e4863d-fc24-4200-ac45-5cd0f5f829fb.jpg)
![Xnip2022-06-26_22-37-55](https://user-images.githubusercontent.com/16133390/175819589-f3a3bc07-14ff-4dd2-bcb2-7f6019d4d703.jpg)

![Xnip2022-06-26_22-39-43](https://user-images.githubusercontent.com/16133390/175819634-4a0d5981-1749-42e7-a531-98daccf7ec34.jpg)


# 其他

用于 kindle 的相关工具最有名的应该是 calibre，这个软件的功能偏向于 "编辑"，对于大量电子书的多维度展示做的相对简陋，因此打算自己写一个贴合用户实际需求的管理电子书的工具。
目前正在抽空开发，如果您也喜欢看电子书，并且对管理电子书有功能建议，不妨提一下 issue，谢谢
