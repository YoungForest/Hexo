---
title: LeetCode weekly contest 230
date: 2021-03-01 09:51:47
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 314 / 11654 | YoungForest | 12 | 	0:27:36 |  0:04:00 |  0:14:38 | 0:27:36 | null |

自从秋招结束后，刷题和比赛的热情与日俱减。
之前每日三题（国服、美服、残酷），现在每日0题。当然偶尔因为周赛成绩不足以免打卡，也需每日一题。
相反，比赛的反馈还是挺强的。长期有rating和排名的增长激励，短期有残酷排名和每次排名的激励，还有额外积分的奖励。另外每周比赛完还可以在残酷群里领红包，给自己加个鸡腿。

## 1773. Count Items Matching a Rule

签到题。按照题目描述便利一遍即可。

```cpp
class Solution {
public:
    int countMatches(vector<vector<string>>& items, string ruleKey, string ruleValue) {
        int index = -1;
        if (ruleKey == "type") {
            index = 0;
        } else if (ruleKey == "color") {
            index = 1;
        } else {
            index = 2;
        }
        int ans = 0;
        for (const auto& v : items) {
            if (v[index] == ruleValue) {
                ++ans;
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1774. Closest Dessert Cost

Brute force 暴力枚举即可。观察题目的数据规模，`n` 和 `m`都比较小，指数级的暴力搜索就可以过。
可以只用`回溯(backtracking)`，也可以使用3进制`bitmask`做枚举。
我比赛时采用了回溯。

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
public:
    int closestCost(vector<int>& baseCosts, vector<int>& toppingCosts, int target) {
        // time: n * (3 ^ m)
        // 10 * 3 ^ 10 59049
        // max: 10^4 + 2 * 10 * 10^4
        vector<int> candidates;
        const int m = toppingCosts.size();
        function<void(const int, const int)> backtracking = [&](const int i, const int now) -> void {
            if (i == m) {
                candidates.push_back(now);
            } else {
                for (int j = 0; j <= 2; ++j) {
                    backtracking(i + 1, now + toppingCosts[i] * j);
                }
            }
        };
        for (int base : baseCosts) {
            backtracking(0, base);
        }
        int ans = -1, diff = INF;
        for (int i : candidates) {
            const int diffI = abs(i - target);
            if (diffI < diff) {
                ans = i;
                diff = diffI;
            } else if (diffI == diff && i < ans) {
                ans = i;
            }
        }
        return ans;
    }
};
```

时间复杂度: O(n * 3 ^ m), 
空间复杂度: O(n * 3 ^ m).

## 1775. Equal Sum Arrays With Minimum Number of Operations

贪心。优先进行变化最大的操作。

```cpp
class Solution {
    struct Content {
        int sumOfAll = 0;
        vector<int> nums;
        Content() {
            nums.resize(7, 0);
        }
    };
    Content preprocess(const vector<int>& arr) {
        Content ans;
        for (int i : arr) {
            ans.sumOfAll += i;
            ++ans.nums[i];
        }
        return ans;
    }
public:
    int minOperations(vector<int>& nums1, vector<int>& nums2) {
        // 1 -> 6 6 -> 1 5
        // 2 -> 6 5 -> 1 4
        // 3
        auto c1 = preprocess(nums1);
        auto c2 = preprocess(nums2);
        if (c1.sumOfAll > c2.sumOfAll) {
            swap(c1, c2);
        }
        // c1 < c2
        int ans = 0;
        for (int i = 1; i <= 5; ++i) {
            const int j = 7 - i;
            const int cost = 6 - i;
            const int need = c2.sumOfAll - c1.sumOfAll;
            const int needStep = need / cost + ((need % cost == 0) ? 0 : 1);
            // 3 2 -> 2
            // 4 2 -> 2
            // 2 2 -> 1
            if (needStep <= c1.nums[i] + c2.nums[j]) {
                return ans + needStep;
            }
            c1.sumOfAll += c1.nums[i] * cost;
            c2.sumOfAll -= c2.nums[j] * cost;
            ans += c1.nums[i] + c2.nums[j];
        }
        return -1;
    }
};
```

时间复杂度: O(nums1.size() + nums2.size()),
空间复杂度: O(1).

## 1776. Car Fleet II

比较难的一道题目。比赛时没做出来，但是有一定的想法。可以先判断最后会分成几个车队。从后向前通过判断是否可以追上`not meeting: speed[i] > min of speed [i+1:]`，把问题先分成若干个子问题。然后在每个子问题中，通过维护一个碰撞时间的优先队列，更新汽车的状态和新的碰撞事件。时间复杂度为 O(N log N).
后来证明这个想法实现过于繁琐和容易出错。