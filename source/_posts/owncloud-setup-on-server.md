---
title: owncloud setup on server
date: 2017-08-20 22:42:32
tags:
	- Ubuntu
	- Owncloud
categories:
---
## ���
[owncloud](https://owncloud.org/)��һ��˽���ƽ����������������ٶ��ơ����ṩ��ҵ��͸��˰棬���˿������÷���������˰��owncloud�������ṩ�˶��ַ������˽�����������У��Լ�������Ի�����°��owncloud��owncloudҲ�ṩ�˸����а�������[�����ư�װ��](https://download.owncloud.org/download/repositories/stable/owncloud/)����������٣����ʺϸ��˵�Ӧ�á�

<!-- more -->
## ����������
��Ѷ�Ƶ�һ̨������������ϵͳ�汾ΪUbuntu 14.04.5 LTS (GNU/Linux 3.13.0-105-generic x86_64)��

## �����
### ��װowncloud
[ͨ��apt�ⰲװowncloud](https://download.owncloud.org/download/repositories/stable/owncloud/)��ͬʱ�ᰲװ�ܶ�����������apache2��php�����ȡ�

### ����apache����
```
service httpd start
```

### ���������owncloud
��������ĵ�ַ������`ip/owncloud`��`����/owncloud`�����úù���Ա�˻�������ͺ��ˡ�

#### ����MySQL
[�ο�](http://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html)

```
mysql --user=root --password
```

## Client install
### windows
### Android
### Linux
