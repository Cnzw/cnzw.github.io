---
title: Docker 启动报错 status=205/LIMITS
urlname: 2022-07-09-Docker 启动报错 status=205/LIMITS
date: '2022-07-09 16:28:00'
updated: '2024-03-14 23:10:36'
categories:
  - 折腾
tags:
  - typecho
abbrlink: 5823
---
相关文章: [centos 7.8.2003版本docker安装失败问题记录](https://blog.csdn.net/rockstics/article/details/108670563)



出现的原因是因为我在上一篇文章（{% post_link 'Minecraft/2022-07-09-Linux 的 open file 限制' %}）修改了`/etc/systemd/system.conf`, 随后在重启后发现 Docker 无法启动, 查看对应日志:
```prolog
[root@jh-java ~]# systemctl start docker
Job for docker.service failed because the control process exited with error code. See “systemctl status docker.service” and “journalctl -xe” for details.
[root@jh-java ~]# systemctl status docker
● docker.service - Docker Application Container Engine
Loaded: loaded (/usr/lib/systemd/system/docker.service; disabled; vendor preset: disabled)
Active: failed (Result: exit-code) since Fri 2020-09-18 17:25:33 CST; 6min ago
Docs: https://docs.docker.com
Process: 10174 ExecStart=/usr/bin/dockerd (code=exited, status=205/LIMITS)
Main PID: 10174 (code=exited, status=205/LIMITS)

Sep 18 17:25:33 jh-java systemd[1]: Starting Docker Application Container Engine…
Sep 18 17:25:33 jh-java systemd[10174]: Failed at step LIMITS spawning /usr/bin/dockerd: Operation not permitted
Sep 18 17:25:33 jh-java systemd[1]: docker.service: main process exited, code=exited, status=205/LIMITS
Sep 18 17:25:33 jh-java systemd[1]: Failed to start Docker Application Container Engine.
Sep 18 17:25:33 jh-java systemd[1]: Unit docker.service entered failed state.
Sep 18 17:25:33 jh-java systemd[1]: docker.service failed.
```


在经过查询后得知是因为 open file 限制的问题, 需要修改`/lib/systemd/system/<服务名>.service`的`LimitNOFILE=unlimited`为`LimitNOFILE=<对应上限>`**即可解决**
