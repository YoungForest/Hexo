---
title: 将博客园中的随笔迁移到Hexo
tags:
  - Hexo
categories:
  - 折腾
date: 2016-11-22 01:42:23
---

有关如何将其他博客上的文章迁移到`Hexo`上, [官方文档](https://hexo.io/docs/migration.html)给出了一些指引. 我也是根据官方文档进行了将自己之前在博客园中的随笔迁移到新博客上的尝试. 这个过程中遇到过一些问题, 再此给出解决方法.

## 未安装迁移插件

博客园需要用rss迁移, 我根据文档, `$ npm install hexo-migrator-rss --save` 安装了相关的插件, 但在运行迁移命令`$ hexo migrate rss <source>`时, 报出了如下错误:

``` bash
undefined migrator plugin is not installed.
Installed migrator plugins:

For more help, you can check the online docs: http://hexo.io/
```

我在[stackoverflow](http://stackoverflow.com/questions/34025076/when-running-hexo-migrate-rss-it-prompt-undefined-migrator-plugin-is-not-insta)上找到了答案. 原来是需要在博客所在的目录下运行安装插件命令`$ npm install hexo-migrator-rss --save`才可以. 看来还是我不熟悉nodejs的原因, 因为nodejs的包管理安装默认是局部的, 安装在当前文件夹下的.

在博客所在目录下重新安装"hexo-migrator-rss"插件, 问题解决.

## 迁移后的文章只有摘要和超链接
成功迁移后, 我兴奋地立即查看了迁移结果, 结果发现, 迁移的文章只有摘要和链接到博客园原文章的超链接, 就想下图一样. 这显然不是我想要的.

![迁移不完全](https://cloud.githubusercontent.com/assets/13612111/20493077/5f16663e-b052-11e6-9a0f-256d35ca6110.png)

可以发现这是由于博客园导出的rss就是这样的. 通过观察, 我发现rss的链接只是一个包含文章信息的`xml`文件, 也就是说, 如果我们可以得到有完整文章信息的`xml`文件就可以了. 恰好博客园的备份功能可以提供这样的文件. 将rss链接换为备份文件的链接, 在运行迁移命令就可以将完整的文章迁移到Hexo了. 下面是完整迁移的效果.

![迁移完全](https://cloud.githubusercontent.com/assets/13612111/20493198/cc799b42-b052-11e6-9a0d-28f2e3f8e207.png)

不过这样的迁移还是丢失了标签这样的信息, 不尽如人意.

## 奇怪的格式问题
迁移成功后发现, 有两篇文章的格式变得很奇怪, 正文都很正常, 但引用, 插入代码的地方就会排版很乱. 但另一篇却很完美. 通过观察迁移的`xml`文件内容发现, 那两篇文章的内容是html格式的, 而另一篇是`Markdown`格式的. 这时我才想起, 最初的两篇随笔是用博客园推荐的`TinyMCE编辑器`编写的, 后来才转投`Markdown`的. 所以, Hexo当然不能完美的支持.