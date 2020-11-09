---
title: LeetCode biweekly contest 37
date: 2020-10-18 09:54:27
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 893 / 8250 | YoungForest | 7 | 0:27:31 | 0:11:24 | 0:27:31 |  null | null |

连续2次双周赛遭遇滑铁卢了。
第3题在赛后2分钟通过了，本来是在能力范围内的题目，但最后心太急了。本来晚上状态就不好，反而是比赛结束后，就写出来了。

## 1619. Mean of Array After Removing Some Elements

签到题。先排序，后求和，在求平均。
这里需要注意题目中限制了`arr.size() % 20 == 0`.


```cpp
class Solution {
public:
    double trimMean(vector<int>& arr) {
        sort(arr.begin(), arr.end());
        const int n = arr.size();
        const int x = n / 20;
        double s = 0.0;
        for (int i = 0; i < n; ++i) {
            if (i < x || (n - 1 - i) < x) continue;
            s += arr[i];
        }
        return s / (n - 2 * x);
    }
};
```
时间复杂度: O(N log N),
空间复杂度: O(1).

## 1620. Coordinate With Maximum Network Quality

由于数据范围比较小，只有50，直接暴力。遍历每一个位置，遍历每个塔求它的信号。

```cpp
class Solution {
public:
    vector<int> bestCoordinate(vector<vector<int>>& towers, int radius) {
        // 50 * 50 * 50
        const double r = radius;
        int maxSignal = 0;
        int maxI = 0;
        int maxJ = 0;
        auto distance = [&](const int a1, const int b1, const int a2, const int b2) -> double {
            return  sqrt((a1 - a2) * (a1 - a2) + (b1 - b2) * (b1 - b2));
        };
        auto getSignal = [&](const int i, const int j) -> int {
            int ans = 0;
            for (const auto& t : towers) {
                double d = distance(t[0], t[1], i, j);
                if (d > r) continue;
                ans += static_cast<int>(floor(t[2] / (1 + d)));
            }
            return ans;
        };
        for (int i = 0; i <= 50; ++i) {
            for (int j = 0; j <= 50; ++j) {
                const int signal = getSignal(i, j);
                // cout << i << " " << j << " " << signal << endl;
                if (signal > maxSignal) {
                    maxI = i;
                    maxJ = j;
                    maxSignal = signal;
                }
            }
        }
        return {maxI, maxJ};
    }
};
```

时间复杂度: O(rows * cols * towers),
空间复杂度: O(1).

## 1621. Number of Sets of K Non-Overlapping Line Segments

动态规划。虽然一下子就看出是DP了，但还是走了弯路。一开始写了`O(n^2 * k)`的算法，没有充分利用子问题。
其实需要多设置一个变量表示开始是否必须是一个segment就好写了。

```cpp
class Solution:
    def numberOfSets(self, m: int, kk: int) -> int:
        MOD = int(10**9 + 7)
        @lru_cache(None)
        def dp(n, k, first):
            if n < k:
                return 0
            if n == k:
                return 1
            if k == 1:
                return ((n + 1) * n) // 2
            if first:
                return (dp(n - 1, k, True) + dp(n - 1, k - 1, False)) % MOD;
            else:
                return (dp(n - 1, k, False) + dp(n, k, True)) % MOD
        return dp(m - 1, kk, False)
```

时间复杂度: O(n * k),
空间复杂度: O(n * k).

## 1622. Fancy Sequence

本题已经超出我的能力范围了，完全没有思路。
学习了一遍评论区，大约有2中算法：
- [乘法逆元](https://leetcode-cn.com/problems/fancy-sequence/solution/qi-miao-xu-lie-by-zerotrac2/)
- [懒惰线段树](https://leetcode-cn.com/problems/fancy-sequence/solution/ru-guo-bu-liao-jie-cheng-fa-ni-yuan-jiu-hao-hao-xu/)
