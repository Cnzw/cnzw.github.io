---
title: VSCode Remote + Windows OpenSSH
urlname: 2024-08-24-VSCode Remote + Windows OpenSSH
date: '2024-08-24 20:51:29'
updated: '2024-09-08 18:01:58'
categories:
  - 折腾
top_img: 'https://atts.w3cschool.cn/attachments/image/20240108/1704680885590831.png'
abbrlink: 50514
---
在调试 mc 服务器时，想使用 Git 来管理各个插件的配置文件。于是逛了一圈 Windows 上的版本管理软件，发现操作的时候窗口很多（文件夹窗口 + 编辑器 + Git），从而转向 VSCode 这类继承了项目文件管理和 Git 的编码工具。

随后发现 VSCode Remote 是支持 Windows OpenSSH 的，VSCode Remote 体验基本和本地开发无异，甚至不需要开远程桌面，于是写此文章记录。
# 安装 SSH
一般来说，在 控制面板/设置 里的 应用>可选功能里。具体步骤见链接。
- [Windows 11 配置 ssh server 服务_windows11 gitea ssh server-CSDN博客](https://blog.csdn.net/engchina/article/details/134445460)

- [windows 安装 OpenSSH-CSDN博客](https://blog.csdn.net/frighting_ing/article/details/122705781)

需要注意，可能安装系统的时候 OpenSSH 是默认安装的，但是版本可能有问题无法启动。此时卸载再重新安装就可以了。
# 启动 SSH
首次安装 OpenSSH 需要手动到 services.msc（Windows+R键） 里启动来生成配置文件。重启 OpenSSH 也是在这里。
# 配置 SSH
配置文件在：`C:\ProgramData\ssh\sshd_config`

记得去掉`#`来启用配置项
## 修改端口
`Port 22`
## 禁用密码登录和允许密钥登录
启用并修改以下内容

`PasswordAuthentication no`

`PubkeyAuthentication yes`

`AuthorizedKeysFile .ssh/authorized_keys`

注释掉以下内容
```yaml
# Match Group administrators                                                    
#       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys  
```
## 配置密钥
将公钥内容放在`C:\Users\Administrator\.ssh\authorized_keys`中，重启后就可以了。



如果`.ssh`文件夹不存在，在 cmd 中输入`mkdir .ssh`即可。（直接创建文件夹会失败）

生成密钥对命令：`ssh-keygen`（注意路径，别找不到文件了）
# 配置 VSCode Remote
1. 点击 VSCode 左下角的

![image](https://cdn.cnzw.top/blog/GKyRbqR6XogmQFxK0v3cmCcYnUc.png)
1. 在弹出窗口选择“连接到主机...”

1. 在弹出窗口选择“配置 SSH 主机...”

1. 选择第一个配置文件（C:\Users\用户名\.ssh\config）

1. 编辑配置文件：

```yaml
Host 显示的名称
    HostName www.baidu.com
    Port 22
    User 用户名（administrator）
    IdentityFile C:\Users\用户名\.ssh\生成的私钥文件
Host 显示的名称2
    HostName www.baidu.com
    Port 22
    User 用户名（administrator）
    IdentityFile C:\Users\用户名\.ssh\生成的私钥文件
```
1. 再次 VSCode 左下角的“><”

1. 在弹出窗口选择“连接到主机...”

1. 在弹出窗口选择配置好的主机

1. 在确认了密钥签名后选择对应的系统（Linux，Windows，MacOS）

1. 等待远程主机下载 VSCode

1. 完事

