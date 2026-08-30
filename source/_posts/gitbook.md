---
title: 用gitbook写一本书
date: 2019-07-16 15:34:35
description: 介绍用 GitBook 把零散 Markdown 内容组织成小书，并生成便于预览和发布的网页与 PDF。
tags:
categories:
- Programming
translations:
  zh-CN: https://youngforest.github.io/2019/07/16/gitbook/
  en: https://youngforest.github.io/en/2019/07/16/gitbook/
---
与博客不同，一本书相对内容更为完成，更为体系。博客相比之下就零散的多。不过优秀的系列博客也常常被改编成书。
如果你想分享规模更大，成体系的知识的话，写本小书是个很好的选择。
本文介绍一个工具`GitBook`，可以用Markdown写书，放在GitHub上，生成网页版和PDF版本的书籍。相较传统的Latex，更简单方便。适合当代程序员。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/gitbook/zh-hero.webp" alt="零散的空白笔记卡穿过模块化装订工作台，变成结构清晰的小书、连续网页卷轴和打印册页" width="1536" height="864" decoding="async">
</figure>

<!-- more -->

本文参考的资料主要来源于[官网](https://github.com/GitbookIO/gitbook/blob/master/docs/setup.md)，相较之下，重点更突出，可以快速地 初始化、撰写、发布 一本书。

Install gitbook command line tool:
```bash
npm install gitbook-cli -g
```

Create a book:
```bash
gitbook init ./directory
```

Preview and serve your book:
```bash
gitbook serve
```

Or build the static website:
```bash
gitbook build
```

Debug for better error message with stack trace:
```cpp
gitbook build ./ --log=debug --debug
```
