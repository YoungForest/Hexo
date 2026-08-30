---
title: atom 浅尝辄止
date: 2017-04-08 22:20:36
tags:
- atom
categories:
- 折腾
description: 记录为 Markdown 公式预览安装社区插件时遇到下载受阻，并通过给包管理器配置代理完成安装的排查过程。
translations:
  zh-CN: https://youngforest.github.io/2017/04/08/atom-explore/
  en: https://youngforest.github.io/en/2017/04/08/atom-explore/
---
## 配置代理
笔者的需求是在markdown文档中插入LaTeX公式, atom默认的`markdown-preview`包无法满足要求. 经过搜索, 社区包`markdown-preview-plus`可是满足该需求.

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/atom-explore/zh-hero.webp" alt="运送公式插件的小列车在封闭隧道前改走青绿色中继轨道，最终把组件送到 Markdown 工作台" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

### [atom包管理](http://flight-manual.atom.io/using-atom/sections/atom-packages/#atom-packages)
按照官方教程, 安装失败
> Installing “markdown-preview-plus@2.4.9” failed.

在log中, 笔者发现了这样的请求
 > GET https://atom.io/download/electron/v1.3.13/iojs-v1.3.13.tar.gz

笔者接着使用浏览器测试该网址, 无法相应, 猜测是被q了. 幸运的是, atom文档中考虑到使用代理的需要, 并给出了guide.

 [配置apm的代理](http://flight-manual.atom.io/getting-started/sections/installing-atom/#using-a-proxy)


最后, [fq基本功](http://blog.youngforest.me/2016/11/02/%E5%AE%9E%E7%8E%B0terminal%E4%BB%A3%E7%90%86/). 不解释.

### 具体命令
``` bash
sean@sean-OptiPlex-790:~$ apm config set https-proxy http://localhost:8123
sean@sean-OptiPlex-790:~$ apm config get https-proxy
http://localhost:8123/
sean@sean-OptiPlex-790:~$ apm install markdown-preview-plus
Installing markdown-preview-plus to /home/sean/.atom/packages ✓
```
