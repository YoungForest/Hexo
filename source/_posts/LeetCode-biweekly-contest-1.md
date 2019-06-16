---
title: LeetCode biweekly contest 1
date: 2019-06-03 20:03:05
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 241 / 983 |	YoungForest | 7 | 	0:18:23 | 0:09:56 | 0:18:23 | null  | null |

LeetCode开放了首届的双周赛，每周六晚上10:30~12:30。目的可能是方便欧洲的同学参赛（平时的单周赛欧洲那边都是凌晨），可以出更难的题目。因为时长扩展到2个小时了。

由于19:00~21:30已经参加了Byte dance 的summer camp笔试。该笔试题也很难，3道编程题只有第二题过了30%。所以稍后的biweekly contest也翻车了，完成的 并不理想。只作出了2道Easy的题目。

## 1055. Fixed Point
Intuition:
Straight forward. One pass.

时间复杂度: `O(N)`
空间复杂度: `O(1)`

```cpp
class Solution {
public:
    int fixedPoint(vector<int>& A) {
        for (int i = 0; i < A.size(); ++i) {
            if (A[i] == i) {
                return i;
            }
        }
        return -1;
    }
};
```

由于数组A是升序的，所以还可以用 二分搜索 的算法，实现`O(log N)`.

```cpp
class Solution {
public:
    int fixedPoint(vector<int>& A) {
        int lo = 0, hi = A.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (A[mid] < mid) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        
        return A[lo] == lo ? lo : -1;
    }
};
```

## 1056. Index Pairs of a String

Intuition:
题目为Easy，数据规模也比较小，考虑暴力解法即可。
时间复杂度: O(words.size() * text.size() * words[i].size()),
空间复杂度: O(words.size() * text.size()).

```cpp
class Solution {
public:
    vector<vector<int>> indexPairs(string text, vector<string>& words) {
        vector<vector<int>> ret;
        for (const string& word : words) {
            int pos = 0;
            while ((pos = text.find(word, pos)) != string::npos) {
                ret.push_back({pos, pos + word.size() - 1});
                pos += 1;
            }
        }
        sort(ret.begin(), ret.end(), [](const vector<int>& lhs, const vector<int>& rhs) -> bool {
            if (lhs[0] != rhs[0])
                return lhs[0] < rhs[0];
            return lhs[1] < rhs[1];
        });
        return ret;
    }
};
```

## 1066. Campus Bikes II

由于数据规模很小，1 <= workers.length <= bikes.length <= 10，考虑暴力的backtracking。
时间复杂度: O(workers.length ^ bikes.length).
空间复杂度: O(bikes.length).

无奈超时了。

```cpp
class Solution {
    // 因为1 <= workers.length <= bikes.length <= 10，
    // 考虑阶乘算法 + 剪枝
    int global_minimum = numeric_limits<int>::max();
    void backtracking(const vector<vector<int>>& workers, const vector<vector<int>>& bikes, vector<bool>& visited, int local_distance, int step) {
        if (step == workers.size()) {
            global_minimum = min(global_minimum, local_distance);
            return;
        }
        if (local_distance >= global_minimum)
            return;
        for (int i = 0; i < visited.size(); ++i) {
            if (visited[i])
                continue;
            visited[i] = true;
            backtracking(workers, bikes, visited, local_distance + abs(workers[step][0] - bikes[i][0]) + abs(workers[step][1] - bikes[i][1]), step + 1);
            visited[i] = false;
        }
    }
public:
    int assignBikes(vector<vector<int>>& workers, vector<vector<int>>& bikes) {
        vector<bool> visited(bikes.size(), false);
        backtracking(workers, bikes, visited, 0, 0);
        return global_minimum;
    }
};
```

看了Discuss, 共有2种解法。优先队列 或 DP。

## 1067. Digit Count in Range

首先，先解决一个更简单的问题。
[Solution](https://leetcode.com/problems/number-of-digit-one/solution/)
求数字1的个数。

```cpp
int countDigitOne(int n)
{
    int countr = 0;
    for (long long i = 1; i <= n; i *= 10) {
        long long divider = i * 10;
        countr += (n / divider) * i + min(max(n % divider - i + 1, 0LL), i);
    }
    return countr;
}
```

根据以上解法，很容易扩充到任何数字。
需要注意数字`0`因为不能开头，所以需要特殊处理

```cpp
class Solution {
    // include n
    int helper(int d, int n) {
        int ret = 0;
        for (long long i = 1; i <= n; i *= 10) {
            long long divisor = i * 10;
            ret += (n / divisor) * i + min(i, max(0LL, n % divisor - d * i + 1)) - (d == 0 ? i : 0);
            // cout << ret << " ";
        }
        // cout << n << " " << ret << endl;
        return ret;
    }
public:
    int digitsCount(int d, int low, int high) {
        return helper(d, high) - helper(d, low - 1);
    }
};
```

时间复杂度: O(log N)
空间复杂度: O(1)