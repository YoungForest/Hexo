---
title: 阿里巴巴 蚂蚁金服 后端开发 暑期实习生
date: 2020-03-09 16:45:44
tags:
- Alibaba
- intern
categories:
- interview
---

# 一面

time: 2020-03-09 16:45:44

## 简历经历

对各段项目的介绍。根据项目随时提问，如RESTful API, SOAP之类的知识。

## 计算机基础

HashMap 的实现
- Hash值如何映射到桶中？？？？
- hashcode和equals函数的要求（修改equals为什么必须要修改hashcode)
- 扩容机制和均摊复杂度

Java 开箱 和 装箱 机制。（一开始没反应过来，说不会。在面试官的提醒下，基础类型 和 对象类型 的关系，我才会了。因为之前看的都是英文材料，box和unbox，对中文不是很敏感。）

## 算法题

编辑距离的递推公式

K-means算法。没答好，很久之前学过机器学习。但是因为放下的时间太久了，几乎都忘记了。

## 对面试官的反问

问面试官的问题：我投递的岗位是 后端开发，是否需要复习机器学习的算法？

答：这和公司的产品线有关，蚂蚁金服的产品和机器学习密切相关。开发不需要对机器学习有很深的了解，但需要有基础的了解。如果会的话，有加分。

# 二面

time: 2020-03-24 16:20:56

距离一面已经2周了，昨天收到电话，约了今天下午3点的电话面试。时长半个小时。

商汤实习项目。

ArrayList（自增数组）实现，底层链表和数组的区别。

1千万个数共10M，内存只有2M, 寻找出现次数最多的10个数字。
答：先分组，可以按照数字的个别数位来分成小组，在每个组里寻找这10个数字。在合并，寻找总的10个数字。

看了哪些书？

熟悉SQL是个啥意思？

并发的知识:
- ConcurrencyHashMap
- 无锁编程

职业规划。

大概回答的不是很好，面试官催促我完成笔试，要不然只能问我简历上的内容。笔试完会有人再联系我。今天下午状态不大好，没发挥好。没有手撕代码环节，差评～

# 笔试

阿里笔试有多场。我做的是3.25这天的。

笔试难度不大，在牛客网上完成，2道算法题，LeetCode medium难度。拿了满分，导致貌似阿里那边觉得我很优秀，后面的流程就顺风顺水，特别想我过去。好多同事和lead加我微信，打电话劝我。所以最后拒阿里offer时还挺不好意思的。

>
>给3xn的矩阵，每列选择其中的一个数, 形成最后的数组。
使得最后的

>$$\sum_{i = 0}^{n-1} |b_{i+1} - b_i|$$
>最小。
>输出最小的这个值。

DP求解即可。

时间复杂度: O(3N),
空间复杂度: O(3).

```cpp
```cpp
#include <vector>
#include <iostream>
#include <algorithm>

using namespace std;
using ll = long long;

int main() {
    int n;
    cin >> n;
    vector<ll> last_dp(3, 0);
    vector<vector<ll>> matrix(3, vector<ll> (n));
    for (int i = 0; i < 3; ++i) {
        for (int j = 0; j < n; ++j) {
            cin >> matrix[i][j];
        }
    }
    for (int i = 1; i < n; ++i) {
        vector<ll> dp(3);
        for (int dp_index = 0; dp_index < 3; ++dp_index) {
            dp[dp_index] = abs(matrix[dp_index][i] - matrix[0][i-1]) + last_dp[0];
            for (int j = 1; j < 3; ++j) {
                ll new_value = abs(matrix[dp_index][i] - matrix[j][i-1]) + last_dp[j];
                if (new_value < dp[dp_index]) {
                    dp[dp_index] = new_value;
                }
            }
        }
        last_dp = move(dp);
    }
    cout <<  min({last_dp[0], last_dp[1], last_dp[2]}) << endl;
    return 0;
}
```

-----

>一个n x m的矩阵，每列每行都是等差数列，公差为整数。
>输入n x m个数，如果为0表示不知道，否则知道。
>q个查询，特定位置（下标1开始）的值是否可确定。

递归求解，进行推测即可。可以用一些数组维护：每行/列是否已经被推断、每行/列已知道的数的下标、行列信息。

时间复杂度: O(N * M),
空间复杂度: O(N * M).

```cpp
#include <vector>
#include <iostream>
#include <algorithm>
#include <functional>

using namespace std;
using ll = long long;
const int INF = 0x3f3f3f3f;

