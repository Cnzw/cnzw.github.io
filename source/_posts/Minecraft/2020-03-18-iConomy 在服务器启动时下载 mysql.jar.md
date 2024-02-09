---
title: iConomy 在服务器启动时下载 mysql.jar
urlname: 2020-03-18-iConomy 在服务器启动时下载 mysql.jar
date: '2020-03-18 23:18:00'
updated: '2024-01-26 16:20:36'
categories:
  - Minecraft
tags:
  - typecho
abbrlink: 19466
---
在搞服务器经济同步时, 使用 iConomy7 通过 mysql 进行同步



在启动时观察到 iConomy 会尝试下载一个 mysql.jar 文件, 卡顿服务器启动半分钟左右的时间. 虽然下载失败, 但是 mysql 可以照常连接, 没有任何问题.



强迫症不能忍!



下面是启动日志
```plaintext
[22:38:37] [Server thread/INFO]: [iConomy] Enabling iConomy v7.0.6
[22:38:37] [Server thread/INFO]: [iConomy] Downloading mysql.jar...
[22:38:58] [Server thread/INFO]:    + mysql.jar (-1 B)
[22:39:19] [Server thread/INFO]: [iConomy] Error Downloading File: java.net.ConnectException: Connection timed out: connect
[22:39:19] [Server thread/INFO]: [iConomy] Finished Downloading.
```


可以确认的是, iC7访问的文件地址应该是不存在了, 所以下载失败.



百度无果,随后随着 google 来到了 [Github](https://github.com/iConomy/Core), 在 [src/com/iCo6/Constants.java](https://github.com/iConomy/Core/blob/iConomy6/src/com/iCo6/Constants.java) 中找到了 mysql.jar 文件的访问地址
```plaintext
Line 14 | MySQL(\"http://mirror.nexua.org/Dependencies/mysql-connector-java-bin.jar\", \"mysql.jar\"),
```


下面就非常简单了, 直接 hosts 改 ip , 在本地搭建服务器下载即可
```plaintext
[23:32:01 INFO]: [iConomy] Enabling iConomy v7.0.6
[23:32:01 INFO]: [iConomy] Downloading mysql.jar...
[23:32:01 INFO]:    + mysql.jar (2 MB)
[23:32:01 INFO]:    - mysql.jar finished.
[23:32:01 INFO]: [iConomy] Finished Downloading.
```



