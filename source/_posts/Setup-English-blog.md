---
title: Hexo 创建中英文博客
date: 2021-09-07 17:50:49
description: 记录从中文 Hexo 博客搭建独立英文站点、配置部署路径并实现双向链接的过程。
categories:
- 折腾
tags:
- Hexo
translations:
  zh-CN: https://youngforest.github.io/2021/09/07/Setup-English-blog/
  en: https://youngforest.github.io/en/2021/09/07/Setup-English-blog/
---
自从来到亚马逊工作，接触英文和外国同事比较多。锻炼使用英语的需求越来越大。而且为了和国际接轨，我决定创建自己的英文博客。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/Setup-English-blog/zh-hero.webp" alt="两座由同一套积木搭成的中英文博客屋沿不同轨道部署，并由一座双向桥连接" width="1536" height="864" decoding="async">
</figure>

<!-- more -->

## 步骤

以中文博客为模版，创建英文博客。
```bash
cp -r Hexo HexoEn
```

删除HexoEn中没用的中文博文和资源。

在Github创建一个新repo：“en”.

修改HexoEn `_config.yml`配置文件。注意部署分支为`gh-pages`, 这个GitHub默认的pages分支，如果不同的话，需要去repo的`Setting->Pages`配置一下你自定义的分支:
```yml
language: 
- en
deploy:
  type: git
  repo: git@github.com:YoungForest/en.git
  branch: gh-pages
theme_config:
  menu:
    home: / || fa fa-home
    about: /about/ || fa fa-user
    tags: /tags/ || fa fa-tags
    categories: /categories/ || fa fa-th
    archives: /archives/ || fa fa-archive
    中文: https://youngforest.github.io || fa fa-language # 图标可以去该网站搜索：https://fontawesome.com/v4.7/icons/
```

中文Hexo `_config.yml`配置文件:
```yml
language: 
- zh-CN
- en
theme_config:
  menu:
    home: / || fa fa-home
    about: /about/ || fa fa-user
    tags: /tags/ || fa fa-tags
    categories: /categories/ || fa fa-th
    archives: /archives/ || fa fa-archive
    English: https://youngforest.github.io/en/ || fa fa-globe
```

这样中英文博客就可以在Menu互相外链了。

部署博客，看看效果如何。
```bash
hexo generate -d
```

把HexoEn也推到远端，做保存和同步。注意，这里和deploy用的是同一个repo, 但是不同的分支。
```bash
git remote remove origin
git remote add origin git@github.com:YoungForest/en.git
git push -u origin master
```

## 最后的效果

中文博客：https://youngforest.github.io
英文博客：https://youngforest.github.io/en/
