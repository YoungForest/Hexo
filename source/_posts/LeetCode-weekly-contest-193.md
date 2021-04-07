---
title: LeetCode weekly contest 193
date: 2020-06-15 12:19:06
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 1854 / 13794 | YoungForest | 12 | 1:18:35 |  0:15:31 | 0:12:31 | 1:18:35	 | null |

最近比赛能力有所下降，昨晚的双周赛也是有一道第3题没做出来，现在更是最后一题没做出来。对Q4的树上倍增算法不了解。

## 1480. Running Sum of 1d Array

签到题，一遍presum求和。
也可以使用STL 中的[partial_sum](https://leetcode.com/problems/running-sum-of-1d-array/discuss/686276/C++-partial_sum)，达到相同的效果。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<int> runningSum(vector<int>& nums) {
        vector<int> presum;
        presum.reserve(nums.size() + 1);
        presum.push_back(0);
        for (int i : nums) {
            presum.push_back(presum.back() + i);
        }
        presum.erase(presum.begin());
        return presum;
    }
};
```

## 1481. Least Number of Unique Integers after K Removals

贪心。
按照频数从小到大排序，先删除小的。

时间复杂度: O(N + N log N + K),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int findLeastNumOfUniqueInts(vector<int>& arr, int k) {
        unordered_map<int,int> count;
        for (int i : arr) {
            ++count[i];
        }
        vector<int> frequence;
        frequence.reserve(count.size());
        for (const auto& p : count) {
            frequence.push_back(p.second);
        }
        sort(frequence.begin(), frequence.end());
        int i = 0;
        const int n = frequence.size();
        if (i == k) return n;
        for (int j = 0; j < frequence.size(); ++j) {
            i += frequence[j];
            if (i == k) {
                return n - j - 1;
            } else if (i > k) {
                return n - j;
            }
        }
        return 0;
    }
};
```

## 1482. Minimum Number of Days to Make m Bouquets

将最优化问题转换成二分判定问题。
寻找一个临界点，临界点前判定问题均为false, 之后均为true.

时间复杂度: O(log 1e9 * N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int minDays(vector<int>& bloomDay, int m, int k) {
        auto determine = [&](int x) -> bool {
            int sub = 0;
            int ans = 0;
            for (int i : bloomDay) {
                if (i <= x) {
                    ++sub;
                } else {
                    ans += sub / k;
                    sub = 0;
                }
            }
            ans += sub / k;
            return ans >= m;
        };
        int lo = 1, hi = 1e9 + 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (determine(mid)) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo > 1e9 ? -1 : lo;
    }
};
```

## 1483. Kth Ancestor of a Tree Node

类似[树上倍增 LCA](https://cp-algorithms.com/graph/lca_binary_lifting.html)问题。用时间换空间。

时间复杂度: O(N * log N),
空间复杂度: O(N * log N).

```cpp
class TreeAncestor {
    vector<vector<int>> ancestors;
public:
    TreeAncestor(int n, vector<int>& parent) {
        // time: N * log N
        vector<vector<int>> children(n);
        for (int i = 1; i < n; ++i) {
            children[parent[i]].push_back(i);
        }
        ancestors.resize(n);
        function<void(int,vector<int>&)> dfs = [&](int root, vector<int>& path) -> void {
            int depth = path.size();
            for (int i = 0; depth - (1 << i) >= 0; ++i) {
                ancestors[root].push_back(path[depth - (1 << i)]);
            }
            path.push_back(root);
            for (int child : children[root]) {
                dfs(child, path);
            }
            path.pop_back();
        };
        vector<int> path;
        path.push_back(-1);
        dfs(0, path);
    }
    
    int getKthAncestor(int node, int k) {
        // time: log K
        int i = 20;
        while (k > 0 && node != -1) {
            if ((k & (1 << i)) != 0) {
                if (i < ancestors[node].size())
                    node = ancestors[node][i];
                else
                    node = -1;
                k -= (1 << i);
            }
            --i;
        }
        return node;
    }
};

/**
 * Your TreeAncestor object will be instantiated and called as such:
 * TreeAncestor* obj = new TreeAncestor(n, parent);
 * int param_1 = obj->getKthAncestor(node,k);
 */
```