---
title: owncloud setup on server
date: 2017-08-20 22:42:32
tags:
  - Ubuntu
  - Owncloud
categories:
description: 记录在 Ubuntu 云主机上搭建个人云服务的过程：选择二进制安装包、启动 Web 服务、配置数据库，并准备多端客户端。
translations:
  zh-CN: https://youngforest.github.io/2017/08/20/owncloud-setup-on-server/
  en: https://youngforest.github.io/en/2017/08/20/owncloud-setup-on-server/
---
## 简介
[owncloud](https://owncloud.org/)是一个私有云解决方案，可以替代百度云。其提供企业版和个人版，个人可以利用服务器搭建个人版的owncloud。官网提供了多种服务器端解决方案。其中，自己编译可以获得最新版的owncloud；owncloud也提供了各大发行版软件库的[二进制安装包](https://download.owncloud.org/download/repositories/stable/owncloud/)，更方便快速，更适合个人的应用。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/owncloud-setup-on-server/zh-hero.webp" alt="一座自管的云形数据小屋把个人文件安全地送往电脑、手机和笔记本设备" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->
## 服务器环境
腾讯云的一台云主机。操作系统版本为Ubuntu 14.04.5 LTS (GNU/Linux 3.13.0-105-generic x86_64)。

## 搭建过程
### 安装owncloud
[通过apt库安装owncloud](https://download.owncloud.org/download/repositories/stable/owncloud/)。同时会安装很多依赖包，如apache2，php环境等。

### 启动apache服务
```
service httpd start
```

### 管理和设置owncloud
在浏览器的地址栏输入`ip/owncloud`或`域名/owncloud`，设置好管理员账户和密码就好了。

#### 配置MySQL
[参考](http://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html)

```
mysql --user=root --password
```

## Client install
### windows
### Android
### Linux
