---
title: LeetCode weekly contest 153
date: 2019-09-15 20:31:56
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 392 / 6212 |	YoungForest | 	12	 | 	0:41:42 | 0:06:46  1 | 0:16:11 | 0:36:42 | null |

本次比赛是我在国内的最后一场了。由于比利时这边时差的原因，每周的周赛是周日的早上4点半到6点。所以我并没有条件参加，只能每周日早上起来补题了。

## 1184. Distance Between Bus Stops

Two pass。正着走一遍，总共走一遍，然后总的路程减去正的路程就是反的路程。
这里要注意start必须在destination之前，否则要换一下位置。

```cpp
class Solution {
public:
    int distanceBetweenBusStops(vector<int>& distance, int start, int destination) {
        int total = accumulate(distance.begin(), distance.end(), 0);
        if (start > destination)
            swap(start, destination);
        int clockwise = accumulate(distance.begin() + start, distance.begin() + destination, 0);
        int counterclockwise = total - clockwise;
        return min(clockwise, counterclockwise);
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1185. Day of the Week

经典的日历问题。需要注意的点是 闰年 的处理。

时间复杂度: O(year * month),
空间复杂度: O(1).

```cpp
class Solution {
    bool isLeap(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }
public:
    string dayOfTheWeek(int day, int month, int year) {
        vector<string> v = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
        vector<int> monthes = {0, 31, 28, 31, 30, 31,30, 31, 31, 30,31,30,31};
        int count = 4;
        for (int i = 1971; i < year; ++i) {
            if (isLeap(i)) {
                count += 366;
            } else {
                count += 365;
            }
        }
        if (isLeap(year)) {
            monthes[2] += 1;
        }
        count += accumulate(monthes.begin(), monthes.begin() + month, 0);
        count += day;
        count %= 7;
        return v[count];
    }
};
```

## 1186. Maximum Subarray Sum with One Deletion

动态规划。
第i位的结果可以由第i - 1位的结果获得。
因为最多删除一个，所以DP需要维护2个最小值，一个是删了一个的，另一个是每删的。另外需要维护可以删除的最小值。

```cpp
class Solution {
public:
    int maximumSum(vector<int>& arr) {
        const int n = arr.size();
        vector<int> dp_delete(n + 1, 0), dp_nodelete(n + 1, 0), dp_which_min(n + 1, 0);
        int ret = arr[0];
        for (int i = 1; i < n + 1; ++i) {
            if (dp_nodelete[i - 1] + arr[i - 1] >= arr[i - 1]) {
                dp_which_min[i] = min(dp_which_min[i - 1], arr[i - 1]);
            } else {
                dp_which_min[i] = arr[i - 1];
            }
            dp_nodelete[i] = max(dp_nodelete[i - 1] + arr[i - 1], arr[i - 1]);
            dp_delete[i] = max(dp_delete[i - 1] + arr[i - 1], dp_nodelete[i - 1] + arr[i - 1] - dp_which_min[i - 1]);
            ret = max({ret, dp_nodelete[i], dp_delete[i]});
        }
        return ret;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N). 可以优化为 O(1).

## 1187. Make Array Strictly Increasing

比较暴力的方法，DFS + memorization.
每次向下一位搜索时有替换和不替换2种选择，配合剪枝和memorization加速。
可以发现，最坏情况下搜索的空间只是n * m而已，因为memo。

时间复杂度: O(n * m * log m)，
空间复杂度: O(n * m)

```cpp
class Solution {
    const int FAIL = 3000;
    unordered_map<int, unordered_map<int, int>> memo;
    int dfs(vector<int>& arr1, vector<int>& arr2, int i, int prev) {
        if (i == arr1.size()) {
            return 0;
        }
        if (memo.find(i) != memo.end() && memo[i].find(prev) != memo[i].end()) {
            return memo[i][prev];
        }
        // pickarr2
        auto it = upper_bound(arr2.begin(), arr2.end(), prev);
        if (arr1[i] > prev) {
            if (it != arr2.end() && *it < arr1[i])
                return memo[i][prev] = min(dfs(arr1, arr2, i + 1, arr1[i]), dfs(arr1, arr2, i + 1, *it) + 1);
            else
                return memo[i][prev] = dfs(arr1, arr2, i + 1, arr1[i]);
        } else {
            if (it == arr2.end()) {
                return memo[i][prev] = FAIL;
            } else {
                return memo[i][prev] = dfs(arr1, arr2, i + 1, *it) + 1;
            }
        }
    }
public:
    int makeArrayIncreasing(vector<int>& arr1, vector<int>& arr2) {
        sort(arr2.begin(), arr2.end());
        auto ans = dfs(arr1, arr2, 0, -1);
        if (ans >= FAIL) {
            return -1;
        } else {
            return ans;
        }
    }
};
```