---
title: LeetCode weekly contest 235
date: 2021-04-05 12:12:49
tags:
- Competitive Programming
categories:
- LeetCode
---


| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 889 / 11443 | YoungForest | 12 | 0:27:18 | 0:01:52 | 0:07:49 | 0:27:18 | null |

## 1816. Truncate Sentence

签到题。再次强调一遍，字符串问题适合用Python做，真的只需要描述题目就可以了。

```python
class Solution:
    def truncateSentence(self, s: str, k: int) -> str:
        return ' '.join(s.split(' ')[:k])
```
时间复杂度: O(s.length),
空间复杂度: O(s.length).

## 1817. Finding the Users Active Minutes

暴力。以ID为统计每个用户的动作时间序列，然后排序去重。

```cpp
class Solution {
public:
    vector<int> findingUsersActiveMinutes(vector<vector<int>>& logs, int k) {
        // brute-force:
        // logs.length + k
        unordered_map<int, vector<int>> actions; // userId -> actionMinute
        for (const auto& v : logs) {
            actions[v[0]].push_back(v[1]);
        }
        vector<int> ans(k, 0);
        for (auto& p : actions) {
            auto& v = p.second;
            sort(v.begin(), v.end());
            auto it = unique(v.begin(), v.end());
            const int d = distance(v.begin(), it);
            if (d >= 1 && d <= k) ++ans[d - 1];
        }
        return ans;
    }
};
```

时间复杂度: O(logs.length * log(logs.length) + k),
空间复杂度: O(logs.length + k).

## 1818. Minimum Absolute Sum Difference

贪心 + 二分搜索。 Greedy + Binary Search.

对于每一个位置，试图换它以达到最小Diff. 使用二分搜索找到最近的可选值。

```cpp
class Solution {
    using ll = long long;
    ll MOD = 1e9 + 7;
public:
    int minAbsoluteSumDiff(vector<int>& nums1, vector<int>& nums2) {
        const int n = nums1.size();
        ll sumNums = 0;
        for (int i = 0; i < n; ++i) {
            sumNums += abs(nums1[i] - nums2[i]);
        }
        ll ans = sumNums;
        auto sortNums1 = nums1;
        sort(sortNums1.begin(), sortNums1.end());
        for (int i = 0; i < n; ++i) {
            auto it = lower_bound(sortNums1.begin(), sortNums1.end(), nums2[i]);
            if (it != sortNums1.end()) {
                ans = min(ans, sumNums - static_cast<ll>(abs(nums1[i] - nums2[i])) + static_cast<ll>(abs(*it - nums2[i])));
            }
            if (it != sortNums1.begin()) {
                it = prev(it);
                ans = min(ans, sumNums - static_cast<ll>(abs(nums1[i] - nums2[i])) + static_cast<ll>(abs(*it - nums2[i])));
            }
        }
        
        return ans % MOD;
    }
};
```

时间复杂度: O(nums.length * log nums.length),
空间复杂度: O(nums.length).

## 1819. Number of Different Subsequences GCDs

比赛时TLE，没想出高效的算法。
暴力DP，维护当前数组的子数组的所有子序列的GCD在一个Set中。

时间复杂度: O(N ^ 2), N = nums.length,
空间复杂度: O(max(nums[i])). gcd的数量，最多有这么多种可能。

```cpp
class Solution {
public:
    int countDifferentSubsequenceGCDs(vector<int>& nums) {
        unordered_set<int> dp;
        for (int x : nums) {
            unordered_set<int> newDp;
            newDp.insert(x);
            for (int a : dp) {
                newDp.insert(__gcd(a, x));
            }
            for (int x : newDp) {
                dp.insert(x);
            }
        }
        return dp.size();
    }
};
```