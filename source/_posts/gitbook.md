---
title: 用gitbook写一本书
date: 2019-07-16 15:34:35
tags:
categories:
- Programming
---

与博客不同，一本书相对内容更为完成，更为体系。博客相比之下就零散的多。不过优秀的系列博客也常常被改编成书。
如果你想分享规模更大，成体系的知识的话，写本小书是个很好的选择。
本文介绍一个工具`GitBook`，可以用Markdown写书，放在GitHub上，生成网页版和PDF版本的书籍。相较传统的Latex，更简单方便。适合当代程序员。

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