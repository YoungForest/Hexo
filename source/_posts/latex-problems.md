---
title: latex 使用过程中遇到的问题
date: 2018-03-27 19:27:55
tags:
- tex
categories:
description: 记录 LaTeX 论文编译成功但嵌入 PDF 图片仍显示空白的问题，以及通过匹配输出驱动版本恢复图片的方法。
translations:
  zh-CN: https://youngforest.github.io/2018/03/27/latex-problems/
  en: https://youngforest.github.io/en/2018/03/27/latex-problems/
---
笔者毕业设计论文的撰写使用了latex工具，遇到了许多问题，在此总结一下。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/latex-problems/zh-hero.webp" alt="论文装订机顺利吐出书页却留下空白插图窗，换上匹配齿轮后同一窗口终于显现图像" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

## pdf无法正常显示
### 问题描述
经过xelatex编译成功地文档无法正常显示pdf图片，显示的是一片空白。

### [原因](http://tieba.baidu.com/p/4191389769?traceid=)
pdf文件的版本问题。查看其版本为1.7，xelatex默认按照1.5进行编译。

### 解决方案
xelatex %.tex，此处加上--output-driver="xdvipdfmx -V7"。即修改msmake.bat
``` bash
xelatex %mythesis%
# =>
xelatex --output-driver="xdvipdfmx -V7" %mythesis%
```
