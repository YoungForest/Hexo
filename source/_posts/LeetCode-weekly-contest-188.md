---
title: LeetCode weekly contest 188
date: 2020-05-10 18:25:30
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 445 / 12715 |	YoungForest | 19 | 	1:14:29 |  0:07:04 | 0:17:33 | 0:56:49 | 1:14:29 |

Rating 稳定在2200+2周了，虽然本周的rating还没有更新，但根据排名应该是会继续升的。争取早日到达2300+的分数线。最近刷题遇到了瓶颈，很多hard的题目还是不会做，也没有总结出自己刷题的模版和类别。我发现很多大佬之所以很强，是因为看到题目描述，可以很快地发现该题目属于具体的哪类，迅速和之前做过的题目建立联系，才能又快又bug free的AC。


## 1441. Build an Array With Stack Operations

One pass. 2个下标分别指向target的位置和n中的位置。

时间复杂度: O(max(N, target.size())),
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<string> buildArray(vector<int>& target, int n) {
        int i = 1;
        int index = 0;
        vector<string> ans;
        for (; i <= n && index < target.size(); ++i) {
            if (target[index] == i) {
                ans.push_back("Push");
                ++index;
            } else {
                ans.push_back("Push");
                ans.push_back("Pop");
            }
        }
        return ans;
    }
};
```

## 1442. Count Triplets That Can Form Two Arrays of Equal XOR

本题需要利用 异或 的一个性质。`a ^ a = 0`, `a ^ b = b ^ a`, `(a ^ b) ^ c = a ^ (b ^ c)`. 即 自反律，交换律，结合律。
所以可以根据类似 presum 的操作在O(1)的时间里算出整个区间的异或值。
然后枚举 所有三元组，找到符合条件的。

时间复杂度: O(N ^ 3),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int countTriplets(vector<int>& arr) {
        // Time: O(n ^ 3)
        vector<int> prexor(arr.size() + 1);
        prexor[0] = 0;
        // prexor[i]: arr[0] ^ ... ^ arr[i-1]
        for (int i = 0; i < arr.size(); ++i) {
            prexor[i+1] = prexor[i] ^ arr[i]; 
        }
        // [i, j)
        auto xorquick = [&](int i, int j) -> int {
            return prexor[j] ^ prexor[i];
        };
        int ans = 0;
        for (int i = 0; i < arr.size(); ++i) {
            for (int j = i + 1; j < arr.size(); ++j) {
                for (int k = j; k < arr.size(); ++k) {
                    if (xorquick(i, j) == xorquick(j, k + 1)) {
                        ++ans;
                        // cout << "(" << i <a< "," << j << "," << k << ")" << endl;
                    }
                }
            }
        }
        return ans;
    }
};
```

Discuss里有寒神给出的
[O(N^2)的算法和O(N)的算法](https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/discuss/623747/JavaC%2B%2BPython-One-Pass-O(N4)-to-O(N)).

## 1443. Minimum Time to Collect All Apples in a Tree

树状DP。首先，递归搜索所有子树是否有苹果。然后，递归收集子树重的苹果。

时间复杂度: O(N),
空间复杂度: O(N).

一开始看错了题目，忽略了还必须回到根节点，所以写了更复杂度的树状DP。增加了一个条件，是否需要回来。耽误了半个小时，否则我的本次周赛的排名还可以再提高点。

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
public:
    int minTime(int n, vector<vector<int>>& edges, vector<bool>& hasApple) {
        vector<vector<int>> children(n);
        for (const auto& v : edges) {
            children[v[0]].push_back(v[1]);
            children[v[1]].push_back(v[0]);
        }
        children[0].push_back(-1);
        vector<bool> hasAppleInChildTree(n);
        function<int(int, int)> recurse = [&](int root, int parent) -> int {
            bool ans = hasApple[root];
            for (int child : children[root]) {
                if (child != parent) {
                    if (recurse(child, root)) {
                        ans = true;
                    }
                }
            }
            return hasAppleInChildTree[root] = ans;
        };
        recurse(0, -1);
        function<int(int,int)> dp = [&](int root, int parent) -> int {
           // return step need to collect all apple int subtree root
            if (children[root].size() == 1) return 0;
            int ans = 0;
            for (int child : children[root]) {
                if (child != parent && hasAppleInChildTree[child] == true) {
                    ans += dp(child, root) + 2;
                }
            }
            return ans;
        };
        return dp(0, -1);
    }
};
```

## 1444. Number of Ways of Cutting a Pizza

一道典型的DP问题。
每步DP切一刀。

时间复杂度: O(rows * cols * k * (rows + cols)^2),
空间复杂度: O(rows * cols * k).

```cpp
class Solution {
    const int MOD = 1e9 + 7;
    using ll = long long;
public:
    int ways(vector<string>& pizza, int k) {
        const int rows = pizza.size();
        const int cols = pizza[0].size();
        auto containApple = [&](int x, int y, int r, int c) -> bool {
            for (int i = x; i < x + r; ++i) {
                for (int j = y; j < y + c; ++j) {
                    if (pizza[i][j] == 'A') {
                        return true;
                    }
                }
            }
            return false;
        };
        map<tuple<int,int,int>, int> memo;
        // time: rows * cols * k * (rows + cols)^2
        function<ll(int, int, int)> dp = [&](int x, int y, int remainCut) -> ll {
            auto it = memo.find({x, y, remainCut});
            if (it != memo.end()) return it->second;
            else {
                ll ans = 0;
                if (remainCut == 0) {
                    ans = containApple(x, y, rows - x, cols - y) ? 1 : 0;
                } else {
                    for (int cutx = x + 1; cutx < rows; ++cutx) {
                        if (containApple(x, y, cutx - x, cols - y)) {
                            ans += dp(cutx, y, remainCut - 1);
                            ans %= MOD;
                        }
                    }
                    for (int cuty = y + 1; cuty < cols; ++cuty) {
                        if (containApple(x, y, rows - x, cuty - y)) {
                            ans += dp(x, cuty, remainCut - 1);
                            ans %= MOD;
                        }
                    }
                }
                return memo[{x, y, remainCut}] = ans;
            }
        };
        return dp(0, 0, k-1);
    }
};
```

## 后记

在残酷刷题群的这一个半月里，我跟随每日打卡，做了很多比较难的DP问题。周赛的进步也是明显的。群排名也从刚开始的30，进步为15. 我入群时人数170，现在只有146了。所以我怀疑是有很多大佬退群，我的群排名才更好看了。不过群友和群主都鼓励我说，“是你变强了”。我觉得确实有这部分因素。
纵观自己的研究生生涯，科研每做好，题倒是刷了不少。这周正式突破1000+题了。
遥想[我当年看到LeetCode的题目超过1000时](https://youngforest.github.io/2019/03/03/LeetCode-weekly-contest-126/)还很感叹，怎么可能做的完。现在LeetCode有1400+题目，我也做了1000+。