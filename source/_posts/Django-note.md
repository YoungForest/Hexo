---
title: Django使用总结
date: 2017-01-23 19:18:20
description: "回顾两天赶完数据库课设的经历：Django 框架、前后端协作、官方文档、结对编程，以及最后时刻的救场。"
tags:
- Database
- Django
categories:
translations:
  zh-CN: https://youngforest.github.io/2017/01/23/Django-note/
  en: https://youngforest.github.io/en/2017/01/23/Django-note/
---
**[摘要]** [Django](https://www.djangoproject.com/) 是一个高水平的Python Web框架, 可以帮助我们迅速开发, 设计一个干净, 程序化的应用. 虽然Django比较臃肿(现在大神都用[Flask](http://flask.pocoo.org/)?), 适合大型Web应用的开发, 笔者的数据库课程设计是一个小型工程, 但Django名声是在太大, 笔者之前在实验室也稍稍接触过, 所以和队友果断选择了Django. 我们的课设, 在Django的帮助下, 实现起来就和切菜一样.

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/Django-note/zh-hero.webp" alt="年轻 Forest 和队友打开一只大型框架工具箱，把数据库、后端和页面模块迅速装成一座小型充电站模型" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->
数据库课设最近出分了, 只得了良好, 未如愿取得优秀. 但两天完成数据库的经验确实使笔者学到了很多, Django框架的使用, 前后端的概念, 结对编程的合作... 其中最想和大家分享的是Django框架的使用, 幸亏有该框架, 让我们可以专注于后端和数据库的设计实现, 还能轻松实现一个看得过去的前端. 事半功倍, 没有被拖延症害死.

<figure class="editorial-illustration">
  <img src="/images/ai/Django-note/zh-deadline-rescue.webp" alt="倒计时时钟逼近终点，Forest 与队友在工作台两侧同时修补功能模块和散落文档，终于让课程项目亮起" width="1536" height="864" loading="lazy" decoding="async">
</figure>

## 时间分配:

完成数据库用了两天(而且有一天是边刷"潜伏"边写程序的), 之前都是在学习Django, 文档甚至大部分是答辩完之后补完的.

## 人员分配:

原本的计划是抱tls大腿, 所有前后端由tls完成, 笔者帮助写写文档. 不过后来, 鉴于tls经常养精蓄锐, 一直在学习Django, 最后几个小时仍未有看的见的成果. 笔者就慌了, 在之前练习的基础上, 修补完善, 勉强实现预计功能, 完成课设. 最后文档是两个人一起紧急补完的, tls最后一个小时又帮助实现了两个新功能.

## Django使用总结

[官方文档](https://docs.djangoproject.com/en/1.10/)是很完善和亲民的, 需要用的功能都可以在上面找到. 缺点是, 太庞大, 不好找; 而且是英文的, 官方文档更新太快, 中文文档的翻译根本跟不上, 笔者的六级刚刚飘过, 很是头疼, 不过仍是喜欢看官方的英文文档, 感觉更有帮助.

### 练习

笔者是跟着andrew-liu的用[Django搭建博客](https://andrew-liu.gitbooks.io/django-blog/content/)的教程, 熟悉一步步的命令和操作的. 这个教程很适合初学者用来熟悉Django的基础命令和文件结构. 但一个明显的恶果是, 最后, 我们的课设`电动汽车充电站管理系统`的效果看上去和博客差不多.

## 总结

这篇post干货比较少, 实在是因为笔者学艺不精, 没有更过可以分享的. 如果下次要需要再次使用Django, 笔者一定会回来再次补充的.
