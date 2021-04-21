---
title: LeetCode biweekly contest 50
date: 2021-04-18 11:57:36
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 1032 / 10097 | YoungForest | 12 | 0:20:28 | 0:09:10 |  0:12:51 |  0:20:28 | null |

因为洗澡迟到了8分钟，否则应该可以进前500的。
本次的双周赛是变相的手速场，141人作出4题。剩下的比拼前3题的手速。
我花10min很顺利地做完了前三题，Q4却思考了一个小时也并未有重大突破。
虽然有些许眉目，觉得是个DP，但事后发现问题早已超纲，没做出来也实属正常。

<!-- more -->

## 1827. Minimum Operations to Make the Array Increasing

贪心。在保持递增的同时，使得数字尽可能小。

```cpp
class Solution {
public:
    int minOperations(vector<int>& nums) {
        // greedy
        // time: O(N)
        int last = 0;
        int ans = 0;
        for (int i : nums) {
            if (i > last) {
                last = i;
            } else {
                ans += last + 1 - i;
                ++last;
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1828. Queries on Number of Points Inside a Circle

由于点数和圆数都比较小（<= 500），因此直接暴力即可。

```cpp
class Solution {
    bool inside(const vector<int>& p, const vector<int>& c) {
        return (p[0] - c[0]) * (p[0] - c[0]) + (p[1] - c[1]) * (p[1] - c[1]) <= c[2] * c[2];
    }
public:
    vector<int> countPoints(vector<vector<int>>& points, vector<vector<int>>& queries) {
        vector<int> ans;
        ans.reserve(queries.size());
        for (const auto& v : queries) {
            int count = 0;
            for (const auto& p : points) {
                if (inside(p, v)) ++count;
            }
            ans.push_back(count);
        }
        return ans;
    }
};
```

时间复杂度: O(points.length * queries.length),
空间复杂度: O(queries.length).

## 1829. Maximum XOR for Each Query

利用前缀和（其实是前缀XOR）快速进行`Remove`操作，然后用互补的方式构造`k`。

```cpp
class Solution {
public:
    vector<int> getMaximumXor(vector<int>& nums, int maximumBit) {
        int currentXOR = accumulate(nums.begin(), nums.end(), 0, [](int a, int b) -> int {
            return a ^ b;
        });
        auto findMax = [&](const int a) -> int {
            // argmax a ^ k
            int k = 0;
            for (int i = maximumBit - 1; i >= 0; --i) {
                if (!(a & (1 << i))) {
                    k |= (1 << i);
                }
            }
            return k;
        };
        vector<int> ans;
        ans.reserve(nums.size());
        for (auto it = nums.rbegin(); it != nums.rend(); ++it) {
            const int x = *it;
            ans.push_back(findMax(currentXOR));
            currentXOR ^= x;
        }
        return ans;
    }
};
```

时间复杂度: O(nums.length * maximumBit),
空间复杂度: O(nums.length).

## 1830. Minimum Number of Operations to Make String Sorted

[Problem link](https://leetcode.com/problems/minimum-number-of-operations-to-make-string-sorted/).