---
title: 从 Travis CI 迁移到 GitHub Actions
date: 2021-12-18 10:47:17
tags:
- Blog
categories:
- 技术分享
description: Travis CI 免费构建失效后，将 Hexo 博客自动部署迁移到 GitHub Actions 的简要记录。
translations:
  zh-CN: https://youngforest.github.io/2021/12/18/Migrate-from-Travis-CI-to-Github-Action/
  en: https://youngforest.github.io/en/2021/12/18/Migrate-from-Travis-CI-to-Github-Action/
---

<figure class="editorial-illustration editorial-illustration--hero"><img src="/images/ai/Migrate-from-Travis-CI-to-Github-Action/zh-hero.webp" width="1536" height="864" alt="静态页面货箱离开熄灯的旧传送带，迁入分支式新工作流并继续送往双语站点" decoding="async" fetchpriority="high"></figure>

<!-- more -->

两个月前，我在[使用 Travis CI 自动部署 Hexo](https://youngforest.github.io/2021/10/09/Travis-CI-Hexo-Automatically-Deploy/)一文中配置了 Travis CI 来自动部署博客。

不过这个月我发现它已经不能工作了。遗憾的是，Travis 现在不再支持公开仓库的免费构建。为了继续自动 CD，我不得不迁移到 GitHub Actions。

我按照[这篇文章](https://sanonz.github.io/2020/deploy-a-hexo-blog-from-github-actions/)完成了迁移。`deploy.yml` 文件中有些内容需要调整，尤其是**主题**部分。

例如，可以参考[我的中文博客 `deploy.yml`](https://github.com/YoungForest/Hexo/blob/master/.github/workflows/deploy.yml)和[英文博客 `deploy.yml`](https://github.com/YoungForest/en/blob/master/.github/workflows/deploy.yml)。

最后，在 [Travis CI Dashboard](https://app.travis-ci.com/) 中关闭自动构建：Your repos → Setting → General，然后取消勾选 **Build pushed branches** 和 **Build pushed pull requests**。
