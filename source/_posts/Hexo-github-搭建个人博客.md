---
title: Hexo + github 搭建个人博客
date: 2016-11-02 22:32:55
tags:
---

## 动机(放在前面)
之前在cnblog上有个博客, 但是也不经常维护, 到现在满打满算也才有3篇随笔, 1个粉. 主要是因为自己没有写东西的习惯. 高中的时候记过一段时间的日记, 零零总总写了有大半本, 都是一些励志(自欺欺人)的东西, 写给自己看的.

首先, 之前感觉没有可写的, 但现在觉得可写的还是挺多的.自己这两年也折腾了不少东西.但折腾完后, 说实话忘得挺快的, 下次自己再弄或者给别人处理相同问题的时候, 基本上又要重新来过. 记下来下之后, 不管是自己日后需要, 还是给小伙伴们借鉴都是极有用的.

其次, 经高人安利, 经常写博客, 总结自己的工作学习, 和网络上的大牛们交流是学习计算机的基本技能. 写下来, 不仅可以系统地记录自己的学习历程, 供后日回顾, 或后人参考, 还可以督促自己坚持下来. 何乐而不为呢?

最后, 最近在搞编译课设的时候, 看到了[这篇博客](http://jcf94.com/2016/02/21/2016-02-21-pl0/). 学习编译知识的同时, 感觉这个博客设计的很美观, 博主也很nice. 了解到使用`Hexo`搭建的时候, 便有了自己搭建博客的想法, 现在也终于有时间实现了.

## 介绍`Hexo`
有很多专门用来搭建博客的框架, 如 WordPress, Jekyll, Octopress, Joomla等. 这些我都没有用过, 就不评论了. 事实上, 这是我第一次搭建博客的经历, 也算是一种猿粪吧, 遇上了Hexo.

这里我就自己的感受, 说说Hexo的优点:

1. 文档完善.
2. 中文支持好, 包括文档各个方面. 事实上, 开发者就是中国人.
3. 主题丰富.(作为一个看脸的人)

## 搭建过程
### 本地Hexo安装配置

关于如何搭建, 我这里推荐官方的[文档](https://hexo.io/zh-cn/docs/). 文档中说的已经很详细了, 而且遇到问题的话, 还可以直接在文档最下面的讨论区提问, 貌似遇到奇奇怪怪问题的人挺多的, 我遇到问题一般靠谷歌, 事实上, 很多时候都被谷歌引到讨论区或者文档中的[Troubleshoot](https://hexo.io/zh-cn/docs/troubleshooting.html)了.

我安装hexo使用的环境的Ubuntu14.04, 在安装hexo的时候`$ npm install -g hexo-cli`, 会遇到这样的问题

```
sh: 1: node: not found
npm WARN This failure might be due to the use of legacy binary "node"
npm WARN For further explanations, please read
/usr/share/doc/nodejs/README.Debian
```

通过搜索可以很快找到解决问题的[方法](http://stackoverflow.com/questions/21168141/cannot-install-packages-using-node-package-manager-in-ubuntu). 只需要`sudo apt-get install nodejs-legacy`就可以了.

出现这个问题的原因是, debian社区发现, nodejs解释器的命令是`node`. 然而, 这个命令和其他的包有命名空间的冲突, 比如 node 包中的 ax25-node. 所以, 他们决定把nodejs解释器命令改为`nodejs`, 大家需要用到nodejs的解释器时需要`nodejs`命令, 而不是`node`. 但是这样就会带来向后兼容的问题, 之前的nodejs脚本中的命令还用的是`node`, 其他Linux发行版也一直在用`node`. 所以他们想了一个兼容的方法, 创建一个符号链接, 将/usr/bin/node链接到/usr/bin/nodejs. 这个工作又`node-legacy`包来实现, 不推荐用户自己手动链接. 并且他们也规定, 'nodejs'的源代码包应该也提供一个`node-legacy`的可执行包. 这样就"完美"地解决了兼容问题.

由此看来, debian系的发布版都会出现这个问题.

### 发布到github上
在github上新建一个库, 库名为 "$(你想要的名字).github.io", 比如, 我的是"youngforest.github.io". 事实上, 以这样的格式命名, github会默认配置好你的`[GitHub Pages](https://pages.github.com/)`, 默认发布到"https://$(你想要的名字).github.io/", 比如我的就是"https://youngforest.github.io/".
当然, 如果你不这样命名的话, 自己也可去库中的设置中设置发布`GitHub Page`.

在本地的博客目录下, 运行`hexo generate`, 即可在`public/`中生成你博客的静态页面, 在这个文件夹下, 将其中所有的文件推到你在github上建好的库就可以了.

关于具体如何将本地的文件夹推到新建好的库, 在你新建好空库的时候, github应该会告诉你.

![initial a repository in github](https://cloud.githubusercontent.com/assets/13612111/20461580/713552e6-af3d-11e6-8078-a8c570e594af.png)

如果你想要一条命令完成github部署的话, 可以参考[相关文档](https://hexo.io/zh-cn/docs/deployment.html).

我在运行`hexo deploy`是会遇到这样的错误`ERROR Deployer not found: git`.

查了半天在[hexo的isuue](https://github.com/hexojs/hexo/issues/1040)中找到了解决方法. 在bash中运行如下命令就好了.
``` bash
npm install hexo-generator-index --save
npm install hexo-generator-archive --save
npm install hexo-generator-category --save
npm install hexo-generator-tag --save
npm install hexo-server --save
npm install hexo-deployer-git --save
npm install hexo-renderer-marked@0.2 --save
npm install hexo-renderer-stylus@0.2 --save
npm install hexo-generator-feed@1 --save
npm install hexo-generator-sitemap@1 --save
```

当你在浏览器中访问你的"GitHub Pages'时, 就会看到部署好的博客.
在[这里](https://youngforest.github.io/)可以看到我部署好的博客.