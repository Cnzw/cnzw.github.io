---
title: Tailscale 部署中继 DERP
urlname: 2024-03-21-Tailscale 部署中继 DERP
date: '2024-03-21 15:42:02'
updated: '2024-03-28 13:14:45'
categories:
  - 折腾
tags:
  - 家庭网络
abbrlink: 29369
---
# 什么是 DERP
DERP 即 Detoured Encrypted Routing Protocol，这是 Tailscale 自研的一个协议：
- 它是一个通用目的包中继协议，运行在 HTTP 之上，而大部分网络都是允许 HTTP 通信的。

- 它根据目的公钥（destination’s public key）来中继加密的流量（encrypted payloads）。

Tailscale 会自动选择离目标节点最近的 DERP server 来中继流量

Tailscale 使用的算法很有趣: 所有客户端之间的连接都是先选择 DERP 模式（中继模式），这意味着连接立即就能建立（优先级最低但 100% 能成功的模式），用户不用任何等待。然后开始并行地进行路径发现，通常几秒钟之后，我们就能发现一条更优路径，然后将现有连接透明升级（upgrade）过去，变成点对点连接（直连）。

因此， DERP 既是 Tailscale 在 NAT 穿透失败时的保底通信方式（此时的角色与 TURN 类似），也是在其他一些场景下帮助我们完成 NAT 穿透的旁路信道。换句话说，它既是我们的保底方式，也是有更好的穿透链路时，帮助我们进行连接升级（upgrade to a peer-to-peer connection）的基础设施。

Tailscale 官方内置了很多 DERP 服务器，分布在全球各地，惟独不包含中国大陆，原因你懂得。这就导致了一旦流量通过 DERP 服务器进行中继，延时就会非常高。
# 部署 DERP
https://github.com/fredliang44/derper-docker
```yaml
version: "3"
services:
  derper:
    image: ghcr.io/fredliang44/derper:latest
    volumes:
    - /www/docker/derper/certs:/app/certs
    - /var/run/tailscale/tailscaled.sock:/var/run/tailscale/tailscaled.sock # sock映射出来给客户端验证
    ports:
    - 3443:443 
    - 3478:3478/udp # 默认情况下也会开启 STUN 服务，UDP 端口是 3478
    restart: unless-stopped
    environment:
    - DERP_DOMAIN=derper.5112.xyz
    - DERP_CERT_MODE=manual
    - DERP_VERIFY_CLIENTS=true
```
关于证书部分需要重点说明：假设你的域名是 xxx.com，那么证书的名称必须是 xxx.com.crt，一个字符都不能错！同理，私钥名称必须是 xxx.com.key，一个字符都不能错！
# 防止 DERP 被白嫖
默认情况下 DERP 服务器是可以被白嫖的，只要别人知道了你的 DERP 服务器的地址和端口，就可以为他所用。如果你的服务器是个小水管，用的人多了可能会把你撑爆，因此我们需要修改配置来防止被白嫖。
1. 在 docker 环境变量中设置`DERP_VERIFY_CLIENTS=true`，开启客户端验证，

1. 把`/var/run/tailscale/tailscaled.sock`映射出来

1. 在 DERP 服务所在的主机上安装 Tailscale 客户端，启动 tailscaled 进程。

这样就大功告成了，别人即使知道了你的 DERP 服务器地址也无法使用，但还是要说明一点，即便如此，你也应该尽量不让别人知道你的服务器地址，防止别人有可趁之机。
# 使用 DERP
部署好 derper 之后，就可以修改 tailscale.com 上的 Access Controls 规则来使用自定义的 DERP 服务器了。
```json
{
        // ......
        "derpMap": {
                "OmitDefaultRegions": true,
                // OmitDefaultRegions 用来忽略官方的中继节点，一般自建后就看不上官方小水管了
                "Regions": {
                        // 这里的 901 从 900 开始随便取数字
                        "901": {
                                // RegionID 和上面的相等
                                "RegionID": 901,
                                // RegionCode 自己取个易于自己名字
                                "RegionCode": "阿里云-深圳",
                                "Nodes": [
                                        {
                                                // Name 保持 1不动
                                                "Name":     "1",
                                                // 这个也和 RegionID 一样
                                                "RegionID": 901,
                                                // 域名
                                                "HostName": "<你的域名>",
                                                // 端口号
                                                "DERPPort": 56473,
                                        },
                                ],
                        },
                },
        },
```
![image](https://cdn.cnzw.top/blog/FAQ3bvGqaoiG19x20ZBcqdZAnMh.png)


在 Tailscale 客户端上使用以下命令查看目前可以使用的 DERP 服务器：
```plaintext
$ tailscale netcheck
Report:
        * UDP: true
        * IPv4: yes, xx.154.29.252:50713
        * IPv6: yes, [::ffff:xx.154.29.252]:50713
        * MappingVariesByDestIP: false
        * HairPinning: false
        * PortMapping: UPnP, NAT-PMP, PCP
        * Nearest DERP: Tencent Guangzhou
        * DERP latency:
                -  1: 8.5ms   (阿里云-深圳)   -----> 这就是我们刚建的derp服务器
```
tailscale netcheck 实际上只检测 3478/udp 的端口， 就算 netcheck 显示能连，也不一定代表 23479 端口可以转发流量。最简单的办法是直接打开 DERP 服务器的 URL：https://derp.XXXX.cn:443，如果看到如下页面，且地址栏的 SSL 证书标签显示正常可用，那才是真没问题了。
![image](https://cdn.cnzw.top/blog/HWQxb2q9lo4BZmxpJRDc9mXcnWd.png)
# 参考
[Tailscale 基础教程：部署私有 DERP 中继服务器](https://icloudnative.io/posts/custom-derp-servers/)

[headscale保底设施之DERP中继服务器自建](https://junyao.tech/posts/18297f50.html)

[大内网战略(6)：自建 Tailscale DERP 中继服务器 保姆级教程](https://zhuanlan.zhihu.com/p/638910565)

[我的服务器系列：tailscale使用自定义derper服务器（docker部署）](https://linshen.netlify.app/tailscale-derper-docker/)
