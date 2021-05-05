---
title: Bytedance new graduate interview
date: 2021-05-05 16:44:21
tags:
- ByteDance
- New Graduate
categories:
- interview
---

我字节跳动提前批投了 技术中台 的 后端开发岗位。
计算机基础没复习到位，答得不好。
许愿offer。

# 一面

我自介绍。

## 算法题

先给暴力解，再优化。

>题目：数组代表股票每天价格，每天只允许买或者卖一次，也可以不买卖，需要先买入才能卖出，在只交易一次（即只买和卖一次）的情况下求最大收益。
输入：[2,1,4,1,5,6,1]
输出： 5 

```cpp
#include <iostream>
#include <vector>
using namespace std;

int solution(const vector<int>& prices) {
    // time: N ^ 2
    // space: 1
    int ans = 0;
    for (int buy = 0; buy < prices.size(); ++buy) {
        for (int sell = buy + 1; sell < prices.size(); ++sell) {
            int profit = prices[sell] - prices[buy];
            ans = max(ans, profit);
        }
    }
    return ans;
}

int solution2(const vector<int>& prices) {
    // time: O(N)
    // space: 1
    int ans = 0;
    if (prices.empty()) return 0;
    int minPrices = prices[0];
    for (int sell = 1; sell < prices.size(); ++sell) {
        int profit = prices[sell] - minPrices;
        ans = max(ans, profit);
        minPrices = min(minPrices, prices[sell]);
    }
    return ans;
}

int main() {
    //int a;
    //cin >> a;
    //cout << a << endl;
    vector<int> prices = {2,1,4,1,5,6,1};
    cout << solution2(prices) << endl;
}
```

## 计算机基础

### 操作系统

IPC 种类
信号量

进程 和 线程
各有几种状态、状态转移图。

虚拟内存

[Linux的一些常用命令](https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/ldd.html), 今天刚复习过。
如 查看端口、内存、进程状态.
[进程的current working directory](https://unix.stackexchange.com/questions/94357/find-out-current-working-directory-of-a-running-process): `lsof -p <PID> | grep cwd`

### 计算机网络

3次握手 4次挥手 的过程和必要性. 答的很糟糕。

### 数据库

几种范式
深入了解吗？不了解

### 语言

python
- GIL
- 引用还是值

贵组大概率是写python的。


## 总结

昨天约了今天的面试，失误呀。太过仓促。本来秋招提前批是很重要的，计算机基础知识就是题库里的那些题，花3天时间背背还是有必要的。要不靠着本科时学的知识，回答不会太好，会很伤。

好多同学问题库在哪里。我也是在网上找的，[https://github.com/CyC2018/CS-Notes](https://github.com/CyC2018/CS-Notes)
感觉还是挺全的. 已经在背了。
