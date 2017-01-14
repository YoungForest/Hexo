---
title: 对CPU 内存 硬盘读写 网络 进行压力测试
date: 2017-01-14 12:39:23
tags: 
- benchmark
categories:
- Laboratory
---
近来实验室的师兄有个需求, 写4个小程序, 分别对内存, CPU, 硬盘, 网络进行压力测试, 要求测试程序有压力档位可以调, 比如压力可以分为大, 中, 小. 二话不说, 撸起袖子加油干. 需求很简单, 但实现起来却并不简单, 笔者边学习, 边写程序, 才勉强完成任务. 

## 测试环境
Ubuntu 14.04

## CPU
受[编程之美](https://book.douban.com/subject/3004255/)的第一章"让CPU占有率曲线听你指挥"启发, 我很快地完成了对CPU的压力测试程序.

#### 基本思路
确定一个小周期, 笔者的周期设置为100, 这个值可以通过改变PIECE的值来改变, 周期为 100 * PIECE.

在每个周期中, stress%的时间用于一个死循环, 剩下 (100-stress)%的时间usleep(注意sleep和usleep的区别).

#### 程序源代码

<script src="https://gist.github.com/YoungForest/04080ae9ad932aa1fd7211c05e93b197.js"></script>

#### 使用方法
``` bash
$ 程序名 stress    # 其中 0<=stress<=100
$ # 例子
$ gcc cpu_benchmark.c -o cpu_benchmark.out
$ cpu_benchmark.out 50
```
## 硬盘读写
对硬盘进行读写的压力测试, 我是分别通过两个程序实现的.

### 硬盘读操作

#### 基本思路
与CPU的压力测试类似, 在一个周期(1s)里, 先从硬盘里读取特定大小(speed)的数据, 周期的剩余时间sleep.

#### 程序源代码
<script src="https://gist.github.com/YoungForest/9faaa24df53b3e78d27c18155ee26384.js"></script>

#### 使用方法
``` bash
$ python3 disk_read.py 硬盘名 level    # 其中level可以是0, 1, 2, 3
$ # 例子
$ python3 disk_read.py /dev/vda 2
```

### 硬盘写操作

#### 基本思想
硬盘写操作的压力测试与读操作类似. 在一个周期内(1s)向一个文件中写入特定大小的数据, 之后删掉, 在周期的剩余时间内sleep.

为了向文件中写数据, 笔者使用了命令
`dd if=/dev/zero of=/path/to/targetfile bs=1024k count=speed conv=fdatasync > /dev/null 2> /dev/null`.
该命令从/dev/zero中读取数据(其实是无效数据, /dev/zero 经常被作为初始化文件的数据源), 写入到/path/to/targetfile中. 为了不使`dd`产生的错误输出和标准输出影响本程序的可读性, 使用重定向了. /dev/null 是一个黑洞设备, 可以向其输入任何数据而不会产生坏的影响.

#### 程序源代码
<script src="https://gist.github.com/YoungForest/0b3fdfbe15821b32991d9d48a9122290.js"></script>

#### 使用方法
``` bash
$ python3 disk_write.py 硬盘名 level    # 其中level可以是0, 1, 2, 3
$ # 例子
$ python3 disk_write.py /dev/vda 2
```

## 内存

#### 基本思想

对内存的测试, 笔者的师兄向笔者介绍了[`memtester`](https://linux.die.net/man/8/memtester)这个程序. 具体安装及使用方法:

``` bash
$ # 安装
$ sudo apt-get install memtester
$ # 从PHYSADDR处分配MEMORY大小的内存, 测试ITERATIONS次.
$ sudo memtester [-p PHYSADDR] <MEMORY> [ITERATIONS]
```

一般情况下, 不需要指定PHYSADDR, 因为可能将其他进程占用的内存破坏掉, 存在一定的危险性.

利用`memtester`这个程序, 笔者进行简单加工, 就完成了需求.

#### 程序源代码
<script src="https://gist.github.com/YoungForest/73875763467c9cd1eeccad3496a18398.js"></script>

#### 使用方法
``` bash
$ python3 memory_benchmark.py <MEMORY> [ITERATIONS]
$ # 例子
$ python3 memory_benchmark.py 3m 10
$ python3 memory_benchmark.py 2m 
```

## 网络
师兄的需求是需要公网测试...

----未完待续----