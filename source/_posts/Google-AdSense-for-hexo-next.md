---
title: hexo next 配置 Google AdSense
date: 2021-02-25 11:17:14
categories:
- 折腾
tags:
- Hexo
---

## 动机

最近由于看了“半佛仙人”的一些视频，我对钱更感兴趣了。除了拿出积蓄的一部分投资A股外，还想着怎么提高被动收入。自己一直有写博客的习惯，写了有5年多，攒了一百余篇文章。虽然每日浏览量只有几十，但苍蝇再小也是肉。参照大佬的一些经验，尝试着通过投放广告来牟利。
一般网站的广告收入都是通过广告联盟接入的。简而言之就是，你只用出租广告位给广告联盟，他们在此投放针对用户的广告，然后按照流量给你钱。
面向国际的主要就是Google AdSense了，国内也有一些，如百度。
因为我本职是一名程序员，博客内容也不分国界，因此选择了Google AdSense作为广告商。Google AdSense的配置十分简单。

## 具体步骤

[注册新的AdSense账号](https://www.google.com/adsense/).

从Google AdSense上获取针对你网站的广告脚本，类似这样

```html
<script data-ad-client="ca-pub-9*******6" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
```

Option1:

将广告脚本粘贴在`./themes/next/layout/_partials/head/head-unique.swig`的末尾。

然后进行验证。一般几天就会通过，发邮件通知到你。

通过审核后，需要去AdSense上进行配置。基本上把 **自动广告** 打开即可。

Option2:

在博客根目录下创建`_config.next.yml`文件，内容如下：
```yml
custom_file_path:
  head: source/_data/head.swig
```

创建`source/_data/head.swig`文件，内容如下：
```html
<script data-ad-client="ca-pub-9046219176772396" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9046219176772396"></script>
```

Option2的优势在于对`next`不侵入，方便用Github Action做CD.

### ads.txt 的设置

该文件放置在 `./source/` 下即可，和`_posts/` 同级。
`hexo d -g`部署后，对应的文件就会自动部署到`/public/`也就是你的博客上了。
其他需要生成放置在博客根目录下的文件也是类似的处理。
