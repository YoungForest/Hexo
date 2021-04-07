---
title: LeetCode weekly contest 146
date: 2019-07-21 22:49:39
tags:
- Competitive Programming
categories:
- LeetCode
---

今天由于高中同学xl来北京找我聊，和hcq一起吃了午饭和晚饭，并聊了一下午。上午的contest只匆匆做了签到题。第二题因为粗心，写错了`red`变化的时机，也没有时间调试。后2题干脆没有看。
晚上回来9点才把题目补完，第二题的bug也调出来了。
不过时间上应该是超时了。
排名1800+。

总体来讲，本次题目虽然不难，但是需要花时间思考才能做出来的。这样的题目也是我喜欢的。通过自己的思考，作出一道并不是一眼看上去就知道解答的题目，是很爽的。快感可比超神和三杀。

## 5130. Number of Equivalent Domino Pairs

既然domino可以通过旋转相等，我们就把他们归一化(将2种domino映射成一种)。
然后计算组合数即可。

时间复杂度: O(N log N), 因为pair默认不是hashable，所以偷懒用了map。
空间复杂度: O(N).

```cpp
class Solution {
public:
    int numEquivDominoPairs(vector<vector<int>>& dominoes) {
        const int n = dominoes.size();
        map<pair<int, int>, int> transform;
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            if (dominoes[i][0] < dominoes[i][1]) {
                ++transform[make_pair(dominoes[i][0], dominoes[i][1])];  
            } else {
                ++transform[make_pair(dominoes[i][1], dominoes[i][0])];
            }
        }
        for (const auto& p : transform) {
            ans += p.second * (p.second - 1) / 2;
        }
        return ans;
    }
};
```

## 1129. Shortest Path with Alternating Colors

算最短路径，用BFS。由于需要颜色交替，代码略微有些麻烦，需要2套变量。

时间复杂度: O(N), 每个节点最多遍历2次。
空间复杂度: O(max(N, edges)).

```cpp
class Solution {
public:
    vector<int> shortestAlternatingPaths(int n, vector<vector<int>>& red_edges, vector<vector<int>>& blue_edges) {
        unordered_map<int, vector<int>> red_to, blue_to;
        for (const auto& edge : red_edges) {
            red_to[edge[0]].push_back(edge[1]);
        }
        for (const auto& edge : blue_edges) {
            blue_to[edge[0]].push_back(edge[1]);
        }
        vector<int> ret(n, numeric_limits<int>::max());
        ret[0] = 0;
        // bfs
        for (bool red : {true, false}) {
            queue<int> q;
            unordered_set<int> seen_red, seen_blue;
            q.push(0);
            seen_red.insert(0);
            seen_blue.insert(0);
            int level = 0;
            while (!q.empty()) {
                int s = q.size();
                ++level;
                for (int i = 0; i < s; ++i) {
                    int current = q.front();
                    q.pop();
                    vector<int>* edges = nullptr;
                    unordered_set<int>* seen = nullptr;
                    if (red) {
                        edges = &red_to[current];
                        seen = &seen_red;
                    } else {
                        edges = &blue_to[current];
                        seen = &seen_blue;
                    }
                    for (int des : *edges) {
                        if (seen->find(des) == seen->end()) {
                            q.push(des);
                            seen->insert(des);
                            ret[des] = min(ret[des], level);
                        }
                    }
                }            
                red = !red;
            }
        }
        for (auto& item : ret) {
            if (item == numeric_limits<int>::max())
                item = -1;
        }
        return ret;
    }
};
```

## 5131. Minimum Cost Tree From Leaf Values

本题是本次比赛中最难的题目。我也是思考了很长时间才摸索出来的。

首先，观察有：
- 层数和叶子数的关系。n层至少n个叶子，至多2^(n-1)个叶子。
- 叶子数确定的话，非叶子节点数目也就确定了。
- 观察小的树，可得贪心的解法。大的叶子尽量往上提，降低层数，使得影响的非叶子节点数更少，总和就最少。

时间复杂度: O(n log n). 类似快排，把问题分解成2个子问题，然后还需要end - begin组合解。
空间复杂度: O(n), n个叶子最多n层，也就是递归深度. 

```cpp
class Solution {
    int ret = 0;
    // max_leaf
    int recurse(const vector<int>& arr, int begin, int end) {
        if (begin + 1 == end) {
            return arr[begin];
        }
        int max_index = begin;
        int max_value = arr[begin];
        for (int i = begin + 1; i < end; ++i) {
            if (arr[i] >= max_value) {
                max_value = arr[i];
                max_index = i;
            }
        }
        int l, r;
        if (max_index - begin + 2 <= end - max_index) { // 向后分
            l = recurse(arr, begin, max_index + 1);
            r = recurse(arr, max_index + 1, end);
        } else {    // 向前分
            l = recurse(arr, begin, max_index);
            r = recurse(arr, max_index, end);
        }
        ret += l * r;
        return max(l, r);
    }
public:
    int mctFromLeafValues(vector<int>& arr) {
        recurse(arr, 0, arr.size());
        return ret;
    }
};
```

## 1131. Maximum of Absolute Value Expression

首先观察数据规模`40000`, 排除暴力解法的`O(N^2)`。
寻找`O(N)` 或 `O(N log N)`的解法。
实际上，由于绝对值的作用有2种：不变，取反。3个绝对值号，枚举2^3 = 8种组合即可。

时间复杂度: O(8 * N)
空间复杂度: O(N), 可以很轻易地缩减为O(1).

```cpp
class Solution {
public:
    int maxAbsValExpr(vector<int>& arr1, vector<int>& arr2) {
        const int n = arr1.size();
        int ans = numeric_limits<int>::min();
        vector<int> tmp(n);
        for (int i : {-1, 1}) {
            for (int j : {-1, 1}) {
                for (int k : {-1, 1}) {
                    for (int l = 0; l < n; ++l) {
                        tmp[l] = arr1[l] * i + arr2[l] * j + l * k;
                    }
                    auto r = minmax_element(tmp.begin(), tmp.end());
                    ans = max(ans, *r.second - *r.first);
                }
            }
        }
        return ans;
    }
};
```