---
title: Lunch IPython from differnt conda env
date: 2017-11-02 22:36:37
tags:
categories:
---
[reference](http://ipython.readthedocs.io/en/stable/install/kernel_install.html)

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