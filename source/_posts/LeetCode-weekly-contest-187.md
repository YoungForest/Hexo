---
title: LeetCode weekly contest 187
date: 2020-05-04 10:44:42
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 301 / 12353 |	YoungForest | 19 | 1:03:24 |  0:06:34 |  0:03:07 |  0:17:30 | 1:03:24 |

## 1436. Destination City

遍历每条边，统计各个点的出度。

时间复杂度: O(path.length * city[i].length),
空间复杂度: O(city.length * city[i].length).

```cpp
class Solution {
public:
    string destCity(vector<vector<string>>& paths) {
        unordered_map<string, int> outgoing;
        unordered_set<string> seen;
        for (const auto& v : paths) {
            ++outgoing[v[0]];
            seen.insert(v[0]);
            seen.insert(v[1]);
        }
        for (const auto& s : seen) {
            if (outgoing[s] == 0)
                return s;
        }
        return "";
    }
};
```

## 1437. Check If All 1's Are at Least Length K Places Away

One pass. 记录上一个1出现的位置。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
public:
    bool kLengthApart(vector<int>& nums, int k) {
        int last_one = -INF;
        for (int i = 0; i < nums.size(); ++i) {
            if (nums[i] == 1) {
                if (i - last_one - 1 >= k) {
                    last_one = i;
                } else {
                    return false;
                }
            }
        }
        return true;
    }
};
```

## 1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit

双指针，用一个multiset维护子数组中的元素，由于treemap的特点，可以快速地锁定子数组中的最大最小值。

时间复杂度: O(N log N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int longestSubarray(vector<int>& nums, int limit) {
        multiset<int> subarray;
        size_t ans = 0;
        for (int r = 0, l = 0; r < nums.size(); ++r) {
            while (!subarray.empty() && nums[r] - *subarray.begin() > limit) {
                auto it = subarray.find(nums[l++]);
                subarray.erase(it);
            }
            while (!subarray.empty() && *subarray.rbegin() - nums[r] > limit) {
                auto it = subarray.find(nums[l++]);
                subarray.erase(it);
            }
            subarray.insert(nums[r]);
            ans = max(ans, subarray.size());
        }
        return ans;
    }
};
```

## 1439. Find the Kth Smallest Sum of a Matrix With Sorted Rows

优先队列记录所有的候选者，从中选出sum最小的组合，并将变化后的可能加入优先队列。
需要注意的是，相同的候选者可能从不同的状态产生（如 001, 010 -> 011)，这里我用了一个set和字符串变化以去重。

时间复杂度: O(k * m * m * log (nm)),
空间复杂度: O(n * m * m).

```cpp
class Solution {
    string encode(const vector<int>& v) {
        string ans;
        for (int i : v) {
            ans.push_back('a' + i);
        }
        return ans;
    }
public:
    int kthSmallest(vector<vector<int>>& mat, int k) {
        const int m = mat.size();
        const int n = mat[0].size();
        int rank = 0;
        priority_queue<pair<int, vector<int>>,std::vector<pair<int,vector<int>>>, std::greater<pair<int,vector<int>>>> pq; // difference, row_index
        unordered_set<string> seen;
        int current_sum = 0;
        for (int i = 0; i < m; ++i) {
            current_sum += mat[i][0];
        }
        {
            vector<int> index(m, 0);
            pq.push({current_sum, index});
            seen.insert(encode(index));
        }
        
        while (rank < k && !pq.empty()) {
            auto t = pq.top();
            pq.pop();
            current_sum = t.first;
            for (int i = 0; i < m; ++i) {
                ++t.second[i];
                string x = encode(t.second);
                if (t.second[i] < n && seen.find(x) == seen.end()) {
                    pq.push({current_sum + mat[i][t.second[i]] - mat[i][t.second[i]-1], t.second});
                    seen.insert(x);
                }
                --t.second[i];
            }
            ++rank;
        }
        return current_sum;
    }
};
```