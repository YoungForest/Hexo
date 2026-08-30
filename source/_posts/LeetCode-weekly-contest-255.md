---
title: LeetCode weekly contest 255
date: 2021-08-23 11:39:46
description: 三道赛内题求最大公约数、寻找缺失二进制串并用动态规划逼近目标；第四题只记录放弃与赛后参考。
tags:
- Competitive Programming
categories:
- LeetCode
translations:
  zh-CN: https://youngforest.github.io/2021/08/23/LeetCode-weekly-contest-255/
  en: https://youngforest.github.io/en/2021/08/23/LeetCode-weekly-contest-255/
---
| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (6) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 406 / 11837 | YoungForest | 	12 | 	0:36:07 | 0:01:21 | 0:09:54 |  0:26:07  🐞2 | null |

本周Q4极其难，思考了半个小时果断放弃，陪npy做可乐鸡翅去了。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/LeetCode-weekly-contest-255/zh-hero.webp" alt="最大最小石块进入公约数齿轮，两色珠阵留下唯一空槽，每行取一块逼近目标天平，第四张工作台停在赛后参考阶段" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

有趣的是，LC国服赛后挂了。取不到成绩，残酷榜默认0分。心疼国服的同学们。
虽然之后恢复了，我上面的成绩就是恢复之后，加上国服的同学后的排名。
因为今天其实有Google Kickstart比赛，因此参赛人数有所减少。

## 1979. Find Greatest Common Divisor of Array

签到题。用C++简直作弊，有自带的gcd函数，虽然是C++ 17才支持的，不过LeetCode恰好支持17.

```cpp
class Solution {
public:
    int findGCD(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        const int smallest = *nums.begin();
        const int largest = *nums.rbegin();
        return gcd(largest, smallest);
    }
};
```

时间复杂度: O(n log n + log max(nums)),
空间复杂度: O(1).

gcd 的时间复杂度: [link](https://www.quora.com/What-is-the-time-complexity-of-Euclids-GCD-algorithm).

## 1980. Find Unique Binary String

由于`n`的大小很小，因此直接暴力即可。
数字转二进制字符串，和 二进制字符串转数字 都是网上现搜的。

```cpp
class Solution {
public:
    string findDifferentBinaryString(vector<string>& nums) {
        // total number: 2 ^ n,
        // 2 ^ 16 = 65536
        const int n = nums.size();
        unordered_set<int> seen;
        for (const auto& i : nums) {
            seen.insert(stoi(i, 0, 2));
        }
        for (int i = 0; i < (1 << n); ++i) {
            if (seen.find(i) == seen.end()) {
                return std::bitset<16>(i).to_string().substr(16 - n);
            }
        }
        return "";
    }
};
```

时间复杂度: O(sum(nums[i].length) + 2 ^ n),
空间复杂度: O(n).

## 1981. Minimize the Difference Between Target and Chosen Elements

使用DP枚举所有可能的和，然后找最近的。

```cpp
class Solution {
public:
    int minimizeTheDifference(vector<vector<int>>& mat, int target) {
        // 1 * m ~ 70 * m = 4900
        // 4900 * n * m = 24,010,000
        const int MAXNUMBER = 70;
        const int m = mat.size();
        vector<bool> dp(MAXNUMBER * m + 1, false);
        dp[0] = true;
        for (int i = 0; i < m; ++i) {
            vector<bool> newdp(MAXNUMBER * m + 1, false);
            for (int j = MAXNUMBER * m; j >= 0; --j) {
                if (dp[j]) {
                    for (int k : mat[i]) {
                        if (j + k <= MAXNUMBER * m) newdp[j + k] = true;
                    }
                }
            }
            dp = move(newdp);
        }
        int i;
        for (i = 0; target + i <= MAXNUMBER * m || target - i >= 0; ++i) {
            if ((target + i <= MAXNUMBER * m && dp[target + i]) || (target - i >= 0 && target - i <= MAXNUMBER * m && dp[target - i])) return i;
        }
        return i;
    }
};
```

时间复杂度: O(m * max(mat[i][j]) * m * n) = 24,010,000,
空间复杂度: O(max(mat[i][j]) * m).

WA 一次：因为每行必须选一个数，不能不选。因此dp需要新开一个数组，不能复用原来的。
Runtime Error 一次：`target`有可能大于`MAXNUMBER * m`，因此必须加判断。

## 1982. Find Array Given Subset Sums

全球只有50人做出来。我思索了半个小时，仍然没有头绪。果断放弃帮npy做可乐鸡翅。虽然没有AK，但吃上了可口的鸡。

赛后果然参考了[零神的题解](https://leetcode-cn.com/problems/find-array-given-subset-sums/solution/cong-zi-ji-de-he-huan-yuan-shu-zu-by-lee-aj8o/), yyds.
