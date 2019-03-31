---
title: pkg-config
date: 2019-03-17 19:52:38
tags:
- C++
categories:
- Programming
---

最近在学习[google-test](https://github.com/google/googletest)的使用和源码，在`make install`的时候发现除了向`/usr/local/`中安装了头文件，`/usr/lib/`中安装了shared library外，还向`/usr/local/lib/pkgconfig/`中安装了2个`.pc`文件。所以说，这个pkg-config是个什么东西呢？

从一份[Guide](https://people.freedesktop.org/~dbn/pkg-config-guide.html)中，我们可以发现`pkg-config`的所有有用的基本信息。

## Overview

现代的计算机系统使用很多层的组件以向用户提供API。一个很大的难点在于如何合适地将这些不同层的组件整合起来。`pkg-config`这一工具收集了安装在系统上的库的metadata, 用户可以很方便地查看这些metadata。比如，google-test安装的其中一个pc文件`gtest.pc`的内容是：

包含使用gtest库的所有信息，如头文件安装位置、shared library的位置，编译时需要的编译选项。可以说，使用gtest看这些metadata就够了。

```pc
prefix=${pcfiledir}/../..
libdir=${prefix}/lib
includedir=${prefix}/include

Name: gtest
Description: GoogleTest (without main() function)
Version: 1.9.0
URL: https://github.com/google/googletest
Libs: -L${libdir} -lgtest 
Cflags: -I${includedir} -DGTEST_HAS_PTHREAD=1 
```

计算机系统上没有一个如`pkg-config`的metadata系统的话，定位和获得系统提供的服务的细节将会很难。
对于一个开发者，安装你的包的时候同时安装`pkg-config`将会极大地方便你的API被用户使用。

`pkg-config`最主要的使用是当程序编译和链接一个库的时候提供必要的细节。这些元信息被存储在`pkg-config`文件中。这些文件以`.pc`为后缀，存放在`pkg-config`工具知道的特定路径里。
一个`.pc`文件中包含2种信息，metadata keywords和freeform variables。
前者以keyword开头，后接冒号和value，如“Name: gtest"。
后者用=连接变量的值和名字，如"prefix=..."。
keywords是由`pkg-config`定义和导出的。
variables不是必须的，但是可以被用来表示`pkg-config`没有涉及的信息 或是 被keywords使用以增加keywords定义的灵活性。

一个pc文件最好对应一个library文件。文件名(除了后缀)也最好相同。

最重要的metadata域是Requires, Requires.private, Cflags, Libs 和 Libs.private。它们可以被外部的工程用来编译和链接到这个library。优先使用private域，以避免暴露不必要的库给用户。如果用户不不直接使用requires library的symbols，就不应该直接链接到该库。


