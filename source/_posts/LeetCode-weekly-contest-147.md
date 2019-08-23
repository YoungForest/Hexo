---
title: LeetCode weekly contest 147
date: 2019-07-28 20:31:35
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (2) |	Q2 (5) |	Q3 (7) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 175 / 4906 |	YoungForest | 21 | 	1:14:32 | 0:08:18  1  | 0:27:17  1  | 0:41:32 | 1:04:32 |

昨天做了Biweekly contest，今天做了常规赛和 下午的Google Kick D.
连续3场比赛，周末很充实。

## 1137. N-th Tribonacci Number
和 Fibonacci 类似。相同的解法应该都可以用在这里。
我采用了实现起来最方便的解法。

时间复杂度: O(N),
空间复杂度: O(N).

```
class Solution {
public:
    int tribonacci(int n) {
        vector<int> dp(max(n + 1, 3));
        dp[0] = 0;
        dp[1] = 1;
        dp[2] = 1;
        for (int i = 3; i <= n; ++i) {
            dp[i] = dp[i-1] + dp[i-2] + dp[i-3];
        }
        return dp[n];
    }
};
```

## 1138. Alphabet Boar

也是straight forward的解法。因为移动距离就是2点之间的曼哈顿距离，所以贪心地移就好了。
此处有坑，`z`的位置上不能向右移，`uvwxy`不能向下移。

时间复杂度: O(N).
空间复杂度: O(N).

```cpp
class Solution {
public:
    string alphabetBoardPath(string target) {
        vector<pair<int, int>> locations(26);
        for (char c = 'a'; c <= 'z'; ++c) {
            int index = c - 'a';
            locations[index] = {index / 5, index % 5};
        }
        pair<int,int> current = {0, 0};
        string ans;
        auto special = locations.back();
        for (char c : target) {
            auto to = locations[c - 'a'];
            if (current != special) {
                if (to.second > current.second) {
                    ans.append(to.second - current.second, 'R');
                } else {
                    ans.append(current.second - to.second, 'L');
                }
                if (to.first > current.first) {
                    ans.append(to.first - current.first, 'D');
                } else {
                    ans.append(current.first - to.first, 'U');
                }
            } else {
                if (to.first > current.first) {
                    ans.append(to.first - current.first, 'D');
                } else {
                    ans.append(current.first - to.first, 'U');
                }
                if (to.second > current.second) {
                    ans.append(to.second - current.second, 'R');
                } else {
                    ans.append(current.second - to.second, 'L');
                }
            }
            ans.push_back('!');
            current = to;
        }
        return ans;
    }
};
```

## 1139. Largest 1-Bordered Square

之前做过一道类似的题目，区别在于正方形是实心的。
本题与之类似。枚举正方形所有的右下角，再枚举所有可能的左上角，判断是否可以组成正方形。

时间复杂度: O(N ^ 3)
空间复杂度: O(N ^ 2)

```cpp
class Solution {
public:
    int largest1BorderedSquare(vector<vector<int>>& grid) {
        auto up = grid, down = grid, left = grid, right = grid;
        const int R = grid.size(), C = grid[0].size();
        for (int i = 0; i < R; ++i) {
            for (int j = 0; j < C; ++j) {
                if (i == 0) {
                    up[i][j] = grid[i][j] == 1 ? 1 : 0;
                } else {
                    up[i][j] = grid[i][j] == 1 ? up[i-1][j] + 1 : 0;
                }
                if (j == 0) {
                    left[i][j] = grid[i][j] == 1 ? 1 : 0;
                } else {
                    left[i][j] = grid[i][j] == 1 ? left[i][j-1] + 1 : 0;
                }
            }
        }
        for (int i = R - 1; i >= 0; --i) {
            for (int j = C - 1; j >= 0; --j) {
                if (i == R - 1) {
                    down[i][j] = grid[i][j] == 1 ? 1 : 0;
                } else {
                    down[i][j] = grid[i][j] == 1 ? down[i+1][j] + 1 : 0;
                }
                if (j == C - 1) {
                    right[i][j] = grid[i][j] == 1 ? 1 : 0;
                } else {
                    right[i][j] = grid[i][j] == 1 ? right[i][j+1] + 1 : 0;
                }
            }
        }
        int ans = 0;
        for (int i = 0; i < R; ++i) {
            for (int j = 0; j < C; ++j) {
                for (int k = min(up[i][j], left[i][j]); k > ans; --k) {
                    int corner_i = i - k + 1;
                    int corner_j = j - k + 1;
                    if (down[corner_i][corner_j] >= k && right[corner_i][corner_j] >= k) {
                        ans = k;
                        break;
                    }
                }
            }
        }
        return ans * ans;
    }
};
```

## 1140. Stone Game II

常规思路就是一个DP。这里采用了top-down的memorization的写法，实现起来更好实现。
状态转移方程。
dp[begin][M] = max(sum of prefix + sum of suffix - dp[begin + X][max(X, M)]), for X in [1, 2 * M].

时间复杂度: O(N^2),
空间复杂度: O(N^2).

```cpp
class Solution {
    vector<map<pair<int, int>, int>> dp;
    vector<int> s;
    int recurse(const vector<int>& piles, int begin, int M, int player) {
        if (begin >= piles.size())
            return 0;
        if (dp[player].find({begin, M}) != dp[player].end()) {
            return dp[player][{begin, M}];
        }
        int add = 0;
        for (int X = 1; X <= 2 * M && begin - 1 + X < piles.size() ; ++X) {
            add += piles[begin - 1 + X];
            dp[player][{begin, M}] = max(dp[player][{begin, M}], add + s[begin + X] - recurse(piles, begin + X, max(M, X), 1 - player));
        }
        return dp[player][{begin, M}];
    }
public:
    int stoneGameII(vector<int>& piles) {
        dp.resize(2);
        s.resize(piles.size() + 1);
        s.back() = 0;
        for (int i = piles.size() - 1; i >= 0; --i) {
            s[i] = piles[i] + s[i+1];
        }
        return recurse(piles, 0, 1, 0);
    }
};
```
