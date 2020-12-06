---
title: LeetCode weekly contest 217
date: 2020-11-29 20:28:52
tags:
- LeetCode
categories:
- Programming
---


| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (6) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 356 / 9462 | YoungForest | 13 | 	1:24:07 |  0:03:55	 | 0:20:14 |  1:09:07  3 | null |


## 1672. Richest Customer Wealth

签到题。数组求和, C++ accumulate 一行搞定。

```cpp
class Solution {
public:
    int maximumWealth(vector<vector<int>>& accounts) {
        int ans = 0;
        for (const auto & v : accounts) {
            ans = max(ans, accumulate(v.begin(), v.end(), 0));
        }
        return ans;
    }
};
```

## 1673. Find the Most Competitive Subsequence

类似 [402. Remove K Digits](https://leetcode-cn.com/problems/remove-k-digits/)，采用贪心的思路，尽量删除大的数。标准做法是使用单调栈。

比赛时我采用的是 优先队列维护要删除的最大数。

```cpp
class Solution {
public:
    vector<int> mostCompetitive(vector<int>& nums, int k) {
        using pii = pair<int, int>;
        auto cmp = [](pii a, pii b) -> bool {
            if (a.first != b.first) {
                return a.first > b.first;
            } else {
                return a.second > b.second;
            }
        };
        priority_queue<pii, vector<pii>, decltype(cmp)> m(cmp);
        
        for (int i = 0; i + k - 1 < nums.size(); ++i) {
            m.push({nums[i], i});
        }
        int begin = 0;
        vector<int> ans;
        while (k > 0) {
            auto p = m.top();
            m.pop();
            while (p.second < begin && !m.empty()) {
                p = m.top();
                m.pop();
            }
            begin = p.second;
            ans.push_back(p.first);
            --k;
            if (k == 0) break;
            m.push({nums[nums.size() - k], nums.size() - k});
        }
        return ans;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(N).


## 1674. Minimum Moves to Make Array Complementary

我在注释中记录了我比赛时的思路。最后灵感乍现，确定每组数一次变化的范围，然后枚举每个可能的目标数，可以快速O(log N)计算出需要的变数。


```cpp
class Solution {
    static const int MAX = 1e5 + 5;
    int open[MAX], close[MAX], dot[MAX];
public:
    int minMoves(vector<int>& nums, int limit) {
        // 统计和的最大众数，变其他。但是有的需要大于limit (x)
        // 二分，快速求判定问题？
        // 暴力，枚举互补数，遍历一遍再。O(n * n)
        // a + b = 互补数，0
        // a + b 变 互补数： 1， 2
        // 0次变 是一个数
        // 一次变最大，一次变最小 是一个范围
        // 出了范围就需要2次变
        // 确定互补数，可以遍历一遍确定变数
        // 确定变数呢？
        // ｜  .  ｜
        // open - close: in range
        // close + total - open: out range
        // dtop: 0
        const int n = nums.size();
        for (int i = 0; i < n - 1 - i; ++i) {
            int a = nums[i];
            int b = nums[n - 1 - i];
            if (a > b) swap(a, b);
            // a <= b
            int lower = a + 1;
            int upper = b + limit;
            dot[i] = a + b;
            open[i] = lower;
            close[i] = upper;
        }
        const int size = n / 2;
        auto openEnd = begin(open) + size;
        auto closeEnd = begin(close) + size;
        auto dotEnd = begin(dot) + size;
        sort(begin(open), openEnd);
        sort(begin(close), closeEnd);
        sort(begin(dot), dotEnd);
        
        auto need = [&](const int line) -> int {
            auto itOpen = upper_bound(begin(open), openEnd, line);
            auto itClose = lower_bound(begin(close), closeEnd, line);
            auto itDot = lower_bound(begin(dot), dotEnd, line);
            auto itDot2 = upper_bound(itDot, dotEnd, line);
            int dotNumber = distance(itDot, itDot2);
            int outRange = 0;
            outRange += distance(begin(close), itClose);
            outRange += distance(itOpen, openEnd);
            int inRange = n / 2 - dotNumber - outRange;
            return inRange + 2 * outRange;
        };
        int ans = n;
        for (int line = 2; line <= limit * 2; ++line) {
            const int condidate = need(line);
            // cout << line << ": " << condidate << endl;
            ans = min(ans, condidate);
        }
        return ans;
    }
};
```

时间复杂度: O(limit * log N),
空间复杂度: O(N).

在比赛时，C++ 被卡常数了。需要讲数组改成全局数组才能AC。
我本身平时更习惯使用局部vector，可读性和可维护性都更高。

使用差分数组可以避免二分搜索，具体见[零神的题解](https://leetcode-cn.com/problems/minimum-moves-to-make-array-complementary/solution/shi-shu-zu-hu-bu-de-zui-shao-cao-zuo-ci-shu-by-zer/). 我也是头一次接触差分数组这一概念。

## 1675. Minimize Deviation in Array

基于2个操作，可以将问题很轻松地转为LC之前地一个题：
[632. Smallest Range Covering Elements from K Lists](https://leetcode-cn.com/problems/smallest-range-covering-elements-from-k-lists/)。
然后使用优先队列或Tree解决。

```cpp
class Solution {
public:
    int minimumDeviation(vector<int>& nums) {
        multiset<int> ms;
        for (int i : nums) {
            if (i % 2 == 0) ms.insert(i);
            else ms.insert(i * 2);
        }
        int ret = numeric_limits<int>::max();
        while (true) {
            ret = min(ret, *ms.rbegin() - *ms.begin());
            const int maxValue = *ms.rbegin();
            ms.erase(prev(ms.end()));
            if (maxValue % 2 != 0) break;
            ms.insert(maxValue / 2);
        }
        return ret;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(N).
