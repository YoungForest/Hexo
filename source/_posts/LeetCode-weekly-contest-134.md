---
title: LeetCode weekly contest 134
date: 2019-04-28 20:32:34
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (5) |	Q4 (5)|
|--|--|--|--|--|--|--|--|
|220 / 4136	|	YoungForest |	17 | 		1:45:10 | 0:14:52 (1) | 0:33:50(1) |	null | 1:25:10 (2) |

本次比赛质量在上周的基础上继续提高。尤其是corner case，导致我有4次incorrect attempts, 也就是20min的罚时。不过我看leader board上，大家的战况也都差不多，错误尝试很多。
本次比赛的重点在于作出所有的题目。恰好需要4道题，才能进入前200. 因为第三题的思路问题，即使再给我半个小时，我也难以做出来。所以我输的还算心服口服。

## 1033. Moving Stones Until Consecutive

Intuition:
最小移动步数只有3种情况：
0: 3个坐标紧挨，
1: 2个紧挨 或 2个中间空一个
2: x, y y, z之间的间隔都大于1.
最大移动步数一定是 z - x - 2, 此时每次移动都只向中间移一步。

时间复杂度: O(1)
空间复杂度: O(1)

```cpp
class Solution {
public:
    vector<int> numMovesStones(int a, int b, int c) {
        // greedy
        int minimum_moves = 0, maximum_moves;
        int x = min({a, b, c});
        int z = max({a, b, c});
        int y = a + b + c - x - z;

        if (y - x == 1 && z - y == 1)
            minimum_moves = 0;
        else if (y - x == 1 || z - y == 1 || y - x == 2 || z - y == 2)
            minimum_moves = 1;
        else
            minimum_moves = 2;
        maximum_moves = z - y - 1 + y - x - 1;
        return {minimum_moves, maximum_moves};
    }
};
```

## 1034. Coloring A Border

Intuition:
dfs 染色。需要注意如何标注已经访问的节点，在这里我使用了负数来表示。
时间复杂度: O(n*m),
空间复杂度: O(1), in place.

```cpp
class Solution {
    bool border(vector<vector<int>>& grid, int r, int c) {
        vector<int> di = {1, 0, -1, 0};
        vector<int> dj = {0, 1, 0, -1};
        for (int k = 0; k < 4; ++k) {
            int ni = r + di[k];
            int nj = c + dj[k];
            if (ni < 0 || ni >= grid.size() || nj < 0 || nj >= grid[0].size() || abs(grid[ni][nj]) != abs(grid[r][c]))
                return true;
        }
        return false;
    }
    void dfs(vector<vector<int>> &grid, int r, int c) {
        grid[r][c] = -grid[r][c];
        vector<int> di = {1, 0, -1, 0};
        vector<int> dj = {0, 1, 0, -1};
        for (int k = 0; k < 4; ++k) {
            int ni = r + di[k];
            int nj = c + dj[k];
            if (ni >= 0 && ni < grid.size() && nj >= 0 && nj < grid[0].size() && grid[ni][nj] == abs(grid[r][c]))
                dfs(grid, ni, nj);
        }
        if (!border(grid, r, c))
            grid[r][c] = -grid[r][c];
    }
public:
    vector<vector<int>> colorBorder(vector<vector<int>>& grid, int r0, int c0, int color) {
        // dfs
        if (grid[r0][c0] == color) return grid;
        int origin_color = grid[r0][c0];
        dfs(grid, r0, c0);
        for (auto& r : grid) {
            for (auto & item : r) {
                if (item < 0)
                    item = color;
            }
        }
        return grid;
    }
};
```

## 1035. Uncrossed Lines

Intuition:
第一直觉是将题目转化成 二分图求最大独立集的问题。把所有的连线当作node，连线相交表示node之间的edge。在网上找了些求解二分图的算法，但都不简单，短时间内无法写出来。遂放弃了该题目，先把第四题做出来了。实际上，先去做第四题的策略是对的。事实证明，本题我的思路是走偏了。应该转化成LCS(largest common subsequence), 用dp解决。而且第四题分数更高，所以此次比赛排名反而考前。

LCS的dp实现起来也很简单。
时间复杂度: O(N*M).
空间复杂度: O(N*M).

```cpp
class Solution {
public:
    int maxUncrossedLines(vector<int>& A, vector<int>& B) {
        const int m = A.size(), n = B.size();
        vector<vector<int>> dp(m + 1, vector<int> (n + 1, 0));
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (A[i - 1] == B[j - 1]) {
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);                    
                }
            }
        }
        return dp[m][n];
    }
};
```

空间复杂度可以优化到N, 因为dp的子问题只用到了上一行和本行的解。

```cpp
class Solution {
public:
    int maxUncrossedLines(vector<int>& A, vector<int>& B) {
        const int m = A.size(), n = B.size();
        vector<int> dp(n + 1, 0);
        for (int i = 1; i <= m; ++i) {
            for (int j = n; j >= 1; --j) {
                if (A[i - 1] == B[j - 1]) {
                    dp[j] = 1 + dp[j - 1];
                }
            }
            for (int j = 1; j <= n; ++j) {
                dp[j] = max(dp[j], dp[j - 1]);
            }
        }
        return dp[n];
    }
};
```

## 1036. Escape a Large Maze

Intuition:
dfs: O(n ^ 2) 10 ^ 12 TLE.
blocked.length 很小, 可以尝试从此做文章
blocked把整个区域可以划分为几个region，判断source和target是否同region即可.
由于blocked.length <= 200, 可以算出最大的搜索空间为19900，当blocked cell与边界组成一个等腰直角三角形时。
不过`bound = 10000`时，dfs就stack overflow了。5000时，可以通过所有的测试点。
更好的实现是，使用迭代而不是递归，用栈实现dfs，或用队实现bfs都是不错的选择。

时间复杂度: O(blocked.length ^ 2).
空间复杂度: O(blocked.length ^ 2).

```cpp
class Solution {
    const int bound = 5000;
    const int border = 1e6;
    int source_step = 0;
    set<pair<int, int>> source_seen, target_seen, block_set;
    bool find = false;
    int target_step = 0;
    void dfs(set<pair<int, int>>& seen, int& step, vector<int>& target, int i, int j) {
        seen.insert({i, j});
        ++step;
        if (i == target[0] && j == target[1]) {
            find = true;
            return;
        }
        if (step > bound || find == true)
            return;
        vector<int> di = {1, 0, -1, 0};
        vector<int> dj = {0, 1, 0, -1};
        for (int k = 0; k < 4; ++k) {
            int ni = i + di[k];
            int nj = j + dj[k];
            if (ni >= 0 && ni < border && nj >= 0 && nj < border && seen.find({ni, nj}) == seen.end() && block_set.find({ni, nj}) == block_set.end()) {
                dfs(seen, step, target, ni, nj);
                if (step > bound || find == true)
                    return;
            }
        }
        if (step > bound || find == true)
            return;
    }
public:
    bool isEscapePossible(vector<vector<int>>& blocked, vector<int>& source, vector<int>& target) {
        for (const auto & cell : blocked) {
            block_set.insert({cell[0], cell[1]});
        }
        find = false;
        dfs(source_seen, source_step, target, source[0], source[1]);
        if (find) return true;
        find = false;
        dfs(target_seen, target_step, source, target[0], target[1]);
        if (find) return true;
        if (target_step > bound && source_step > bound)
            return true;
        return false;
    }
};
```