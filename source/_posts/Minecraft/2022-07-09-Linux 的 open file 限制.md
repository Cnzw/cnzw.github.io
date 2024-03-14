---
title: Linux 的 open file 限制
urlname: 2022-07-09-Linux 的 open file 限制
date: '2022-07-09 16:19:00'
updated: '2024-03-14 23:10:20'
categories:
  - Minecraft
tags:
  - typecho
abbrlink: 17417
---
我在一台高配 Linux 开了 Minecraft 群组服, 在地图和玩家达到一定数量时, 会触发 open file 限制, 具体表现为服务端日志`error: too many open files`. 随之而来的就是大量地图文件无法读取, `session.lock`文件失效, 在游戏内的表现就是大量区块变成空置域, 玩家背包物品丢失.

具体的服务器启动关系是: 宝塔 -> Nodejs -> MCSM -> Java.


# 在发现问题的时候尝试了各种百度 / CSDN 的姿势, 均无果:
[Linux 下 Too many open files 问题排查与解决](https://www.cnblogs.com/greyzeng/p/14297258.html)

[linux open file 最大,怎样增大 Linux 系统的 open file(s) 上限](https://blog.csdn.net/weixin_42466518/article/details/117513063)

[Linux - 修改系统的max open files、max user processes (附ulimit的使用方法)](https://www.cnblogs.com/shoufeng/p/10620480.html)

[刨根问底，看我如何处理 Too many open files 错误](https://cloud.tencent.com/developer/article/1796671)



在尝试上述姿势后`cat /proc/’程序pid’/limits`显示仍然为`2048`.


# 经过两天的深入:
[实战：linux修改open files-2022.1.15](http://cncc.bingj.com/cache.aspx?q=%e4%bf%ae%e6%94%b9+daemon+open+files&d=4874487565780956&mkt=zh-CN&setlang=zh-CN&w=3ob5lpfUXuioqW6PpArjNuP0Xg9CZf36)

[Linux 系统修改 open files 无效](https://www.cnblogs.com/chinasoft/p/15341071.html)



这两篇文章中的修改`/etc/systemd/system.conf`**解决了我的问题**.

具体原因是 Nodejs 服务是由 systemctl 启动的, 受到`/etc/systemd/system.conf`限制的, 修改`/etc/security/limits.conf`对于服务是无效的.
# 后记
{% post_link '折腾/2022-07-09-Docker 启动报错 status=205!LIMITS' %}
