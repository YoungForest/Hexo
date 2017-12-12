---
title: Work With Two Github Accounts Simultaneously
date: 2017-12-12 20:32:52
tags:
- git
categories:
---
笔者3个月前来到[偶数科技公司](http://www.oushu.io/)实习，学习工作都用公司配的Mac。一分价钱一分货，Mac确实比自己15年买的5000RMB的HP好用多了。所以除了工作之外，学习和实验室的任务也渐渐迁移到Mac上。现在遇到的一个比较棘手的问题是，如何使自己工作的GitHub账号与个人的账号不冲突，同时方便地使用。

在查阅过相关资料后，我实现了如下的解决方案。

<!-- more -->
全局默认使用公司的账号，对于需要公司账号的地方不做任何处理。

个人的仓库进行特殊处理。

1. 在本地创建ssh密钥
2. 在个人GitHub设置中配置ssh公钥
3. 修改~/.ssh/config
``` config
# Personal github user
Host github.ys
        HostName github.com
        User git
        IdentityFile ~/.ssh/id_rsa_personal_github
```
4. clone仓库时，使用ssh链接，并将`github.com`替换为`github.ys`
5. 对于已有的仓库，更改`.git/config`的“remote”项，链接与4中相同
6. 配置local commit。
``` bash
git config user.email yangsen758@foxmail.com
git config user.name YoungForest
```

为了使`hexo`可以自动deploy，需要更改hexo下的`_config.yml`文件中repo链接，类似clone。
``` yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: git@github.ys:YoungForest/youngforest.github.io.git
  branch: master
```