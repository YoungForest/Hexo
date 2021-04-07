---
title: LeetCode weekly contest 222
date: 2021-01-03 16:07:11
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 331 / 9692 | YoungForest | 18 | 2:02:29 | 0:05:32	 | 0:13:55  2 | 0:54:53  2 | 1:17:29  5 |

## 5641. Maximum Units on a Truck

贪心。按盒子容量从大到小排序后先用大的盒子。

```cpp
class Solution {
public:
    int maximumUnits(vector<vector<int>>& boxTypes, int truckSize) {
        // greedy, put larger boxes first
        sort(boxTypes.begin(), boxTypes.end(), [](const auto& a, const auto& b) -> bool {
            if (a[1] != b[1]) return a[1] > b[1];
            else return a[0] > b[0];
        });
        int ans = 0;
        int i = 0;
        while (truckSize > 0 && i < boxTypes.size()) {
            const int put = min(truckSize, boxTypes[i][0]);
            truckSize -= put;
            ans += boxTypes[i][1] * put;
            ++i;
        }
        return ans;
    }
};
```

时间复杂度: O(n log n), `n = boxTypes.size()`
空间复杂度: O(log n). 快排内部的递归消耗。

## 5642. Count Good Meals

类似two-sum。使用hashtable维护之前见过的数，只是target数目编程了22.
从`2^0` 到 最大的`2^21`.

```cpp
class Solution {
    using ll = int;
    const int maxBit = 22;
    const int MOD = 1e9 + 7;
public:
    int countPairs(vector<int>& deliciousness) {
        vector<ll> target(maxBit);
        target[0] = 1;
        for (int i = 1; i < maxBit; ++i) {
            target[i] = target[i-1] * 2;
        }
        unordered_map<ll, int> count;
        int ans = 0;
        for (ll i : deliciousness) {
            for (int j = 0; j < maxBit; ++j) {
                auto it = count.find(target[j] - i);
                if (it != count.end()) {
                    ans = (ans + it->second) % MOD;
                }
            }
            ++count[i];
        }
        return ans;
    }
};
```

时间复杂度: O(22n),
空间复杂度: O(n).

比赛过程中，由于错误估计了最大的幂数。`2^20 + 2^20 = 2^21`, 错估计成了`2^40`。导致2次超时罚时。

## 5643. Ways to Split Array Into Three Subarrays

枚举每个左子数组。然后利用前缀和和二分确定中间数组的大小。

```cpp
class Solution {
    const int MOD = 1e9 + 7;
public:
    int waysToSplit(vector<int>& nums) {
        const int n = nums.size();
        vector<int> presum(n + 1);
        presum[0] = 0;
        for (int i = 0; i < n; ++i) {
            presum[i+1] = presum[i] + nums[i];
        }
        auto binarySearchRightLessThanMid = [&](int lo, int hi) -> int {
            // [lo, hi)
            const int begin = lo;
            while (lo < hi) {
                // [begin, mid), [mid, end)
                const int mid = lo + (hi - lo) / 2;
                const int rightSum = presum[n] - presum[mid];
                const int midSum = presum[mid] - presum[begin];
                if (rightSum < midSum) {
                    hi = mid;
                } else { // rightSum >= midSum
                    lo = mid + 1;
                }
            }
            return lo;
        };
        auto binarySearchFirstLargeEqualThan = [&](int lo, int hi, const int leftSum) -> int {
            // [lo, hi)
            const int begin = lo;
            while (lo < hi) {
                // [begin, mid)
                const int mid = lo + (hi - lo) / 2;
                const int midSum = presum[mid] - presum[begin];
                if (midSum >= leftSum) {
                    hi = mid;
                } else { // rightSum < midSum
                    lo = mid + 1;
                }
            }
            return lo;
        };
        int ans = 0;
        for (int left = 1; left <= n - 2; ++left) {
            // [0, left)
            const int leftSum = presum[left];
            // [left, mid)
            int midLeft = binarySearchFirstLargeEqualThan(left, n, leftSum);
            if (midLeft == left) midLeft = left + 1;
            const int midRight = binarySearchRightLessThanMid(left, n);
            // cout << left << " " << leftSum << " " << midLeft << " " << midRight << endl;
            if (midRight > midLeft)
                ans = (ans + (midRight - midLeft)) % MOD;
        }
        return ans;
    }
};
```

时间复杂度: O(n log n),
空间复杂度: O(n).

比赛中因为边界问题（corner case）WA了2次。
- 左数组和是0时，此时中数组需不为空。
- 数组全为9时，此时右数组不为空。

事实上，由于`midRight`和`midleft`是单调递增的，可以采用[三指针的方法](https://leetcode-cn.com/problems/ways-to-split-array-into-three-subarrays/solution/cong-shuang-zhi-zhen-dao-san-zhi-zhen-by-klrb/)进一步将时间复杂度降到O(n).

## 5644. Minimum Operations to Make a Subsequence

本题大家都是比赛现场学，现场抄的。之所以这样讲，是因为本题可以转化成其他经典题目。

首先，观察有，`arr`中不出现在`target`中的数是没用的，可以直接删掉。
删掉后的`arr`是一个`target`的组合（也不完全是，区别在于`arr`中有些可能是重复的数）。
我们只需要求2者的最长公共子序列(Longest Common Subquence, LCS)的长度，然后补齐其余即可。
然而LCS的时间复杂度是O(mn)的，显然超时。
此时就需要利用组合这一条件了，我谷歌`全排列 最长公共子序列`。在第三条找到了解法[最长公共子序列 和其变形](https://www.cnblogs.com/Jackpei/p/10356999.html).
具体而言，对于这种组合的LCS的特例，可以将其转化成最长上升子序列（Longest Increasing Subsequence, LIS)的问题。LIS又有巧妙的O(n log n)的解法。


```cpp
class Solution {
    int nums[100005];
    int lengthOfLIS(int n) {
        vector<int> res;
        for(int i=0; i<n; i++) {
            auto it = std::lower_bound(res.begin(), res.end(), nums[i]);
            if(it==res.end()) res.push_back(nums[i]);
            else *it = nums[i];
        }
        return res.size();
    }
public:
    int minOperations(vector<int>& target, vector<int>& arr) {
        // n log n
        int cnt = 0;
        unordered_map<int, int> m;
        for (int i : target) {
            m[i] = cnt;
            ++cnt;
        }
        int x = 0;
        for (int i : arr) {
            auto it = m.find(i);
            if (it != m.end()) {
                nums[x++] = it->second;
            }
        }
        int lcs = lengthOfLIS(x);
        return target.size() - lcs;
    }
};
```

时间复杂度: O(n log n), `n = target.size()`
空间复杂度: O(target.size()).

因为抄错LIS的模版，TLE了3次。因为一开始只用了朴素的LCS的O(mn)解法又TLE了2次。

## 后记

今天是2021年的第一场周赛，比往常的更难一些。
北京的冬天真是太冷了，起床已经变的十分困难了，对生活的热情也十分不足，状态有些消极和悲伤。
我想要重新振作和积极起来，开始奋斗的Forest。
打工人，打工魂，打工才是人上人。
加油Forest！