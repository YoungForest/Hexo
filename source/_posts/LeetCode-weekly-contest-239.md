---
title: LeetCode weekly contest 239
date: 2021-05-02 11:47:52
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 78 / 10870 | YoungForest | 18 | 0:52:57 | 0:02:22 | 0:09:37 | 0:27:13 | 0:47:57  1 |

连续3周免打卡了，昨晚双周赛也做的不错手速场。
最近的周赛确实难度有所降低，看来我还是适合做简单题目。Hard+还是不大行。

<!-- more -->

## 1848. Minimum Distance to the Target Element

签到题。
One pass，记录最优答案。

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
public:
    int getMinDistance(vector<int>& nums, int target, int start) {
        int ans = -INF;
        for (int i = 0; i < nums.size(); ++i) {
            if (nums[i] == target) {
                if (abs(i - start) < abs(ans - start)) {
                    ans = i;
                }
            }
        }
        return abs(ans - start);
    }
};
```

## 1849. Splitting a String Into Descending Consecutive Values

Backtracking, 搜索可能的分割点。

```python
class Solution:
    def splitString(self, s: str) -> bool:
        n = len(s)
        if n <= 1: return False
        @cache
        def dfs(i: int, last: int) -> bool:
            if i >= n: return False
            if i != 0:
                final = int(s[i:])
                if final < last and last - final == 1:
                    return True
            for j in range(i + 1, n):
                new = int(s[i:j])
                if new < last and (i == 0 or last - new == 1):
                    if dfs(j, new): return True
            return False
        return dfs(0, float('inf'))
```

时间复杂度: O(N^2),
空间复杂度: O(N).

虽然我们使用了backtracking，看起来好想时间复杂度很高，O(N ^ N), 但其实在`dfs`中的`for`循环中，符合条件可以`dfs`到下一层的可能路径只有1条。
参考[这个题解的分析](https://leetcode.com/problems/splitting-a-string-into-descending-consecutive-values/discuss/1186795/C%2B%2B-Backtracking-solution.-O(N-2)-and-time-complexity-analytics).

## 1850. Minimum Adjacent Swaps to Reach the Kth Smallest Number

首先，我们需要复习一下[LC 31. Next Permutation](https://leetcode.com/problems/next-permutation/). 学习一下求解下一个枚举排列的方法。幸运的是，C++ STL 里已经提供了`std::next_permutation`函数可以直接用，均摊时间复杂度为**O(1)**.
使用`k`次`next_permutation`找到the Kth Smallest Number
后，只需要采用贪心的思路就可以找到最小交换次数。
即发现一个不相等的位置，就在后面找到一个最近的相等的数，通过交换挪的当前位置。

```cpp
class Solution {
public:
    int getMinSwaps(string num, int k) {
        auto s = num;
        while(std::next_permutation(s.begin(), s.end()) && k - 1 > 0) {
            // std::cout << s << '\n';
            --k;
        }
        const int n = num.size();
        int ans = 0;
        for (int j = 0; j < n; ++j) {
            if (num[j] == s[j]) continue;
            // find next digit and swap it here
            int i = j + 1;
            for (; i < n and num[i] != s[j]; ++i);
            // cout << i << " " << j << endl;
            ans += i - j;
            for (int x = i; x > j; --x) {
                swap(num[x], num[x - 1]);
            }
        }
        return ans;
    }
};
```

时间复杂度: O(k + n^2),
空间复杂度: O(n).

## 1851. Minimum Interval to Include Each Query

本题和[昨晚双周赛的最后一题](https://youngforest.github.io/2021/05/02/LeetCode-biweekly-contest-51/#1847-Closest-Room)有些像，需要用到离线计算的技术。
intervals按照size从小到大排序，没新增一个interval，更新可以覆盖到的query的答案。
这里需要用`multimap`维护待解决的`queries`。因为支持二分查找和删除，以及重复的query.

```cpp
class Solution {
public:
    vector<int> minInterval(vector<vector<int>>& intervals, vector<int>& queries) {
        // brute-foce: queries.length * intervals.length
        // smarter: queries.length * log + intervals.length * log
        const int n = intervals.size(), m = queries.size();
        // sort interval by size less<>, find new queries
        vector<int> ans(m, -1);
        multimap<int, int> indexQueries;
        for (int i = 0; i < m; ++i) {
            indexQueries.insert({queries[i], i});
        }
        sort(intervals.begin(), intervals.end(), [](const auto& lhs, const auto& rhs) -> bool {
            return lhs[1] - lhs[0] < rhs[1] - rhs[0];
        });
        int size = 0;
        for (const auto& v : intervals) {
            size = v[1] - v[0] + 1;
            auto left = indexQueries.lower_bound(v[0]);
            auto right = indexQueries.upper_bound(v[1]);
            for (auto it = left; it != right; ++it) {
                ans[it->second] = size;
            }
            for (auto it = left; it != right;) {
                auto nit = next(it);
                indexQueries.erase(it);
                it = nit;
            }
        }
        return ans;
    }
};
```

n = intervals.length, m = queries.length
时间复杂度: O(n log n + m log m + n log m),
空间复杂度: O(m).