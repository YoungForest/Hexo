---
title: 腾讯 微信事业部 暑期实习生 面试
date: 2020-03-11 10:28:43
tags:
- Tencent
- intern
categories:
- interview
---

# 一面

time: 2020-03-11 10:28:43

上周HR联系沟通了下意向工作城市，但是没约具体面试时间。

昨晚8点半忽然接到广东深圳的电话，问是否方便，直接开始了面试（惊不惊喜，刺不刺激？）。面试官网还不太好，中间出了不少问题。比如手撕代码时，对方网站内容不能及时刷新。

## 计算机基础

### 分布式、深度学习

BN层，dropout。如何计算？
BN: mean, valence。

单机训练 和 多机训练 区别。

多机训练时，如何把各个单机得到的loss reduce下。

数据并行训练 和 模型并行训练。

百亿级特征训练。百亿级是指？

### 语言基础 C++

hashtable实现

shared_ptr, unique_ptr, weak_ptr 区别

move语义

## 算法题

二叉树深度。

二维数组，横竖都非递减，寻找目标值。`O(m + n)`。[leetcode240](https://leetcode.com/problems/search-a-2d-matrix-ii/description/)

## 反问

问题：贵组的工作内容，为何问如此多深度学习和分布式的问题？

答：大规模分布式训练框架，技术栈：C++，Python

# 二面

time: 2020-03-17 21:59:18

等了一周，终于等来了第一个复试。和上次面我的面试官是同组的。应该是因为技术栈比较契合，所以被分布式训练框架组把简历给捞出来了。

首先问了很多项目和实习经历相关的内容。比如最有挑战性的任务，遇到的困难，怎么解决的？我按照传说中的STAR方法回答了，但是面试官好像并不是很满意。我平时最不擅长讲这些，面试多了也学会一点。还是手撕代码来的干脆和直接（以Google为代表，上来就是干），就像八股文一样，也好准备。

基础知识:
- shared_ptr, unique-ptr的区别
- 死锁的必要条件和解决方法
- TCP，UDP的区别
- TCP如何保证可靠

分布式：
- pytorch的架构、类和C++接口的封装，语言之间的调用
- 多机多卡训练如何更新参数

算法题：

给定一个很长的有序数组，和另一个无序数组，将无序数组插入有序数组中，需要保证结果仍然有序。

Given sorted vector sorted_a and unsorted vector b;   size of a is about 1G
vector<int> sorted_a;
vector<int> b;
insert b to sorted_a as fast as possible, result sorted_a should be sorted, too.

```cpp
void insertSortedVector(vector<int>& sorted_a, vector<int>& b) {
    if (sorted_a.emtpy() || b.empty()) return;
        sort(b.begin(), b.end());
        int a_tail = sorted_a.size() - 1;
        int b_tail = b.size() - 1;
        sorted_a.resize(sorted_a.size() + b.size()); // 可能有 sorted_a.size()
        int after_tail = sorted_a.size() - 1;
        while (a_tail >= 0 && b_tail >= 0) {
            if (sorted_a[a_tail] > b[b_tail]) {
            sorted_a[after_tail] = sorted_a[a_tail];
            --a_tail;
        } else {
            sorted_a[after_tail] = b[b_tail];
            --b_tail;
        }
        --after_tail;
    }
    while (b_tail >= 0) {
        sorted_a[after_tail] = b[b_tail];
        --b_tail;
        --after_tail
    }
}
```

Time: O(a.size() + b.size() * log b.size())
Space: O(1)

写完代码后让我不停的优化，提示不是在时间复杂度级别的优化。我找了好几处（上面的代码是我的最终版本），最后才让面试官满意。

# 三面

time: 2020-03-19 09:06:13

昨天下午刚刚结束二面，今天下午接到HR的电话，约了晚上8点的面试。通过牛客网的平台，视频面试+手撕代码。共1个小时20分钟。

上来简短的自我介绍之后就开始了手撕代码了，我喜欢。共4道题目,都不难，LeetCode Easy/Medium水平。就是前2题一定要用C写比较不舒服。

手撕了50min代码，开始基础知识问答，包括操作系统、计算机网络、数据库、数据结构等。面试官那里估计有一个问题列表，问的很快，很多。我回答后就记下些什么。我没有准备过计算机基础的面试内容，全靠本科时认真学习残留下来的那些知识。大多数都足够了。印象深刻的只有没答上来的：
- TCP 拥塞控制 和 流量控制 的区别和实现
- 数据库中 聚簇索引 和 普通索引的区别
- IO的异步、阻塞、多路复用 的区别

接下来又问了之前的实习和项目经历。我写了5个，问了3个，问的还很细。

问完之后，面试官很干脆的就结束了面试。我从高强度的面试状态中久久不能恢复。

3次面试2次都是晚上进行，加班状态可以看到。只有3面的面试官开了视频，看到大佬的发际线，我感觉自己实力实在太弱了。

# 四面

time: 2020-03-19 23:53:31

昨天晚上刚刚结束了三面，今天早上收到四面的电话，约了晚上的面试。

上来先刚了3道算法题，我喜欢。

- 递增循环整数数组，从里面找出最小的元素
- 在二叉排序树上面找出第3大的节点
- 打印变长为n的回形矩阵

然后就问了项目和实习经历，快手的2个项目和HAWQ修改BUG的经历。

问了面试官，join.qq.com上的状态为什么只有1次面试的状态。
答曰：同一个候选人，会被不同的组挑到，然后面试。怪不得1面、2面 和 3面、4面无论是面试风格、问题、还是平台都有所区别。

1、2面是明显的分布式框架组的。3、4面可能不是，忘记问了。

下午还参加了微软SWE intern的面试，当时就觉得凉了，晚上果然收到Thank you Letter. 一首凉凉送给自己。秋招加油，再接再厉！

# 五面

time: 2020-03-20 17:40:42

今天面完米哈游后，正在做快手的评测，忽然收到要半个小时后5点的电话面试。

说实话，面到第五面我已经心力交瘁了，想要疯狂吐槽了。不过五面十分简单，只持续了15min。

自我介绍 + 项目 + 计算机基础。

计算机基础问了三、四面我没答上来的问题，应该是故意的。不过好在我每次面试完都会进行总结，复习没答上来的知识。

你认为你的优点和缺点是啥？
- 优点：计算机基础扎实、算法没问题
- 缺点：不适合科研，创新、创造能力不足

之前实习换公司的原因。
可以实习的时间和方式？

接下来等HR面。

他是 微信搜索服务 组的。三、四面 也是。前2面是分布式框架组的，无论是面试方式还是内容都有所不同。他说应该是 分布式训练框架组 我没过，然后简历释放出来给了他们组。他只能看到三、四面的面试评价，跨组的就是不透明的。我确实对分布式训练的基础知识和经验不足。
我也能理解为啥要有5次面试了。

# 七面

time: 2020-03-31 19:22:14

上周三约了HR面试，闲聊了半天，和技术面的套路差别很大。因为我说我实习想在北京，所以又约了这周一（今天）下午的一次北京同事的技术面试。北京这边应该就只有一个技术面试，还有HR面试。

视频面试采用牛客网平台，分为 项目、算法、数据结构、计算机基础。

## 算法题
>逛街
小Q在周末的时候和他的小伙伴来到大城市逛街，一条步行街上有很多高楼，共有n座高楼排成一行。
小Q从第一栋一直走到了最后一栋，小Q从来都没有见到这么多的楼，所以他想知道他在每栋楼的位置处能看到多少栋楼呢？（当前面的楼的高度大于等于后面的楼时，后面的楼将被挡住） 
输入描述
输入第一行将包含一个数字n，代表楼的栋数，接下来的一行将包含n个数字wi(1<=i<=n)，代表每一栋楼的高度。
1<=n<=100000;
1<=wi<=100000; 
输出描述
输出一行，包含空格分割的n个数字vi，分别代表小Q在第i栋楼时能看到的楼的数量。
示例1
输入
6
5 3 8 3 2 5
输出
3 3 5 4 4 4
说明
当小Q处于位置3时，他可以向前看到位置2,1处的楼，向后看到位置4,6处的楼，加上第3栋楼，共可看到5栋楼。当小Q处于位置4时，他可以向前看到位置3处的楼，向后看到位置5,6处的楼，加上第4栋楼，共可看到4栋楼。

LeetCode medium难度，秒杀，正反使用2次单调递减栈即可。需要注意的是，看到的楼包括当前楼，所以当前楼会正反计算2次，最后需要减1。

```cpp
#include <vector>
#include <stack>
#include <iostream>

using namespace  std;

int main() {
    int n;
    cin >> n;
    vector<int> height(n);
    for (int i = 0; i < n; ++i) {
        cin >> height[i];
    }
    vector<int> ans(n, 0);
    stack<int> s;
    auto process = [&](int i) -> void {
        while (!s.empty() && height[s.top()] <= height[i])  {
            int t = s.top();
            s.pop();
            ++ans[i];
        }
        s.push(i);
        ans[i] += s.size();
    };
    for (int i = 0; i < n; ++i) {
        process(i);
    }
    while (!s.empty()) {
        s.pop();
    }
    
    for (int i = n - 1; i >= 0; --i) {
        process(i);
    }
    for (int i = 0; i < n; ++i) {
        -- ans[i]; // delete repeated self(count twice)
        cout << ans[i] << " ";
    }
    cout << endl;
    
    return 0;
}
```

## 数据结构

设计一个支持序列化和反序列话的HashMap。我之前没有接触过类似问题，了解过一些序列化的知识。就设计了一个 线型探查版 的hashmap, 因为这样所有数据都可以存储在一个数组中，方便序列化。

为了方便实现，并没有考虑泛化和扩容，虽然提前和面试官沟通过。面试官还是抨击了线型探查对空间利用有问题，说是单个bucket中有过多元素时会有问题。对此我并不苟同，然后有讨论了半天。最后他有怼我说，没别人实现的好，insert时没有考虑扩容。因为我之前已经和他沟通过不考虑扩容和泛化以简化问题。对此，面试官不免有些为了怼而怼的嫌疑，我是并不信服的。我问他别人怎么实现，主流方法如何？他只是说没有标准答案。

```cpp
struct HashMap {
    const int capity = 1 << 7;
    array<int, capity> data;
    const int NOT_EXIST = -1;
    HashMap() {
        memset(data.data(), capity * sizeof(int), -1);
    }
    void searilize(const string& file_name) {
        // 把data内容写到文件中
        std::ofstream fout (file_name, std::fstream::binary);
        auto& d = static_cast<array<char, capity*sizeof(int)>>(data)
        std::copy(d.begin(), d.end(), std::istreambuf_iterator<char>(fout));
    }
    void load(const string& file_name) {
        // 把文件内容读到data中
        std::ifstream input(file_name, std::ios::binary );
        std::copy( 
            std::istreambuf_iterator<char>(input), 
            std::istreambuf_iterator<char>( ),
            static_cast<array<char, capity*sizeof(int)>>(data).begin());
    }
    int get(int key) {
        int hashcode = hash(key);
        int bucket = hashcode & 6;
        for (int i = bucket; i < 1 << 6; ++i) {
            if (data[i] == key) {
                return data[i + (1 << 6)];
            } else if (data[i] == NOT_EXIST) {
                return NOT_EXIST;
            }
        }
        return NOT_EXIST;
    }
    void insert (int key, int value) {
        int hashcode = hash(key);
        int bucket = hashcode & 6;
        for (int i = bucket; i < 1 << 6; ++i) {
            if (data[i] == NOT_EXIST || data[i] == key) {
                data[i] = key;
                data[i + (1 << 6)] = value;
            }
        }
    }
}
```

## 计算机基础

- 多态。构造函数不能虚函数，析构函数可以虚函数。
- 并发了解。

## 其他

自己的优点：
我讲了 基础扎实、算法好 （刷题多）。
他讲了他对刷题的看法。虽然不排斥刷题，但说了很多ACM选手的问题，工程实现考虑不周。感觉他有很多怨言呀。

他还问了为什么本科时成绩好，研究生时不那么好？
我如实说了，研究生成绩不重要。

面试官小哥哥早年也在北航读过书，最后我还聊了一下我实验室的现状。

# 八面 又一次迷一般的面试 差评

time: 2020-04-13 12:59:03

今天(4.13)上午11:30接到电话，随即开展了40min的面试。根本没有提前约我的时间，让我手头的很多事情都中断了。而且他说之前他们组的同事应该已经给我一面了。但是之前腾讯的7次面试都是别的组面的。

## 内容

自我介绍，项目介绍。

各种C++的容器的API的问题，时间复杂度。

竟然让我设计一个推荐系统，我内心...只是简单说了下一些常见的推荐算法的实现。

## 2道算法题

>1. 实现 strcpy 拷贝字符串
```cpp
void strcpy(const char* source, const char* destination) {
    if (source == NULL || destination == NULL) return;
    int i = 0;
    while (source[i] != '\0' && source + i != destination) {
        destination[i] = source[i];
        ++i;
    }
}
```

>2. 10亿个整型，查找其中不重复的数字

```cpp
vector<int> findUnique(const vector<int>& v) {    // 4G
    bitset<1 << 32> seen;    // 4G
    for (int i : v) {
        seen.set(static_cast<unsigned int>(i));
    }
    vector<int> ans; // 4 G = 10亿 * 4
    for (size_t i = 0; i < seen.size(); ++i) {
        if (!seen[i]) {
            ans.insert(static_cast<int>(i);
        }
    }
    return ans;
}
```

面试官是 微信kitcup推荐系统组的。我直接提意见说下次面试提前约，这次十分仓促，状态也不好。
这个面试官的态度也是我遇到过的最差的一批，多次和他沟通时，他说“不要问我”。很多问题问的也是不明所以，给他差评。真想投诉他。

# 九面

本次面试大概只持续了10min，问了一道“判断链表是否是回文”的算法题。要求时间复杂度O(N), 空间复杂度O(1)。LeetCode medium难度吧。

之后问我，看到我之前面了腾讯很多次，都到HR面了。为什么没有签？我说是因为工作地点冲突的原因。我期望在北京，他们组都在深圳。面试官说，那我也是面深圳的岗位。你填报志愿填的服从调剂。然后也没必要继续面下去了。史上最快的面试！！😂

我之后去官网看了下，还真是，重新改了下，不服从调剂了。希望北京的组能捞起我。不知道组里的工程师能不能定向捞人呀，不然可以联系一下在腾讯工作的同学和师兄。

# 4.26 笔试

TX的笔试难度还是挺大的，尤其是第2题和第3题。不过TX并不生产算法题，它只是算法题的搬运工。

## 2. 寻找2个点集中最近的对

[原题链接](https://www.acwing.com/problem/content/121/)
大雪菜提供了[视频讲解](https://www.acwing.com/video/96/)。简而言之，就是把2个点集的点分别做个标记，然后利用一个点集内找最近对的算法（不同标记的点，相当于无穷远）。[一个点集内找最近对](https://www.geeksforgeeks.org/closest-pair-of-points-using-divide-and-conquer-algorithm/)就是一个十分经典的问题了，采用分治可以解决。

时间复杂度: O(N log N), 空间复杂度: O(N).

## 2. 卡牌翻转

[原题 Swap and Flip](https://atcoder.jp/contests/keyence2020/tasks/keyence2020_d)

动态规划。DP[mask][i]表示mask中的牌在最左边，第i个牌在这些牌中的最后，保证非降的最小操作数。
![图片说明](https://uploadfiles.nowcoder.com/images/20200428/407266647_1588073288778_01811641BAED0EC338B3EE5B829175F4 "图片标题") 
时间复杂度: O(n^2 * 2^n),
空间复杂度: O(n * 2 ^ n)

```cpp
#include <bits/stdc++.h>

using namespace std;
using ll = long long;

const int INF = 0x3f3f3f3f;

int main() {
    int N;
    cin >> N;
    vector<int> A(N);
    vector<int> B(N);

    for (int i = 0; i < N; ++i) {
        cin >> A[i];
    }
    for (int i = 0; i < N; ++i) {
        cin >> B[i];
    }
    vector<vector<int>> dp((1 << N), vector<int>(N, INF));
    // dp[mask][i]: the minimum operation when cards in mask are in leftmost and the ith card is in the end
    for (int i = 0; i < N; ++i) {
        dp[1 << i][i] = 0;  // there is no card in leftmost whose id larger than i
    }
    for (int s = 0; s < (1 << N); ++s) {
        for (int i = 0; i < N; ++i) {
            if (((s >> i) & 1) == 0)
                continue;                  // i is not in state
            int c = __builtin_popcount(s); // card number in s
            int value_i = (c % 2) == (i % 2) ? B[i] : A[i];
            int cost = c; // the number of card in s, whose id is larger than j
            for (int j = 0; j < N; ++j) {
                if (((s >> j) & 1) == 1) {
                    --cost;
                    continue; // j is in state already
                }
                int value_j = (j % 2) == (c % 2) ? A[j] : B[j];
                if (value_j >= value_i) {
                    dp[s | (1 << j)][j] =
                        min(dp[s | (1 << j)][j], dp[s][i] + cost);
                }
            }
        }
    }
    int ans = INF;
    for (int i = 0; i < N; ++i) {
        ans = min(ans, dp[(1 << N) - 1][i]);
    }
    ans = ans >= INF ? -1 : ans;
    cout << ans << endl;
    return 0;
}
```

