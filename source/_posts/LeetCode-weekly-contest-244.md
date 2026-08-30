---
title: LeetCode weekly contest 244
date: 2021-06-06 15:37:26
description: 四道题旋转比较矩阵、按排序层级统计归一操作、计算环形交替序列的最少翻转，并用前缀和与二分减少包装浪费。
tags:
- Competitive Programming
categories:
- LeetCode
translations:
  zh-CN: https://youngforest.github.io/2021/06/06/LeetCode-weekly-contest-244/
  en: https://youngforest.github.io/en/2021/06/06/LeetCode-weekly-contest-244/
---
| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 142 / 14467 | YoungForest | 18 | 0:51:13 |  0:05:21 | 0:09:54 |  0:30:19 | 0:46:13 🐞1 |

下午约了 [残酷东神](http://leetcode.com/ddoudle) 吃饭，一个rating 2700+的大佬。他本科浙大，在加拿大读研。这个暑假来北京旷视实习。因此我们有机会线下面基。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/LeetCode-weekly-contest-244/zh-hero.webp" alt="方格盘旋转对齐模板，阶梯石块逐层归一，双色环带以最少翻片交替，盒子按尺寸包裹物件并收集空隙" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

## 1886. Determine Whether Matrix Can Be Obtained By Rotation

签到题。旋转3次 加上 原始 共4种状态，分别比较。旋转的话就是另外的一个LeetCode经典题目了，in-place还是实现起来比较复杂的。但因为n比较小，而且是签到题，我直接用了辅助数组。虽然时间复杂度上去了，但实现起来简单多了。

```cpp
class Solution {
    void rotate(vector<vector<int>>& mat) {
        vector<vector<int>> cp = mat;
        const int n = mat.size();
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                cp[j][n-1-i] = mat[i][j];
            }
        }
        mat = move(cp);
    }
public:
    bool findRotation(vector<vector<int>>& mat, vector<vector<int>>& target) {
        if (mat == target) return true;
        for (int i = 0; i < 3; ++i) {
            rotate(mat);
            if (mat == target) return true;
        }
        return false;
    }
};
```

时间复杂度: O(4 * n * n),
空间复杂度: O(n * n).

## 1887. Reduction Operations to Make the Array Elements Equal

理解整个减小的过程可以发现，每个数减到最小的操作数目其实等于小于他的元素（去除重复元素）的数目。
因此，先排序，再One pass 统计“小于他的元素”数目之和。

```cpp
class Solution {
public:
    int reductionOperations(vector<int>& nums) {
        const int n = nums.size();
        sort(nums.begin(), nums.end());
        int ans = 0;
        int add = 0;
        for (int i = 1; i < n; ++i) {
            if (nums[i] > nums[i-1]) {
                ++add;
            }
            ans += add;
        }
        return ans;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(1).

## 1888. Minimum Number of Flips to Make the Binary String Alternating

观察有：
操作1的数目不限。也就是说 我们可以遍历所有位置，假设它是开头，枚举开头分别是0/1的2种情况，然后统计之后和之前的不符合预期的数量。
统计“之前和之后不符合预期的数量” 这个操作可以通过维护之前/之后 奇偶位置 0/1 的数量 O(1)实现。

因为奇偶问题，“之前不符合预期的数量”需要分开讨论。
发现在偶数长度下，开头位置其实是无所谓的。这时可以进一步简化问题。
奇数长度下，还是需要枚举每个开头位置才行。

```cpp
class Solution {
public:
    int minFlips(string s) {
        const int n = s.size();
        if (n % 2 == 0) {
            vector<int> cnt(2, 0);
            for (int i = 0; i < n; ++i) {
                cnt[i % 2] += (s[i] - '0');
            }
            const int half = n / 2;
            return min(half - cnt[0] + cnt[1], cnt[0] + half - cnt[1]);
        } else {
            vector<int> after(2, 0);
            for (int i = 0; i < n; ++i) {
                after[i % 2] += (s[i] - '0');
            }
            vector<int> before(2, 0);
            int ans = numeric_limits<int>::max();
            const int half = n / 2;
            for (int i = 0; i < n; ++i) {
                const int now = i % 2;
                ans = min(ans, half + 1 - after[now] - before[1-now] + after[1-now] + before[now]); // 1 begin
                ans = min(ans, after[now] + before[1-now] + half - after[1-now] - before[now]); // 0 begin
                after[i % 2] -= (s[i] - '0');
                before[i % 2] += (s[i] - '0');
            }
            return ans;
        }
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1889. Minimum Space Wasted From Packaging

本题的暴力解法很容易想：
遍历所有的`boxes`； 对于每一个供应商，再遍历所有的包裹；对于每一个包裹，找到仅大于它的盒子做包装。时间复杂度为：O(m * n * log m). 显然会TLE。

题目中给了数据范围，其中一个值得我们特别关注: `sum(boxes[j].length) <= 10^5`。
也就是说，我们完全可以枚举每一个盒子，找到用它的包裹（可以通过二分搜索，找到它能装的最大包裹的位置。除了比它小的盒子装的，剩下就是它装的。）。然后通过前缀和快速计算空余空间。
时间复杂度为：`O(sum(boxes[j].length) * log n + n log n)，恰好符合要求。

因为最大空余空间是`max(boxes[i][j]) * packges.length = 10 ^ 10`, 因此`int`会溢出，需要使用`long long`.

最后，千万不要忘记MOD。我因此WA一次。

```cpp
class Solution {
    using ll = long long;
    const ll MOD = 1e9 + 7;
public:
    int minWastedSpace(vector<int>& packages, vector<vector<int>>& boxes) {
        sort(packages.begin(), packages.end());
        const int n = packages.size();
        vector<ll> presum(n+1);
        presum[0] = 0;
        for (int i = 0; i < n; ++i) {
            presum[i+1] = presum[i] + packages[i];
        }
        ll ans = numeric_limits<ll>::max();
        const int m = boxes.size();
        for (auto& b : boxes) {
            sort(b.begin(), b.end());
            int lastIdx = 0;
            ll current = 0;
            for (int j : b) {
                auto it = upper_bound(packages.begin(), packages.end(), j);
                const ll d = distance(packages.begin(), it);
                const ll width = d - lastIdx;
                current += width * j - (presum[d] - presum[lastIdx]);
                lastIdx = d;
            }
            if (b.back() < packages.back()) { // can not fit
                
            } else {
                ans = min(ans, current);
            }
        }
        if (ans == numeric_limits<ll>::max()) return -1;
        else return ans % MOD;
    }
};
```

时间复杂度: O(sum(boxes[j].length) * log n + n log n),
空间复杂度: O(n).
