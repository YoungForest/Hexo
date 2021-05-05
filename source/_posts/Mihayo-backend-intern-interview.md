---
title: 米哈游 服务器开发 暑期实习
date: 2020-03-20 16:29:48
tags:
- Mihayo
- intern
categories:
- interview
---

# 一面

time: 2020-03-20 16:29:48

上周五参加了在牛客网上的笔试。题目不难，分为计算机基础、算法 和 系统设计。
计算机基础靠着本科的认真学习，没啥问题。算法也属于LeetCode medium难度，很快AC了。
系统设计倒是难倒我了，并不擅长，也没有准备。需要设计一个 MOBA游戏的匹配机制，包括单人和组队。之前完全没想过，瞎写了一通。
昨天收到电话，说我通过了笔试，约了今天下午2:30的电话面试。

本科有个可爱的大佬舍友最后去米哈游了。我虽然对游戏不感冒，但本着多面试，多总结的态度，也报名了其春招内推。

面试预计30min, 实际40min。

自我介绍 + 项目经历 + 计算机基础。

计算机基础又分为：
- C++
- 操作系统
- 数据库
- 计算机网络
- 设计模式

我不会的有：
- TCP 3次挥手，最后的time_wait的作用
- C++ 父类析构函数为什么必需是虚函数
- MySQL
    - 事务 及 ACID
    - Block 和 Tag 区别
    - BiLog是什么
    - timestamp, datetime的区别
- 说出常用的设计模式，我讲了几个，但面试官好像并不满意

没有手撕代码环节，稍微有些失落。

# 二面

time: 2020-04-03 12:54:20

之前[一面的帖子](https://www.nowcoder.com/discuss/387235)。

二面距离一面过去了整整2周。中间HR还打电话希望我能到上海onsite二面。我只好如实说 学校现在不允许跨省区流动。贵司心也是大。最后还是按计划视频面试。

整场面试持续50min。难度并不大，但由于是游戏公司，所以很多问题和项目是之前没有遇到或想过。

## 算法

合并2个有序链表。

## 项目

- Linux下的项目。我告诉他我大多数全是Linux。
- 之前大四做的一个游戏（软件工程作业）[github](https://github.com/xxr5566833/Game)。
- 内存泄漏诊断
- protobuf

## 计算机基础

- 如何诊断网络问题？
- 一致性哈希，增桶、减桶。
- 单例模式，带模版的单例，多线程下的。这是共享屏幕在本地IDE实现的。

# 三面

time: 2020-04-08 12:58:36

[一面](https://www.nowcoder.com/discuss/387235)
[二面](https://www.nowcoder.com/discuss/399642)

## 语言基础

实现智能指针shared_ptr的构造、析构函数。
问：为什么count要用指针？

```cpp
typename<T>
class shared_ptr {
    T* data = nullptr;
    uint32_t* count = 0;
    shared_ptr(const shared_ptr& a) {
        data = a->data;
        count = a->count;
        ++(*count);
    }
    shared_ptr(T* t) {
        data = t;
        if (t) {
            count = new uint32_t();
            count = 0;
        }
    }
    shared_ptr operator = (const shared_ptr& a) {
        if (a == this) ;
        else {
            if (this != nullptr) {
                --(*count);
                if (*count == 0) {
                    delete data;
                    delete count;
                }
            }
            data = a->data;
            count = a->count;
            ++(*count);
        }
    }
    ~shared_ptr() {
        if (data) {
            if (*count > 0) {
                --(*count);
            } else {
                delete data;
                delete count;
            }
        }
    }
};

typename<T>
shared_ptr<T> make_shared() {
    return ret(new T());
}
```

## 算法

>1，7，10 三种面值硬币。
给定一个n，最少硬币凑出这个值。

我刚开始想要贪心，但面试官很快给出反例。
>15

之后给出一个DP的O(N)的解法，面试官再提示N很大时，有何优化的思路。进而提出先mod最大公倍数，再对余数DP的O(1)解法。

```cpp
dp(n) = min(
    dp(n - 1) + 1,
    dp(n - 7) + 1,
    dp(n - 10) + 1,
); if n >= 10;
1 * 7 * 10 = 70
O (7 + 1) = O(1)
```

## 数据结构设计

设计一个百万量级排行榜 ，支持插入，按uid查找分数，按uid查找名次，按名次查找uid.
follow up: 分数相同时，按照上榜时间排序。
```cpp
order statisc tree

int getSize(TreeNode* node) {}


set
multiset

order_statisc_tree<pair<分数, 时间>，uid>：按名次查uid log N
hashmap<uid, pair<分数,时间>>: 按uid查分数 O(1)
按uid查排名 O(log N)
insert: O(1 + log N)
```

## 计算机基础

Linux熟不
排查线上某进程CPU为100%。

## 其他

游戏公司的特别之处。
玩过我们公司的游戏吗？（否）那平时玩什么游戏。

最后面试官问我能不能毕业前提前来实习。我说不能，没发去上海。

问题：贵司服务器开发内部分组情况。不同产品的后端共用情况。
