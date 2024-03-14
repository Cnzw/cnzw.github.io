---
title: Filebrowser Docker Volume 文件权限问题
urlname: 2023-01-03-Filebrowser Docker Volume 文件权限问题
date: '2023-01-03 22:27:00'
updated: '2024-03-13 19:59:29'
categories:
  - 折腾
tags:
  - typecho
abbrlink: 24110
---
近段时间折腾服务器，接触了 filebrowser。发现通过 filebrowser 上传的文件所属用户都默认为 root，由此导致了低级别用户（如 www）可以读取但无法写入数据，遂发本文。

在经过简单百度 [docker挂载volume的用户权限问题,理解docker容器的uid - Ryan.Miao - 博客园](https://www.cnblogs.com/woshimrf/p/understand-docker-uid.html) 后，可知需要设置运行 docker 容器的 uid 和 gid 为相对应的用户。



在系统内查询后可知 www 用户的 uid 和 gid 均为 1000，遂在 docker-compose 中设置：
```yaml
version: '3'
services:
  filbrowser:
    image: filebrowser/filebrowser
    user: "1000:1000"
```
设置完成后启动容器，发现容器报错退出：
```plaintext
listen tcp :80: bind: permission denied
```


此处是因为 uid 为 1000 的用户不是容器的的 root 权限用户（甚至没有被记录在 passwd 文件中），所以无法打开 1024 以下的低端口。所以需要调整 filebrowser 的默认端口。

首先将配置文件`.filebrowser.json`映射进容器，在配置文件中填写好 [默认的配置](https://github.com/filebrowser/filebrowser/blob/master/docker/root/defaults/settings.json) 后按需自行修改端口和数据库地址即可。（映射空文件是会报错的，必须填入完整配置）

数据库地址`database`按需更改，这是因为默认配置文件内的路径与官方 docker 教程内的映射的数据库路径不相符。
