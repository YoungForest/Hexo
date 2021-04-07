---
title: LeetCode weekly contest 141
date: 2019-06-16 11:44:47
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 234 / 4126 |	YoungForest | 22 | 1:18:45 | 0:25:23  1 | 0:36:29 | 0:51:47 | 1:13:45 |

周一自然辩证法考试，周二矩阵考试，还是强行抽出时间参加contest。本身复习就不充分，平时的学习也没有十分扎实，我也是心大。
200名的时间至少要在1:14:23以内。

## 1089. Duplicate Zeros

Intuition:
因为要求in-place, 一个自然的想法是从后向前更新值。
2次遍历，第一次正向遍历，得到结果数组最后一位的原始坐标。
第二次逆向遍历，更新结果数组。

Time complexity: O(N),
Space complexity: O(1).

```cpp
class Solution {
public:
    void duplicateZeros(vector<int>& arr) {
        int zeros = 0;
        int i = 0;
        for (i = 0; i < arr.size() && i + zeros < arr.size(); ++i) {
            if (arr[i] == 0) {
                ++zeros;
            }
        }
        --i;
        for (int j = arr.size() - 1; j >= 0; --j, --i) {
            arr[j] = arr[i];
            if (arr[i] == 0 && (i + zeros < arr.size())) {
                --j;    // 多减一j
                if (j >= 0)
                    arr[j] = 0;
            }
        }
    }
};
```

因为忽略 最后一个0如果位数不够的话，将不进行扩展。被罚时一次。

测试用例:
```
[0]
[0,0]
[0,0,0]
[0,0,1]
[8,4,5,0,0,0,0,7]
[8,4,5,0,0,0,0,0,7]
```

## 1090. Largest Values From Labels

Intuition：
贪心思路。总是试图加入value最大的item。
具体实现为 先排序，并且用一个hashtable保证不违反 use_limit的限制。

Time complexity: O(N log N),
Space complexity: O(N)

```cpp
class Solution {
public:
    int largestValsFromLabels(vector<int>& values, vector<int>& labels, int num_wanted, int use_limit) {
        vector<pair<int, int>> items;
        for (int i = 0; i < values.size(); ++i) {
            items.push_back({values.at(i), labels.at(i)});
        }
        sort(items.begin(), items.end(), std::greater<pair<int, int>>());
        unordered_map<int, int> used;
        int num = 0;
        int index = 0;
        int ret = 0;
        while (num < num_wanted && index < items.size()) {
            const auto& p = items.at(index);
            if (used[p.second] < use_limit) {
                ++used[p.second];
                ++num;
                ret += p.first;
            }
            ++index;
        }
        return ret;
    }
};
```

测试用例：
```
[5,4,3,2,1]
[1,1,2,2,3]
3
1
[5,4,3,2,1]
[1,3,3,3,2]
3
2
[9,8,8,7,6]
[0,0,0,1,1]
3
1
[9,8,8,7,6]
[0,0,0,1,1]
3
2
```

## 1091. Shortest Path in Binary Matrix

Intuition:
求最短路径，用DFS。

Time complexity: O(N^2),
Space complexity: O(N^2).

```cpp
class Solution {
public:
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        // bfs
        int n = grid.size();
        set<pair<int, int>> visited;
        queue<pair<int, int>> q;
        if (grid[0][0] == 0)
            q.push({0, 0});
        int level = 1;
        while (!q.empty()) {
            int s = q.size();
            for (int i = 0; i < s; ++i) {
                auto current = q.front();
                q.pop();
                if (current.first == n - 1 && current.second == n - 1) {
                    return level;
                }
                for (auto di : {-1, 0, 1}) {
                    for (auto dj : {-1, 0, 1}) {
                        int ni = current.first + di, nj = current.second + dj;
                        if (ni == current.first && nj == current.second)
                            continue;
                        if (visited.find({ni, nj}) != visited.end())
                            continue;
                        if (ni < 0 || ni >= n || nj < 0 || nj >= n)
                            continue;
                        if (grid[ni][nj] == 1)
                            continue;
                        visited.insert({ni, nj});
                        q.push({ni, nj});
                    }
                }
            }
            ++level;
        }
        return -1;
    }
};
```

我的测试用例：
```
[[0,1],[1,0]]
[[0,0,0],[1,1,0],[1,1,0]]
[[0,0,0],[0,1,0],[0,1,0]]
[[0,0,0],[0,1,1],[0,1,0]]
[[0]]
[[1]]
[[0,1,0,0,0],[0,1,0,1,0],[0,1,0,1,0],[0,1,0,1,0],[0,0,0,1,0]]
[[0,1,0,0,0],[0,1,0,1,0],[0,1,1,1,0],[0,1,0,1,0],[0,0,0,1,0]]
```

期望结果：
```
2
4
4
-1
1
-1
13
-1
```

## 1092. Shortest Common Supersequence

Intuition:
先求出 最长公共子序列(Longest Common Subsequence).
然后补齐多余的字符。
最长公共子序列的模版很重要，需要快速实现。

Time Complexity: O(str1.size() * str2.size()),
Space Complexity: O(str1.size() * str2.size()).

```cpp
class Solution {
    enum class Direction {
        left,
        up,
        left_up
    };
public:
    string shortestCommonSupersequence(string str1, string str2) {
        vector<vector<pair<int, Direction>>> v(str1.size() + 1, vector<pair<int, Direction>>(str2.size() + 1));
        v[0][0] = {0, Direction::left_up};
        for (int i = 1; i < str1.size() + 1; ++i) {
            v[i][0] = {0, Direction::up};
        }
        for (int i = 1; i < str2.size() + 1; ++i) {
            v[0][i] = {0, Direction::left};
        }
        for (int i = 1; i < str1.size() + 1; ++i) {
            for (int j = 1; j < str2.size() + 1; ++j) {
                if (str1.at(i - 1) == str2.at(j - 1)) {
                    v[i][j] = {v[i-1][j-1].first + 1, Direction::left_up};
                } else if (v[i][j-1].first > v[i-1][j].first) {
                    v[i][j] = {v[i][j-1].first, Direction::left};
                } else {
                    v[i][j] = {v[i-1][j].first, Direction::up};
                }
            }
        }
        string ret;
        int i = str1.size(), j = str2.size();
        while (i > 0 || j > 0) {
            switch (v[i][j].second) {
                case Direction::left_up:
                    ret.push_back(str1.at(i - 1));
                    --i;
                    --j;
                    break;
                case Direction::up:
                    ret.push_back(str1.at(i - 1));
                    --i;
                    break;
                case Direction::left:
                    ret.push_back(str2.at(j - 1));
                    --j;
                    break;
            }
        }
        reverse(ret.begin(), ret.end());
        return ret;
    }
};
```

我的测试用例：
```
"abac"
"cab"
"geek"
"eke"
"AGGTAB"
"GXTXAYB"
```

期望结果：
```
"cabac"
"gekek"
"AGXGTXAYB"
```