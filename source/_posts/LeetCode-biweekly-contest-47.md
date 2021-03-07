---
title: LeetCode biweekly contest 47
date: 2021-03-07 16:06:47
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 64 / 9933 | YoungForest | 18 | 0:55:55 |  0:03:37 |  0:07:16 |  0:13:28 | 0:55:55 |

疯狂上分场。13分钟做出3题。最后一题也思路相对比较顺畅。遇到2个阻塞。1. 一开始忘记考虑没有边相连的点对；2. 求了互补问题，但返回答案时粗心误以为总数是`n^2`，而事实上是`C_2 n = n * (n - 1) / 2`， 调试又浪费了不少时间。如果更加顺利的话，说不定成绩会突破天际。拿到前20名丰盛的礼物。

<!-- more -->

## 1779. Find Nearest Point That Has the Same X or Y Coordinate

签到题。遍历一遍，判断是否同列/同行，和距离是否更近。

```cpp
class Solution {
    int distance(const vector<int>& a, const vector<int>& b) {
        return abs(a[0] - b[0]) + abs(a[1] - b[1]);
    }
public:
    int nearestValidPoint(int x, int y, vector<vector<int>>& points) {
        const vector<int> me = {x, y};
        int ans = -1;
        int ansDistance = numeric_limits<int>::max();
        for (int i = 0; i < points.size(); ++i) {
            const auto& v = points[i];
            if (v[0] == me[0] || v[1] == me[1]) {
                const int newDistance = distance(me, v);
                if (newDistance < ansDistance) {
                    ansDistance = newDistance;
                    ans = i;
                }
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1780. Check if Number is a Sum of Powers of Three

三进制编码。每位只能是0或1，不能是2.

```cpp
class Solution {
public:
    bool checkPowersOfThree(int n) {
        // x = (x - 1) / 3 or x / 3
        // time: log_3 (n)
        int x = n;
        while (x > 0) {
            if ((x - 1) % 3 == 0) {
                x = (x - 1) / 3;
            } else if (x % 3 == 0) {
                x = x / 3;
            } else {
                return false;
            }
        }
        return true;
    }
};
```

时间复杂度: O(log_3 N),
空间复杂度: O(1).

## 1781. Sum of Beauty of All Substrings

观察到数据规模并不大，`500`. 暴力枚举所有子串，O(1)更新 `beauty`.

```cpp
class Solution {
public:
    int beautySum(string s) {
        // brute-force: n ^ 2 * log 26
        int ans = 0;
        for (int i = 0; i < s.size(); ++i) {
            vector<int> count(26, 0);
            multiset<int> cnt;
            for (int j = i; j < s.size(); ++j) {
                // s[i:j]
                auto it = cnt.find(count[s[j] - 'a']);
                if (it != cnt.end()) cnt.erase(it);
                ++count[s[j] - 'a'];
                cnt.insert(count[s[j] - 'a']);
                ans += (*cnt.rbegin() - *cnt.begin());
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N^2 * log 26),
时间复杂度: O(26).

## 1782. Count Pairs Of Nodes

观察到点数`V`还是很大的：`2*10^4`，所以无法枚举所有的点对。
但`E`的数目不大`10^5`，不属于稠密图。
所以可以暴力边。
而且`queries.size()`较小，只有20.

总的思路是，先求所有点的度，如果2点度的和小于等于query，则2点的`cnt`一定小于等于`query`。因为有`cnt(a, b) <= degree(a) + degree(b)`，等号成立当且仅当`a` `b`不互连。
我们可以先把度排序，然后用`two sum`的方式二分搜索所有的满足`degree(a) + degree(b) <= query`的点对。
虽然题目要求`cnt`严格大于`query`, 但是我们先求`cnt <= query`。因为两者是互补的。除了上述符合要求的点对，还有另外一些有边的点对也可能符合要求。这些点对是:
`degree(a) + degree(b) > query and degree(a) + degree(b) - edges(a, b) <= query`. 只需要遍历一遍所有的边即可。

```cpp
class Solution {
    using pii = pair<int, int>;
public:
    vector<int> countPairs(int n, vector<vector<int>>& edges, vector<int>& queries) {
        // time: E + 20 * (E + V log V)
        map<pii, int> edgesCount;
        vector<int> degree(n, 0);
        for (auto& e : edges) {
            if (e[0] > e[1]) swap(e[0], e[1]);
            ++degree[e[0] - 1];
            ++degree[e[1] - 1];
            ++edgesCount[{e[0] - 1, e[1] - 1}];
        }
        
        vector<int> degreeV = degree;
        sort(degreeV.begin(), degreeV.end());
        
        vector<int> answers;
        answers.reserve(queries.size());
        for (int i : queries) {
            int ret = 0;
            for (auto ait = degreeV.begin(); ait != degreeV.end(); ++ait) {
                const int j = *ait;
                auto bit = upper_bound(degreeV.begin(), ait, i - j);
                ret += distance(degreeV.begin(), bit);
            }
            for (auto p : edgesCount) {
                if (degree[p.first.first] + degree[p.first.second] > i && degree[p.first.first] + degree[p.first.second] - p.second <= i) ++ret;
            }
            answers.push_back((n * (n - 1)) / 2 - ret);
        }
        return answers;
    }
};
```

时间复杂度: O(E + queries.size() * (E + V log V)),
空间复杂度: O(V + E).