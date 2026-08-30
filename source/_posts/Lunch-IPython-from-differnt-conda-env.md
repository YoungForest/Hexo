---
title: Lunch IPython from differnt conda env
date: 2017-11-02 22:36:37
tags:
categories:
description: 记录如何为不同 Conda 环境安装独立 IPython 内核、按名称启动对应会话，并配置镜像源改善依赖安装速度。
translations:
  zh-CN: https://youngforest.github.io/2017/11/02/Lunch-IPython-from-differnt-conda-env/
  en: https://youngforest.github.io/en/2017/11/02/Lunch-IPython-from-differnt-conda-env/
---
[reference](http://ipython.readthedocs.io/en/stable/install/kernel_install.html)

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/Lunch-IPython-from-differnt-conda-env/zh-hero.webp" alt="多个密封环境舱各自拥有不同插槽，安装匹配的内核转接头后，控制台准确连接到目标舱" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

``` python
# activate virtual python environment
activate python27

# install package ipykernel in virtual environment
pip install ipykernel

# install ipython kernel for virtual environment
python -m ipykernel install --user --name py27 --display-name "Python (py27)"

# lunch jupyter QTConsole with specific kernel
jupyter qtconsole --kernel=py27
```

## using mirror instead of cross GFW
You have 2 choices to make it work inside GFW.
- mirror(which I recommend for better speed)
- VPN

[mirror site](http://mirrors.ustc.edu.cn/help/anaconda.html)

[Latest install package mirror site](https://mirrors.ustc.edu.cn/anaconda/archive/)

``` bash
# add package source mirror
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/free/
conda config --set show_channel_urls yes
```
