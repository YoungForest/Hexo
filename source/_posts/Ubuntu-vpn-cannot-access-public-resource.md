---
title: Ubuntu OpenVPN 无法获取公网资源
date: 2021-03-18 11:20:13
tags: 
- Linux
categories:
- 折腾
---

由于科研需求，我需要连接杭州研究院的VPN，才能使用显卡做神经网络的训练任务。
然而在Ubunut 18.04配置好OpenVPN后，发现一个难题：连上VPN后无法上外网（百度等网站，不是墙外的网站，而是相对局域网内网的“外网”），断开VPN后可以连外网，但无法连接杭研院的资源。鉴于工作中，外网和杭研院内网基本缺一不可，我花了2天时间调研和修复改问题。而且其他同学使用VPN并没有类似问题，所以我认为是`Ubuntu`独特的问题。修复的操作很简单，但定位到问题的过程十分坎坷。

## 现象整理

连接VPN后，可以ping通baidu的IP，但浏览器无法连接baidu，也无法直接ping通baidu.com。浏览器只能打开杭研院和北航内部的网站。
初步判断是网络上DNS服务器的问题，但调研之后发现DNS的配置并无问题。
猜测是访问外部资源时，理应的DNS解析并没有办法完成。

最后在网上查了半天，才发现真正的问题（VPN本地配置问题）和解决方案。

## 解决方案

[网上最类似的一个问题和解决方案](https://askubuntu.com/a/713066/558370)

由于我是Ubuntu 18.04, 并不大一样。
在我这里给出我的完整解决方案，以供大家参考。

打开VPN的配置。

![Step 1](/images/vpn1.png)

![Step 2](/images/vpn2.png)

勾选“Use this connection only for resources on its network"

![Step 2](/images/vpn2.png)

Apply后，重新连接VPN即可解决问题。

## 后记

下一步，我还会试着在Ubuntu上装个跳板机。这样我的Mac或许可以通过该跳板机连入杭研院的机器。 (已经成功啦，下篇更新在[这里](https://youngforest.github.io/2021/03/26/SSH-proxy-by-jump-server/))。