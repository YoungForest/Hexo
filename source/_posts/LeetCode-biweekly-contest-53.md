---
title: LeetCode biweekly contest 53
date: 2021-05-30 11:44:44
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 219 / 12291 | YoungForest | 18 | 0:57:45 | 0:19:12 | 0:22:21 |  0:46:08 |  0:57:45 |

因为今天陪npy去参加斯巴达比赛，早上不到6点就起了，在外奔波了一天。
比赛前想着休息一下子，就打算睡20min。没想到太累了，闹铃响了自己给关了。因此迟到了10+min，否则我排名还可以更高些。题目不难，也不简单，属于出的比较好的。

零神大数据
1876,Substrings of Size Three with Distinct Characters,substrings-of-size-three-with-distinct-characters,1248.7224675206
1877,Minimize Maximum Pair Sum in Array,minimize-maximum-pair-sum-in-array,1301.3817574010
1878,Get Biggest Three Rhombus Sums in a Grid,get-biggest-three-rhombus-sums-in-a-grid,1897.5516652727
1879,Minimum XOR Sum of Two Arrays,minimum-xor-sum-of-two-arrays,2145.1839952670

## 1876. Substrings of Size Three with Distinct Characters

签到题。因为子字符串长度是确定长度（3）。因此可以用一个滑动窗口枚举所有的长度为3的子串，判断是否每个字符都只出现一次。

```cpp
class Solution {
public:
    int countGoodSubstrings(string s) {
        const int n = s.size();
        vector<int> cnt(26, 0);
        auto ok = [&]() -> bool {
            for (int i : cnt) {
                if (i > 1) return false;
            }
            return true;
        };
        if (n < 3) return 0;
        int ans = 0;
        ++cnt[s[0] - 'a'];
        ++cnt[s[1] - 'a'];
        ++cnt[s[2] - 'a'];
        if (ok()) ++ans;
        for (int i = 3; i < n; ++i) {
            ++cnt[s[i] - 'a'];
            --cnt[s[i - 3] - 'a'];
            if (ok()) ++ans;
        }
        return ans;
    }
};
```

时间复杂度: O(n),
空间复杂度: O(1).

## 1877. Minimize Maximum Pair Sum in Array

贪心，让大的和小的组合。
可以让最大和最小，同时让最小和最大。

```cpp
class Solution {
public:
    int minPairSum(vector<int>& nums) {
        // greedy: match largest and smallest
        sort(nums.begin(), nums.end());
        const int n = nums.size();
        int l = 0, r = n - 1;
        int ans = 0;
        while (l < r) {
            ans = max(ans, nums[l++] + nums[r--]);
        }
        return ans;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(1).


## 1878. Get Biggest Three Rhombus Sums in a Grid

枚举所有的菱形，然后维护最大的3个菱形和即可。
我的枚举方式是，枚举菱形的中心和4个顶点到中心的距离。
计算菱形和可以通过前缀和presum O(1)计算。因此总的时间复杂度是 O(N^3). N最大值是100，恰好满足条件。

后来发现LeetCode把题目的数据范围从100改到了50.之前听说比赛时有人用N^4的暴力方法过了，我以为会赛后rejudge 的，没想到人家直接改体面。让所有人都过了。可能是懒得rejudge了，还得加数据量大的case。改数据范围多省事儿。

```cpp
class Solution {
public:
    vector<int> getBiggestThree(vector<vector<int>>& grid) {
        // x := Rhombus number: m * n * m
        // time: x log x
        const int m = grid.size();
        const int n = grid[0].size();
        
        vector<vector<int>> presum(m + 1, vector<int>(n + 1, 0));
        vector<vector<int>> presum2(m + 1, vector<int>(n + 1, 0));
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                presum[i+1][j+1] = presum[i][j] + grid[i][j];
            }
        }
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                presum2[i+1][j] = presum2[i][j+1] + grid[i][j];
            }
        }
        
        
        set<int> s;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                s.insert(grid[i][j]);
                for (int len = 1; i - len >= 0 && j - len >= 0 && i + len < m && j + len < n; ++len) {
                    const int rhombus = presum[i+1][j+len+1] - presum[i-len][j]
                        + presum[i+len+1][j+1] - presum[i][j-len]
                        + presum2[i+len+1][j] - presum2[i][j+len+1]
                        + presum2[i+1][j-len] - presum2[i-len][j+1]
                        - grid[i-len][j] - grid[i][j+len] - grid[i][j-len] - grid[i+len][j];
                    s.insert(rhombus);
                }
            }
        }
        vector<int> ans;
        int i = 0;
        for (auto it = s.rbegin(); it != s.rend() && i < 3; ++it, ++i) {
            ans.push_back(*it);
        }
        return ans;
    }
};
```

菱形数目`x = m * n * min(m,n)`,
时间复杂度: O(x log x),
空间复杂度: O(x + m * n)。因为只需要维护最大的3个菱形和，可优化到 -> O(m*n).

## 1879. Minimum XOR Sum of Two Arrays

经典 DP + Bitmask.

一开始想到暴力的枚举所有排列，时间复杂度是 排列数 n! = 14!。一定会超时。
根据数据规模`n = 14`可以推测 需要使用bitmask.

定义dp(i, mask) 表示 nums1[i:] 和 nums2 中的子集mask 的最小异或和。
状态转移方程为：暴力尝试 nums[i]与mask中每一个可以的取值进行组合，取最小的。

```python
class Solution:
    def minimumXORSum(self, nums1: List[int], nums2: List[int]) -> int:
        # time: n * n * 2 ^ n
        n = len(nums2)
        @cache
        def dp(i, mask):
            if i >= len(nums1): return 0
            ans = float('inf')
            for j in range(n):
                if ((1 << j) & mask) == 0: continue
                ans = min(ans, (nums1[i] ^ nums2[j]) + dp(i+1, mask ^ (1 << j)))
            return ans
            
        return dp(0, (1 << n) - 1)
```

时间复杂度: O(n * n * 2 ^ n)  = 14 * 14 * 2^14 = 3211264,
空间复杂度: O(n * 2^ n).