---
title: LeetCode weekly contest 211
date: 2020-10-26 16:47:43
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 103 / 10984 | YoungForest | 19 | 1:19:51 | 0:06:36 | 0:12:02 | 0:39:44 2 | 1:09:51 |

本周周赛继续高歌猛进，排名也很靠前。加上上周的名次，我在残酷群里的排名也上升到了新高，第11名。

## 1629. Slowest Key

一次遍历。使用一个变量维护上次按键的时刻。

```cpp
class Solution {
public:
    char slowestKey(vector<int>& releaseTimes, string keysPressed) {
        const int n =  releaseTimes.size();
        int last = 0;
        int maxDuration = 0;
        char ans = ' ';
        for (int i = 0; i < n; ++i) {
            const int duration = releaseTimes[i] - last;
            if (duration > maxDuration || (duration == maxDuration && keysPressed[i] > ans)) {
                maxDuration = duration;
                ans = keysPressed[i];
            }
            last = releaseTimes[i];
        }
        return ans;
    }
};
```

空间复杂度: O(1),
时间复杂度: O(n).

## 1630. Arithmetic Subarrays

对于每个子数组，排序判断是否为等差数列。

```cpp
class Solution {
    bool check(const vector<int>& x) {
        if (x.size() < 2) return false;
        const int diff = x[1] - x[0];
        for (int i = 2; i < x.size(); ++i) {
            if (x[i] - x[i - 1] != diff) return false;
        }
        return true;
    }
public:
    vector<bool> checkArithmeticSubarrays(vector<int>& nums, vector<int>& l, vector<int>& r) {
        // time: m * n * n log n
        const int m = l.size();
        const int n = nums.size();
        vector<bool> ans(m);
        for (int i = 0; i < m; ++i) {
            vector<int> cp;
            cp.reserve(r[i] - l[i] + 1);
            for (int j = l[i]; j <= r[i]; ++j) {
                cp.push_back(nums[j]);
            }
            sort(cp.begin(), cp.end());
            ans[i] = check(cp);
        }
        return ans;
    }
};
```

时间复杂度: O(m * n * n log n),
空间复杂度: O(m).

## 1631. Path With Minimum Effort

BFS。从头开始搜索，用dp进行剪枝。

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
    using pii = pair<int, int>;
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        const int rows = heights.size();
        const int cols = heights[0].size();
        vector<vector<int>> dp(rows, vector<int>(cols, INF));
        dp[0][0] = 0;
        const vector<pii> neighbor = {
            {1, 0},
            {0, 1},
            {-1, 0},
            {0, -1}
        };
        queue<pii> q;
        q.push({0, 0});
        while (!q.empty()) {
            auto [i, j] = q.front();
            q.pop();
            for (auto [di, dj] : neighbor) {
                const int ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && dp[ni][nj] > max(dp[i][j], abs(heights[i][j] - heights[ni][nj]))) {
                    dp[ni][nj] = max(dp[i][j], abs(heights[i][j] - heights[ni][nj]));
                    q.push({ni, nj});
                }
            }
        }
        return dp[rows - 1][cols - 1];
    }
};
```

时间复杂度: O(rows * cols),
空间复杂度: O(rows * cols).

## 1632. Rank Transform of a Matrix

从小到大处理数字，每次处理相同的数字。
相同的数字需要根据行列判断联通（使用并查集），同一联通图中的数字需要取最大的rank，这时才满足answer最小。


```cpp
class Solution {
        struct UF {
        vector<int> parent;
        int count;
        UF(int n) : parent(n), count(n) {
            iota(parent.begin(), parent.end(), 0);
        }
        // A utility function to find the subset of an element i  
        int find(int x)  
        {  
            return x == parent[x] ? x : parent[x] = find(parent[x]);
        }  

        // A utility function to do union of two subsets  
        void unite(int x, int y)  
        {  
            int xset = find(x);  
            int yset = find(y);  
            if(xset != yset) 
            {  
                parent[xset] = yset;
                --count;
            }  
        }    
    };
public:
    vector<vector<int>> matrixRankTransform(vector<vector<int>>& matrix) {
        const int m = matrix.size();
        const int n = matrix[0].size();
        vector<int> rowsRank(m, 0);
        vector<int> colsRank(n, 0);
        vector<vector<int>> ans(m, vector<int>(n, 0));
        using pii = pair<int, int>;
        map<int, vector<pii>> arr;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                arr[matrix[i][j]].emplace_back(i, j);
            }
        }
        for (const auto & p : arr) {
            const auto & v = p.second;
            const int vsize = v.size();
            UF uf(vsize);
            vector<int> rowsIndex(m, -1);
            vector<int> colsIndex(n, -1);
            for (int i = 0; i < vsize; ++i) {
                auto [x, y] = v[i];
                if (rowsIndex[x] == -1 && colsIndex[y] == -1) {
                    rowsIndex[x] = i;
                    colsIndex[y] = i;
                } else if (rowsIndex[x] == -1) {
                    rowsIndex[x] = i;
                    uf.unite(i, colsIndex[y]);
                } else if (colsIndex[y] == -1) {
                    colsIndex[y] = i;
                    uf.unite(i, rowsIndex[x]);
                } else {
                    uf.unite(i, rowsIndex[x]);
                    uf.unite(i, colsIndex[y]);
                }
            }
            unordered_map<int, vector<int>> cluster;
            for (int i = 0; i < vsize; ++i) {
                cluster[uf.find(i)].push_back(i);
            }
            for (const auto& p : cluster) {
                const auto& vec = p.second;
                int maxRank = numeric_limits<int>::min();
                for (int i : vec) {
                    maxRank = max(rowsRank[v[i].first] + 1, maxRank);
                    maxRank = max(colsRank[v[i].second] + 1, maxRank);
                }
                for (int i : vec) {
                    rowsRank[v[i].first] = maxRank;
                    colsRank[v[i].second] = maxRank;
                    ans[v[i].first][v[i].second] = maxRank;
                }
            }
        }
       
        return ans;
    }
};
```

时间复杂度: O(m * n * log mn),
空间复杂度: O(m * n).