---
title: 'SSD: Single Shot MultiBox Detector 配置使用总结'
date: 2017-01-12 23:50:49
tags:
---

## 实验环境
+ Ubuntu 16.04
+ CPU only (自己的机器上没有NVIDIA的卡, AMD说起来都是泪.)

##　环境配置
基本上是按照[官方文档](https://github.com/weiliu89/caffe/tree/ssd). 这里只展示与文档中不同的部分.

### Makefile.confile
+ line 8: CPU only
+ line 79, 80: support for python3
+ line 81: /usr/lib/python3.5/dist-packages/numpy/core/include -> /usr/local/lib/python3.5/dist-packages/numpy/core/include
+ line 95: fix fatal of `hdf5`

### 遇到的问题
> ./include/caffe/util/hdf5.hpp:6:18: fatal error: hdf5.h: No such file or directory

应该只有Ubuntu15.10+的版本才会遇到这样的问题, 原因是hdf5的头文件和库的路径在新版本中发生了改变.
[解决方法](https://gist.github.com/wangruohui/679b05fcd1466bb0937f#)

> /usr/bin/ld: cannot find -lopenblas

``` bash
$ locate libopenblas.so
/usr/lib/libopenblas.so.0

$ sudo ln -s libopenblas.so.0 libopenblas.so
```
[参考](http://stackoverflow.com/questions/335928/ld-cannot-find-an-existing-library)

> /usr/bin/ld: cannot find -lboost_python3

[解决方法](https://github.com/BVLC/caffe/issues/4843)