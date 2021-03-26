---
title: SSH 通过跳板机登陆服务器
date: 2021-03-26 15:11:02
tags:
- tech
categories:
- 折腾
---

## 动机

接上篇[解决台式机Ubuntu VPN访问公网资源](https://youngforest.github.io/2021/03/18/Ubuntu-vpn-cannot-access-public-resource/)的问题后，我尝试了配置跳板机访问杭研院机器。

在科研工作中，MAC笔记本无法连接OpenVPN，从而访问杭研院机器。我的台式机Ubuntu已经配置好了VPN，可以访问服务器。我现在想通过台式机Ubuntu中转，从而实现MAC“直接”访问杭研院。抽象一下问题为：
- A可以访问B
- A不可以访问C
- B可以访问C
- 我现在想A访问C

由于工作中主要使用SSH，因此，问题简化成A通过SSH直接登陆C。
我经过不屑的网上搜索和尝试，总结了2中技术和方法实现我的目的。
- SSH 代理
- SSH 隧道

<!-- more -->


## SSH 代理

这种方法最简单，不需要在B上进行任何操作，无缝连接C。

A上执行，其中`rentao@10.134.150.154`是B，`ldmc@192.168.131.181`是C。

```bash
ssh -o "ProxyJump rentao@10.134.150.154" ldmc@192.168.131.181
```

Reference: [穿越跳板机](https://www.xiebruce.top/650.html)

## SSH 隧道

B上执行:
```bash
ssh -f -N -L 0.0.0.0:9906:192.168.131.181:22 ldmc@192.168.131.181
```

A上执行:
```bash
ssh -p 9906 ldmc@10.134.150.154
```

虽然这种方法看起来更麻烦些，需要A B协作。但是相比第一种方法，其实更加灵活。可以通过SSH 隧道的方式通过B中转暴露更多C的服务（如观察训练数据的tensorboard HTTP服务也是我常需要暴露的），并不一定是SSH登陆。

Reference: [SSH 端口转发：SSH 隧道](https://www.zsythink.net/archives/2450)