---
title: LeetCode weekly contest 231
date: 2021-03-07 16:06:05
tags:
categories:
---


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

## 1787. Make the XOR of All Segments Equal to Zero

说实话本题想了半天没思路，我还去Google了半天，感觉可能会是一道原题。然而没找到。
赛后群友发出来链接，果然是原题：
[原题链接](https://stackoverflow.com/questions/64186699/minimum-changes-so-the-xor-of-every-k-consecutive-elements-is-0)。
看来搜题也是一门技术呀。有的人能搜到抄代码也算是他的本事。