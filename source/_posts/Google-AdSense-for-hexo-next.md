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

将广告脚本粘贴在`./themes/next/layout/_partials/head/head-unique.swig`的末尾。

然后进行验证。一般几天就会通过，发邮件通知到你。