---
title: 可道云 Kodexplorer 软链接访问问题
urlname: 2023-01-24-可道云 Kodexplorer 软链接访问问题
date: '2023-01-24 21:17:00'
updated: '2024-03-13 20:03:17'
categories:
  - 折腾
tags:
  - typecho
abbrlink: 43262
---
众所周知，MCSM的文件管理挺难用的。（虽然也在努力改进）在最开始的想法是使用 [下载 - 可道云-私有云存储& 协同办公平台_企业网盘_企业云盘_网盘_云盘](https://kodcloud.com/download/) 的，但是它的多用户并没有指定目录的功能，只能憨憨的把服务器扔到web目录下，既不安全也做不到多用户同时编辑一个服务器。所以那时候退了一步使用了基于 docker 的 filebrowser。【文章链接待补】

然后在最近突然开窍，Linux 不是有软链接功能嘛，再加上 kodexplorer 配置里的定义用户目录功能，可以实现服务器文件不在web目录下，而且多用户同时编辑的目标。



首先是软链接：

[软连接 - Linux软连接创建及一个“坑”](https://www.jianshu.com/p/9f0c8e113d95)

2023.02.28：直接在宝塔面板的文件管理新建软链接就行了，原谅我没看到 :(



创建完之后再到网页访问就发愁了，它提示没有权限“该文件或目录没有读权限”。

于是我先后尝试搜索关键词“php 软链接”和“nginx 软链接”，可以搜索到 nginx 是有相关配置需要开启的：

[Nginx 配置软链，报403无法访问。-CSDN博客](https://blog.csdn.net/chuozhun5567/article/details/100824630)

于是我配置了`disable_symlinks`，然后也配置了所有文件夹的权限，还是无法访问。

在最后想要放弃的时候，在 kod 的论坛乱逛查看是否有相关解决办法，结果真找到了前人 [docker部署的kodexplorer，往用户目录下添加软连接，没有读写权限 - 可道云社区](https://bbs.kodcloud.com/d/602-docker-kodexplorer)，也找到了触发我灵感的 [KodExplore 怎么挂载本地盘?或者挂载各种云? - 可道云社区](https://bbs.kodcloud.com/d/2027-kodexplore)，然后到`config/config.php`里边一瞅就明白了少了什么了：`open_basedir`！

因为我用的是宝塔面板，防跨站一键就可以关闭了，所以就不在此写如何操作了（反正我贴的连接也是百度出来的嘿嘿）。
