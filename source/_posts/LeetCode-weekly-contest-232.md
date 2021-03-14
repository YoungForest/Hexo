---
title: LeetCode-weekly-contest-232
date: 2021-03-14 15:36:47
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 807 / 12541 | YoungForest | 17 | 	1:06:39 |  0:03:24 | 0:06:02 | 0:38:44 | 1:01:39  1 |

昨天出去修Mac，因为屏幕一直闪。果然卖Apple的产品Apple Care是必须的。上次修了键盘，这次修屏幕，4个面都换新的了。在外面跑了一天，特别累。今早起来晚，一起来就开始比赛了，一口水一口饭都没吃。
继连续2周3题后，终于4题了。一开始我还挺得意，觉得这周应该不用打卡了。后来发现小丑竟然是我自己。其他选手竟然认为本场是手速场。我T3 T4想复杂了，速度慢了些，没进前500. 残酷名次也从10+退到了40+。下周rating要掉了。没想到3题涨分，4题掉分。

<!-- more -->

## 1790. Check if One String Swap Can Make Strings Equal

签到题。完全相等特殊判断，枚举所有的交换看是否可行。

```cpp
class Solution {
public:
    bool areAlmostEqual(string s1, string s2) {
        if (s1 == s2) return true;
        for (int i = 0; i < s1.size(); ++i) {
            for (int j = i + 1; j < s1.size(); ++j) {
                swap(s1[i], s1[j]);
                if (s1 == s2) return true;
                swap(s1[i], s1[j]);
            }
        }
        return false;
    }
};
```

时间复杂度: O(N^2),
空间复杂度: O(1).

当然，本题也有O(N)的做法。比如，可以找到2个字符串不一样的2个位置，再交换。
由于题目数据范围较小，比赛时重点比拼手速，所以我选择了复杂度更高，但想起来和写起来更简单的解法。

## 1791. Find Center of Star Graph

计算所有节点的度。度为`n-1`的节电即为中心节点。

```cpp
class Solution {
public:
    int findCenter(vector<vector<int>>& edges) {
        const int n = edges.size() + 1;
        vector<int> degree(n + 1, 0);
        for (const auto& e : edges) {
            ++degree[e[0]];
            ++degree[e[1]];
        }
        for (int i = 0; i <= n; ++i) {
            if (degree[i] == n - 1) {
                return i;
            }
        }
        return -1;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

当然，本题也有时间和空间复杂度 O(1)的解法。比如，前2个边的共同节点即为中心节点。

## 1792. Maximum Average Pass Ratio

贪心 + 优先队列。
每个聪明学生都优先被加入到可以使得通过率增加最多的班级。
用优先队列维护这种贪心思想。`pair<double, int>` 表示 增加的通过率 和 对应的班级编号。

具体贪心正确性的证明可参考[零神的题解](https://leetcode-cn.com/problems/maximum-average-pass-ratio/solution/zui-da-ping-jun-tong-guo-lu-by-zerotrac2-84br/).

```cpp
class Solution {
    double div(const double a, const double b) {
        return a / b;
    }
public:
    double maxAverageRatio(vector<vector<int>>& classes, int extraStudents) {
        using pii = pair<double, int>;
        const int n = classes.size();
        priority_queue<pii> pq;
        auto change = [&](const int i, const int more) -> double {
            double next = div(classes[i][0] + more, classes[i][1] + more);
            double now = div(classes[i][0], classes[i][1]);
            return next - now;
        };
        double ans = 0;
        
        for (int i = 0; i < n; ++i) {
            pq.push({change(i, 1), i});
            ans += div(classes[i][0], classes[i][1]);
        }
        
        
        for (int i = 0; i < extraStudents; ++i) {
            auto [c, index] = pq.top();
            pq.pop();
            ans += c;
            classes[index][0] += 1;
            classes[index][1] += 1;
            pq.push({change(index, 1), index});
        }
        
        return div(ans, n);
    }
};
```

时间复杂度: O(n * log n),
空间复杂度: O(n).

## 1793. Maximum Score of a Good Subarray

根据数据规模，解法的时间复杂度很可能是O(N)的双指针 或是 O(N log N)的最优化问题转判定问题的二分.
再看i 和 j 的变化趋势，基本可以判定是采用双指针解法。两边看谁变的更大，就变它。同时，还需维护单调减的性质，即略过那些会变大的数。

在比赛中我的实现是，先用单调减性计算出变化的位置：`construct`.
再在变化位置上移动双指针。

```cpp
class Solution {
    using pii = pair<int, int>;
    template <typename T>
    vector<pii> construct(T begin, T end) {
        vector<pii> ans;
        int currentMin = *begin;
        for (auto it = next(begin); it != end; ++it) {
            if (*it < currentMin) {
                ans.push_back({currentMin, distance(begin, it)});
                currentMin = *it;
            }
        }
        ans.push_back({currentMin, distance(begin, end)});
        return ans;
    }
public:
    int maximumScore(vector<int>& nums, int k) {
        const int n = nums.size();
        auto right = construct(nums.begin() + k, nums.end());
        auto left = construct(nums.rbegin() + n - k - 1, nums.rend());
        int l = 0, r = 0;
        int ans = min(left[l].first, right[r].first) * (left[l].second + right[r].second - 1);
        while (l + 1 < left.size() || r + 1 < right.size()) {
            if (l + 1 < left.size() && r + 1 < right.size()) {
                if (left[l + 1].first > right[r + 1].first) {
                    ++l;
                } else {
                    ++r;
                }
            } else if (l + 1 < left.size()) {
                ++l;
            } else {
                ++r;
            }
            ans = max(ans, min(left[l].first, right[r].first) * (left[l].second + right[r].second - 1));
        }
        return ans;
    }
};
```

时间复杂度: O(nums.size()),
空间复杂度: O(nums[i]) = O(2 * 10^4).

其实，我对单调递减`construct`的函数实现是多余的。这种单调递减完全可以再双指针移动的过程中实现，此时，可以将空间复杂度降低到`O(1)`.