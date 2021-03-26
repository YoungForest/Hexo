---
title: ssh免密登陆服务器
date: 2018-05-08 18:47:09
tags:
- tech
categories:
- 折腾
---
以下命令仅针对Unix-like系统。
Windows是不需要这样的解决方法的，Windows下很多类Putty工具都可以选择"记住密码"来实现免密登陆。
我在Mac上没有找到类似记住密码的解决方案，但使用Key事实上是更安全的一种方式。

<!--more-->

## step1: 生成rsa密钥对
``` bash
ssh-keygen -t rsa
```

## step2: 上传rsa公钥到服务器
``` bash
cat id_rsa.pub | ssh -p 26757 root@138.128.193.150 'cat >> .ssh/authorized_keys'
```

## step3: 更改权限
``` bash
ssh -p 26757 root@138.128.193.150 "chmod 700 .ssh; chmod 640 .ssh/authorized_keys"
```

## step4: success!
```bash
ssh -p 26757 root@138.128.193.150
```

reference: 
[ssh-passwordless-login-using-ssh-keygen-in-5-easy-steps](https://www.tecmint.com/ssh-passwordless-login-using-ssh-keygen-in-5-easy-steps/)