int main() {
    int n, m, q;
    cin >>  n >> m >> q;
    vector<vector<int>> A(n, vector<int> (m, INF));
    vector<int> row(n, -1);
    vector<bool> row_ok(n, false);
    vector<int> col(m, -1);
    vector<bool> col_ok(m, false);
    function<void(int, int, int)> fill = [&](int i, int j, int value) -> void {
        A[i][j] = value;
        if (col_ok[j] && row_ok[i]) {
            return;
        } else {
            if (!col_ok[j]) {
                if (col[j] == -1 || col[j] == i) {
                    col[j] = i;
                } else {
                    col_ok[j] = true;
                    int diff = (A[i][j] - A[col[j]][j]) / (i - col[j]);
                    for (int r = i - 1; r >= 0; --r) {
                        fill(r, j, A[r + 1][j] - diff);
                    }
                    for (int r = i + 1; r < n; ++r) {
                        fill(r, j, A[r - 1][j] + diff);
                    }
                }
            }
            if (!row_ok[i]) {
                if (row[i] == -1 || row[i] == j) {
                    row[i] = j;
                } else {
                    row_ok[i] = true;
                    int diff = (A[i][j] - A[i][row[i]]) / (j - row[i]);
                    for (int c = j - 1; c >= 0; --c) {
                        fill(i, c, A[i][c + 1] - diff);
                    }
                    for (int c = j + 1; c < m; ++c) {
                        fill(i, c, A[i][c - 1] + diff);
                    }
                }
            }
        }
    };
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            int v;
            cin >> v;
            if (v != 0) {
                fill(i, j, v);
            }
        }
    }
    for (int i = 0; i < q; ++i) {
        int r, c;
        cin >> r >> c;
        --r;
        --c;
        if (A[r][c] == INF) {
            cout << "Unknown" << endl;
        } else {
            cout << A[r][c] << endl;
        }
    }
    return 0;
}
```

# 测评

笔试没难倒我，测试却花了我不少时间。
主要是测试
- 语文：阅读理解、成语使用、归纳和排除 10min
- 数学：表格、图、经济用语 10min
- 智商：看图找规律 10min
- 性格：是否抗压、反社会 30min

全靠高中学习到的知识和技能。智商就天生的呗。
据说和公务员的考试很像，行测。有了解的朋友可以看看。

应该也不会用测评去筛人，又不是考公务员，手撕代码才是王道。

# 三面

time: 2020-04-03 11:36:14

昨天电话约了今天的电话面试，11:30，聊了40分钟。
昨天下午做了阿里的线上笔试，晚上做了测评。

面试官很NICE，还加了我微信进行沟通。
主要聊了项目，还有一些数据处理的知识和Java的了解。
- 数据预处理，对缺失值的处理
- 给一个信用评估的数据，如何利用和上线
- Java了解程度和使用，Spring boot

最后问了英语怎样，口语如何。可能是因为对方是 国际化事业群 吧。

我最后问了面试官所在的组和业务。
面向海外的个人信贷业务，类似花呗和借呗。

# 四面

time: 2020-04-03 15:22:02

上周和HR约了这周的交叉面。本来是周一的视频面试，后来面试官出差了，换了一个面试官，改约周三（4.1）。而且新的面试官很忙，没有约具体时间，只是让我下午和晚上等电话。晚上7点半收到电话，聊了40min。

面试因为只是电话面试，无法手撕代码，只问了一个简单的算法题：桶排序。
除此之外都是项目，但项目问的很深，很细节。我简历上的实习项目都是当时花了很大功夫完成的，但无奈过去的时间过于久远，很多细节和考虑一时也无法答上来。而且当时做实习的时候更多的是着眼眼前遇到的困难，而不是深入了解整个公司的架构，所以答的并不是很好。面试官问了很多BQ(Behavior Question)的问题。如：
- 你之前项目上遇到的最大的困难是什么？
- 你实习时发生的最难过的事是？
- 你之前坚持过最久的事是？
了解的都很细，很多问题我从未遇到，也没有认真思考过。之前听说外企才有BQ，而且也大都是HR问。所以虽然不手撕代码，但全程依然很累。

最后面试官问 我还有什么问题吗？我竟然说“没什么问题了，我家长叫我吃饭呢！”这样的大实话。哈哈～

昨天接到电话，又约了下周二(4.7)的HR面。愿一切顺利。

现在最担心的是因为疫情的原因，暑假都不一定有了，暑期实习恐怕也去不了。

Google的面试进度也停了3周。说是因为实习生招收政策的调整，要推迟到4月中。听过美国疫情很严重，发的offer很多都鸽了。难倒谷歌中国也要减少HC，有同学知道内部消息不？我苦呀！