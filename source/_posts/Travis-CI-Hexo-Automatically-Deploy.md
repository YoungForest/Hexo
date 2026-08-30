---
title: Travis CI + Hexo 自动部署
date: 2021-10-09 11:03:49
tags:
- Blog
categories:
- 技术分享
description: 使用 Travis CI、GitHub Token 和部署配置自动发布 Hexo 中英文博客的历史实践。
translations:
  zh-CN: https://youngforest.github.io/2021/10/09/Travis-CI-Hexo-Automatically-Deploy/
  en: https://youngforest.github.io/en/2021/10/09/Travis-CI-Hexo-Automatically-Deploy/
---

<figure class="editorial-illustration editorial-illustration--hero"><img src="/images/ai/Travis-CI-Hexo-Automatically-Deploy/zh-hero.webp" width="1536" height="864" alt="双语博客纸卷经过云端装配线、密钥保险盒和分支闸门，自动装载到两座站点灯塔" decoding="async" fetchpriority="high"></figure>

[Hexo](https://hexo.io/docs/) 是一个强大的博客引擎，很适合用来搭建个人博客。我已经使用它五年了。最近，我在[原有中文站](https://youngforest.github.io/)之外又搭建了[英文站](https://youngforest.github.io/en)。有了两个站点之后，写作、Git 操作和部署都需要更多工作。

幸运的是，这个问题有更好的解决办法。我们可以使用 [Travis CI](https://travis-ci.com/) 自动部署博客。剩下要做的只有写文章、提交 Git 并推送，CI 会帮助我们自动部署站点。

<!-- more -->

## 如何配置？

[使用 GitHub 账户注册 Travis CI](https://education.travis-ci.com/)。

通过 [GitHub Education Pack](https://education.github.com/pack/offers)，学生可以免费获得私有构建权益。不过这只是可选项，没有它也仍然可以使用 Travis CI。

[授权 Travis CI 访问你的 GitHub 仓库](https://app.travis-ci.com/account/repositories)。

在 [Personal access tokens](https://github.com/settings/tokens) 页面生成一个供 Travis CI 使用、包含 `repo` 权限的 Token，并复制这个 Token。

在 [Travis CI 仓库页面](https://app.travis-ci.com/account/repositories)选择你的 **Hexo** 仓库，然后点击 **Settings**。在 **Environment Variables** 区域添加一个新变量，**NAME** 填 `GH_TOKEN`，**VALUE** 填刚才复制的 Token。

在 Hexo 仓库中创建 `.travis.yml` 文件。可以参考下面的内容，并根据自己的情况修改相应值。我加了一些注释作为说明。

```
os: linux
language: node_js
node_js:
  - 12  # using nodejs LTS v12
branches:
  only:
    - master # only monitor master branch
cache:
  directories:
    - node_modules # cache node_modules to speed up build process
before_script: ## According to your theme and custom configuration, update the script
  - npm install -g hexo-cli # install Hexo in CI environment
  - cd themes
  - git clone https://github.com/next-theme/hexo-theme-next.git next # We do not commit the themes/next folder. Therefore, pull it every time.
  - cd next
  - npm install # install next dependencies
  - cd ../.. # return the root folder
  - npm install # install the dependencies
script:
  - hexo generate # generate static files
deploy: # reference: https://docs.travis-ci.com/user/deployment/pages/
  provider: pages
  skip_cleanup: true # not clean after build
  token: $GH_TOKEN # the variable you set in last step
  keep_history: true
  # fqdn: blog.ne0ng.page # custom domain，delete this field if using username.github.io
  repo: YoungForest/youngforest.github.io # the repo you want to deploy. If this field is not set manually, the default value is current repo. Sometimes, the site repo is the same with the source files but in different branches.
  on:
    branch: master # sources files is in master branch
  local_dir: public
  target_branch: master # the branch of generated files. If using `username.github.io` repo, it has to be master. Otherwise, change it to your github pages branch.
```

把 `.travis.yml` 文件推送到仓库后，就可以在 [Travis CI](https://app.travis-ci.com/) 中查看构建状态。构建完成后，检查站点仓库并访问博客，确认更新已经发布。
