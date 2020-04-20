---
title: LeetCode biweekly contest 23
date: 2020-04-07 13:08:11
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 199 / 7026 |	YoungForest | 19 | 	0:40:57 |  0:08:05 |  0:11:44 | 0:33:38 |   0:40:57 |

不难，手速场。发现很多手速场的比赛，第三题甚至都比第四题更难。

## 1399. Count Largest Group

straight forward. 用一个hashmap统计digit_sum -> count, 最后再找出count最大的几组。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int countLargestGroup(int n) {
        unordered_map<int, int> seen;
        int largestSize = 0;
        for (int i = 1; i <= n; ++i)  {
            int sumOfDigit = 0;
            int current = i;
            while (current > 0) {
                sumOfDigit += current % 10;
                current /= 10;
            } 
            ++seen[sumOfDigit];
            largestSize = max(largestSize, seen[sumOfDigit]);
        }
        int ans = 0;
        for (auto it = seen.begin(); it != seen.end(); ++it) {
            if (it->second == largestSize)
                ++ans;
        }
        return ans;
    }
};
```

## 1400. Construct K Palindrome Strings

统计出现的奇数字符数目，必需小于等于k。并且因为要求回文串非空，所以需要`s.size() >= k`。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    bool canConstruct(string s, int k) {
        if (s.size() < k) return false;
        vector<int> count(26, 0);
        for (char c : s) {
            ++count[c - 'a'];
        }
        int single = 0;
        for (int i : count) {
            if (i % 2 == 1)
                ++single;
        }
        return single <= k;
    }
};
```

## 1401. Circle and Rectangle Overlapping

可以根据正方形的四条边，将空间分为9个部分，把圆的圆心的位置分为9种情况。每种情况是否和正方形overlap就很好判断了。

时间复杂度: O(1),
空间复杂度: O(1).

```cpp
class Solution {
    int distance(int x1, int y1, int x2, int y2) {
        return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 -y1);
    }
public:
    bool checkOverlap(int radius, int x_center, int y_center, int x1, int y1, int x2, int y2) {
        auto closeEnough = [&](int x, int y) -> bool {
            return radius * radius >= distance(x_center, y_center, x, y);
        };
        auto inSquare = [&]() -> bool {
            return x_center <= x2 && x_center >= x1 && y_center <= y2 && y_center >= y1;
        };
        return closeEnough(x1, y1) || closeEnough(x1, y2) || closeEnough(x2, y2) || closeEnough(x2, y1) ||
            inSquare() || 
            (x_center <= x2 && x_center >= x1 && (y_center <= y2 + radius && y_center >= y1 - radius)) ||
            (y_center <= y2 && y_center >= y1 && (x_center <= x2 + radius && x_center >= x1 - radius)); 
    }
};
```

讨论区中还有一种实现起来[更简单的方法](https://leetcode.com/problems/circle-and-rectangle-overlapping/discuss/563441/JAVA-compare-distance-between-radius-and-closest-point-on-rectangle-to-circle)，可以快速找到长方形中离一个点（圆心）最近的点。

## 1402. Reducing Dishes

贪心。先排序, 先取satisfaction最大的dish，直到后缀和小于0.

时间复杂度: O(N log N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int maxSatisfaction(vector<int>& satisfaction) {
        const int n = satisfaction.size();
        sort(satisfaction.begin(), satisfaction.end());
        int currentSum = 0;
        int suffixSum = 0;
        for (int i = n - 1; i >= 0; --i) {
            suffixSum += satisfaction[i];
            if (suffixSum >= 0) {
                currentSum += suffixSum; 
            } else {
                return currentSum;
            }
        }
        return currentSum;
    }
};
```

第一次提交用的N^2的解法，排序后枚举起点，竟然都过了。