---
title: LeetCode weekly contest 231
date: 2021-03-07 16:06:05
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 221 / 12900 | YoungForest | 13 | 	0:26:48 |  0:03:30 |  0:08:23  1 | 0:21:48 | null |

3题选手, again。sad.

<!-- more -->

## 1784. Check if Binary String Has at Most One Segment of Ones

签到题。有限状态机。

```cpp
class Solution {
public:
    bool checkOnesSegment(string s) {
        int state = 0;
        // 0: not see 1
        // 1: see 1 and now 1
        // 2: see 1 but now 0
        for (char c : s) {
            if (c == '0') {
                if (state == 0) {
                    state = 0;
                } else if (state == 1) {
                    state = 2;
                } else {
                    state = 2;
                }
            } else { // c == '1'
                if (state == 0) {
                    state = 1;
                } else if (state == 1) {
                    state = 1;
                } else {
                    return false;
                }
            }
        }
        return true;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1785. Minimum Elements to Add to Form a Given Sum

贪心。每次都加减limit/-limit，以最大步长，以得到最小步数。
注意: 这里题目数据范围故意挖了坑，用`int`求和`nums`会溢出。当然`Python`没有这种问题。

```cpp
class Solution {
    using ll = long long;
public:
    int minElements(vector<int>& nums, ll limit, ll goal) {
        const ll current = accumulate(nums.begin(), nums.end(), 0L);
        if (current > goal) {
            return (current - goal) / limit + (((current - goal) % limit == 0) ? 0 : 1);
        } else if (current == goal) {
            return 0;
        } else {
            return (goal - current) / limit + (((goal - current) % limit == 0) ? 0 : 1);
        }
    }
};
```

## 1786. Number of Restricted Paths From First to Last Node

题目比较难理解，但其实不难。
用`Dijistra`求解`distanceToLastNode(x)`，然后记忆化`dfs`就OK了。

```cpp
class Solution {
    using pii = pair<int, int>;
    const int MOD = 1e9 + 7;
public:
    int countRestrictedPaths(int n, vector<vector<int>>& edges) {
        // dijistra: E log E + V
        vector<vector<pii>> neighbors(n+1);
        for (const auto& e : edges) {
            neighbors[e[0]].push_back({e[1], e[2]});
            neighbors[e[1]].push_back({e[0], e[2]});
        }
        
        vector<int> distance(n + 1, 0);
        priority_queue<pii, vector<pii>, greater<>> pq;
        vector<bool> visited(n + 1, false);
        pq.push({0, n});
        while (!pq.empty()) {
            auto [d, current] = pq.top();
            pq.pop();
            if (!visited[current]) {
                visited[current] = true;
                distance[current] = d;
                for (auto neighbor : neighbors[current]) {
                    pq.push({d + neighbor.second, neighbor.first});
                }
            }
        }
        
        vector<int> memo(n + 1, -1);
        function<int(const int)> dfs = [&](const int current) -> int {
            if (current == n) {
                return memo[current] = 1;
            } else {
                if (memo[current] != -1) return memo[current];
                int ans = 0;
                for (auto neighbor : neighbors[current]) {
                    const int node = neighbor.first;
                    if (distance[node] < distance[current]) {
                        ans = (ans + dfs(node)) % MOD;
                    }
                }
                return memo[current] = ans;
            }
        };
        
        return dfs(1);
    }
};
```

时间复杂度: O(E log E + V + E),
空间复杂度: O(V + E).

## [1787. Make the XOR of All Segments Equal to Zero](https://leetcode.com/problems/make-the-xor-of-all-segments-equal-to-zero/) [中文](https://leetcode-cn.com/problems/make-the-xor-of-all-segments-equal-to-zero/)

说实话本题想了半天没思路，我还去Google了半天，感觉可能会是一道原题。然而没找到。
赛后群友发出来链接，果然是原题：
[原题链接](https://stackoverflow.com/questions/64186699/minimum-changes-so-the-xor-of-every-k-consecutive-elements-is-0)。
看来搜题也是一门技术呀。有的人能搜到抄代码也算是他的本事。

我是参考[群主的题解](https://www.bilibili.com/video/BV1vz4y1175J/)。

首先可以观察到 最后的状态中，每`k`个数是重复出现的。所以可以判定，我们只需要计算头`k`个数`XOR`为0即可。当然，算`cost`时，需要考虑后面的。

然后根据数据返回，猜测是时间复杂度为O(1024*n)的DP。然后再构造状态转移方程。

```cpp
class Solution {
    const int MAX_NUMS = 1 << 10;
public:
    int minChanges(vector<int>& nums, int k) {
        const int n = nums.size();
        
        // the total size of Set[i]
        vector<int> totalCost(k);
        // cnt[i][j]: the count of j in Set[i]
        vector<unordered_map<int, int>> cnt(k);
        
        for (int i = 0; i < n; ++i) {
            ++totalCost[i % k];
            ++cnt[i%k][nums[i]];
        }
        
        // the cost to set Set[i] to v
        auto cost = [&](const int i, const int v) -> int {
            return totalCost[i] - cnt[i][v];
        };
        
        // dp[i][d]: the minimum cost to make first i XOR equal to d
        vector<vector<int>> dp(k, vector<int> (MAX_NUMS, numeric_limits<int>::max()));
        int minLastDp = numeric_limits<int>::max();
        for (int d = 0; d < MAX_NUMS; ++d) {
            dp[0][d] = totalCost[0] - cnt[0][d];
            minLastDp = min(minLastDp, dp[0][d]);
        }
        for (int i = 1; i < k; ++i) {
            int minDp = numeric_limits<int>::max(); 
            for (int d = 0; d < MAX_NUMS; ++d) {
                dp[i][d] = minLastDp + totalCost[i];
                for (int j = i; j < n; j += k) {
                    dp[i][d] = min(dp[i][d], 
                                  dp[i-1][d^nums[j]] + cost(i, nums[j]));
                }
                minDp = min(minDp, dp[i][d]);
            }
            minLastDp = minDp;
        }
        return dp[k-1][0];
    }
};
```

时间复杂度: O(k * 1024 * n / k) = O(1024 * n),
空间复杂度: O(k * 1024).