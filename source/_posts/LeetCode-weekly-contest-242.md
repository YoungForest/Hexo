---
title: LeetCode weekly contest 242
date: 2021-05-23 10:30:24
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 165 / 12400 | YoungForest | 18 | 	1:07:14 | 0:03:22 🐞1 | 0:16:01 🐞1 | 0:27:41  🐞1 | 0:52:14 |

提前40min AK。虽然因为粗心大意，前三题每题WA一次，导致15min罚时，但好的一点是这周应该不用每天残酷打卡了。正好全力以赴，准备周三的硕士论文答辩。
三年的硕士生涯全靠周三一天了，毕其功于一役，加油，Forest！

## 1869. Longer Contiguous Segments of Ones than Zeros

签到题。统计连续字串的长度，更新最长长度即可。

因为更新最长长度的代码写错位置，写到了if的分支里，WA了一次。应该无论如何都要更新，所以要写在外面。

```cpp
class Solution {
public:
    bool checkZeroOnes(string s) {
        vector<int> longest(2, 0);
        int length = 0;
        char last = '2';
        for (char c : s) {
            if (c != last) {
                last = c;
                length = 1;
            } else {
                ++length;
            }
            longest[c - '0'] = max(longest[c - '0'], length);
        }
        return longest[1] > longest[0];
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1870. Minimum Speed to Arrive on Time

直接暴力二分怼。之前总结的binary search模版很好用。基本只需要改几行代码就行了。

因为浮点数精度WA了一次。`10^-5` 不够小，建议以后都用`10^-9`。

```cpp
class Solution {
    using ll = int;
public:
    int minSpeedOnTime(vector<int>& dist, double hour) {
        int lo = 1;
        int hi = 1e7 + 1;
        // f f f t t t
        auto binary = [&](ll lo, ll hi, function<bool(const ll)> predicate) -> int {
            // return first true
            while (lo < hi) {
                ll mid = lo + (hi - lo) / 2;
                if (predicate(mid)) {
                    hi = mid;
                } else {
                    lo = mid + 1;
                }
            }
            return lo;
        };
        auto pred = [&](const ll x) -> bool {
            double ans = 0;
            int i;
            for (i = 0; i + 1 < dist.size(); ++i) {
                ans += (dist[i] + x - 1) / x;
            }
            ans += dist[i] / static_cast<double>(x);
            // cout << x << " " << ans << endl;
            return ans <= hour + 1e-9;
        };
        ll ans = binary(lo, hi, pred);
        if (ans >= hi) return -1;
        else return ans;
    }
};
```

时间复杂度: O(log dist[i] * dist.length) = log 10^5 * 10^5,
空间复杂度: O(1).

## 1871. Jump Game VII

很容易想到暴力的N^2解法。
从头开始遍历，如果是0的话，更新之后所有可以到达的位置。
时间复杂度为: s.length * (maxJump - minJump) = 10% * 10^5.

优化的方向是“更新之后所有可以到达的位置”。显然，这步更新因为有很多重复的更新，因此花费很多。但是，我们考虑每次其实是更新一个区间（range），而且区间的大小相等，而且区间总是向右移动的。因此，我们发现，更新区间并不需要遍历minJump...maxJump，只需要从maxJump向前开始遍历，如果和之前已经更新过的区间重合了，就直接break结束更新就好了。因为每个位置最多被更新一次，因此时间复杂度是 s.length.

```cpp
class Solution {
public:
    bool canReach(string s, int minJump, int maxJump) {
        // brute-force: s.length * (maxJump - minJump) = 10^5 * 10^5
        // better: s.length * 1
        const int n = s.size();
        
        vector<bool> reachable(n, false);
        reachable[0] = true;
        // <= reach
        for (int i = 0; i < n; ++i) {
            if (s[i] == '0') {
                if (reachable[i]) {
                    for (int j = min(maxJump, n - 1 - i); j >= minJump; --j) {
                        if (reachable[i + j]) break;
                        reachable[i + j] = true;
                    }
                }
            }
        }
        return s[n-1] == '0' && reachable[n - 1];
    }
};
```

时间复杂度: O(s.length),
空间复杂度: O(s.length).

## 1872. Stone Game VIII

类似之前的Stone Game，这种最优玩法的题目大多数属于 动态规划问题。
即通过搜索所有可能的选择，找到最优结果。过程中有很多重复子问题，因此需要使用动态规划。

最优化目标是(Alice's score - Bob's score)，Alice想要最大化，Bob想要最小化。其实都是最大化（我的分数 - 对方的分数）。
另外，观察到操作的结果其实是石头的和，因此需要提前计算前缀和数组。
问题转化成，从前缀和[i:]中挑一个数，使得的分数差最大；之后的后手只能从被挑的位置之后挑。
定义
dp(i) 为从前缀和[i:]中挑一个数的最大分数差，
则状态转移方程为：
dp(i) = max(presum[j] + dp(j + 1) for j in range(i,)).
时间复杂度为 O(N^2), 显然超时。

然而，在状态转移方程中其实还有重叠子问题, for loop max可以只计算一次，因此可以进一步优化到 O(N).

```cpp
class Solution {
public:
    int stoneGameVIII(vector<int>& stones) {
        // presum
        // i = 0
        // pick i, ..., n - 1
        // time: n ^ 2
        const int n = stones.size();
        vector<int> presum(n + 1);
        presum[0] = 0;
        for (int i = 0; i < n; ++i) {
            presum[i+1] = presum[i] + stones[i];
        }
        int maxDp = numeric_limits<int>::min();
        vector<int> dp(n + 2, 0);
        dp[n+1] = 0;
        for (int i = n; i >= 2; --i) { // 这里需要注意结束条件，因为第一次挑选不能不合并或只合并第一个，因此presum[0],presum[1]是没用的。
            maxDp = max(maxDp, presum[i] - dp[i + 1]);
            dp[i] = maxDp;
        }
        return maxDp;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).