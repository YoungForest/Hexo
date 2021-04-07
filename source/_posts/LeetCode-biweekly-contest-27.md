---
title: LeetCode weekly contest 27
date: 2020-05-31 17:41:49
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 231 / 7926 |	YoungForest | 18 | 	0:42:16 | 0:04:51 |   0:10:55 | 0:22:31  1 |  0:37:16 |

质量还可以的手速场。有些问题值得思考，只有发现本质，才能迅速解决。

## 1460. Make Two Arrays Equal by Reversing Sub-arrays

由于对reverse操作的数目不限，我们可以采用这样的策略构造将2个array转成相同的array。用类似select sort的思想，每次reverse可以将一个位置排好序。所以问题转化为，2个数组排好序后是否相等。
C++中vector的`==`的作用正是如此。

时间复杂度: O(N log N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    bool canBeEqual(vector<int>& target, vector<int>& arr) {
        sort(target.begin(), target.end());
        sort(arr.begin(), arr.end());
        return target == arr;
    }
};
```

## 1461. Check If a String Contains All Binary Codes of Size K

滑动窗口。窗口大小K，判断所有`0 - 2^K - 1`的二进制是否出现。

时间复杂度: O(s.size()),
空间复杂度: O(1 << K).

```cpp
class Solution {
public:
    bool hasAllCodes(string s, int k) {
        vector<bool> seen(1 << k, false);
        int current = 0;
        for (int i = 0; i < k && i < s.size(); ++i) {
            current = current * 2 - '0' + s[i];
        }
        seen[current] = true;
        for (int i = k; i < s.size(); ++i) {
            current = (current - (s[i-k]-'0') * (1 << (k-1))) * 2 - '0' + s[i];
            seen[current] = true;
        }
        return all_of(seen.begin(), seen.end(), [](const auto& a) -> bool {
            return a;
        });
    }
};
```

## 1462. Course Schedule IV

DFS. 这里要注意queries本身很大，但是n很小。所以需要采用记忆化的DFS，防止重复计算。

时间复杂度: O(n ^ 3 + queries),
空间复杂度: O(n ^ 2).

```cpp
class Solution {
public:
    vector<bool> checkIfPrerequisite(int n, vector<vector<int>>& prerequisites, vector<vector<int>>& queries) {
        unordered_map<int, vector<int>> edges;
        for (const auto& v : prerequisites) {
            edges[v[1]].push_back(v[0]);
        }
        map<pair<int,int>, bool> memo;
        function<bool(int,int,unordered_set<int>&)> dfs = [&](int root, int target, unordered_set<int>& seen) -> bool {
            if (memo.find({root, target}) == memo.end()) {
                if (target == root) return memo[{root, target}] = true;
                for (int neighbor : edges[root]) {
                    if (seen.find(neighbor) == seen.end()) {
                        seen.insert(neighbor);
                        if (dfs(neighbor, target, seen)) return memo[{root, target}] = true;
                    }
                }
                return memo[{root, target}] = false;
            } else  {
                return memo[{root, target}];
            }
        };
        vector<bool> ans(queries.size());
        for (int i = 0; i < queries.size(); ++i) {
            unordered_set<int> seen;
            ans[i] = dfs(queries[i][1], queries[i][0], seen);
        }
        return ans;
    }
};
```

Discuss中提到可以用 [Floyd-Warshall 算法](https://zh.wikipedia.org/wiki/Floyd-Warshall%E7%AE%97%E6%B3%95)，计算有向图中2点的最短距离。

## 1463. Cherry Pickup II

DP.
dp[i][first][second]: 机器人走到第i行，第一个机器人的位置在first, 第二个在second 时，最大的cherry pick。

`dp[i][first][second] = max(dp[i-1][for last_first in range(first - 1, first + 2)])[for last_second in range(second - 1, second + 2)] + (grid[i][first] + grid[i][second]) if first != second else grid[i][first]`.

时间复杂度: O(rows * cols^2 * 9),
空间复杂度: O(rows * cols^2) -> O(cols^2).

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
public:
    int cherryPickup(vector<vector<int>>& grid) {
        const int rows = grid.size();
        const int cols = grid[0].size();
        vector<vector<vector<int>>> dp (rows, vector<vector<int>>(cols, vector<int>(cols, -INF)));
        dp[0][0][cols-1] = grid[0][0] + grid[0][cols-1];
        vector<int> dj = {-1, 0, 1};
        for (int i = 1; i < rows; ++i) {
            for (int first = 0; first < cols; ++first) {
                for (int second = 0; second < cols; ++second) {
                    int add =  first == second ? grid[i][first] : grid[i][first] + grid[i][second];
                    for (int dfirst : dj) {
                        int last_first = first + dfirst;
                        if (last_first >= 0 && last_first < cols) {
                            for (int dsecond : dj) {
                                int last_second = second + dsecond;
                                if (last_second >= 0 && last_second < cols) {
                                    dp[i][first][second] = max(dp[i][first][second], dp[i-1][last_first][last_second] + add);
                                }
                            }
                        }
                    }
                }
            }
        }
        int ans = 0;
        for (int first = 0; first < cols; ++first) {
            for (int second = 0; second < cols; ++second) {
                ans = max(ans, dp[rows-1][first][second]);
            }
        }
        return ans;
    }
};
```