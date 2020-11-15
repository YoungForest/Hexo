---
title: LeetCode biweekly contest 39
date: 2020-11-15 09:56:39
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 688 / 6047 | YoungForest | 7 | 0:16:02 | 0:03:44 | 0:11:02  1 |  null |  0:41:26 |

本周双周赛难度还是很大的，虽然是3456，但三四题我觉得不止5/6分。当然我也只做出前2题。三四题只试图用暴力解法做，但事实证明虽然很接近正确答案了，但还是全部TLE了。

## 5550. Defuse the Bomb

签到题。使用辅助数组，按照题目要求填充即可。

```cpp
class Solution {
public:
    vector<int> decrypt(vector<int>& code, int k) {
        const int n = code.size();
        vector<int> ans(n, 0);
        if (k == 0) {
            return ans;
        } else if (k > 0) {
            for (int i = 0; i < n; ++i) {
                for (int j = 1; j <= k; ++j) {
                    ans[i] += code[(i + j) % n];
                }
            }
            return ans;
        } else {
            k = -k;
            for (int i = 0; i < n; ++i) {
                for (int j = 1; j <= k; ++j) {
                    ans[i] += code[(i - j + n) % n];
                }
            }
            return ans;
        }
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

## 5551. Minimum Deletions to Make String Balanced

枚举每个分割点，删除分割点前所有的b，和分割点后所有的a。找到最小删除数。

```cpp
class Solution {
public:
    int minimumDeletions(string s) {
        const int n = s.size();
        int ans = n;
        const int totalA = count_if(s.begin(), s.end(), [](char c) -> bool {
            return c == 'a';
        });
        int a = 0, b = 0;
        for (int i = 0; i < n; ++i) {
            ans = min(ans, b + totalA - a);
            if (s[i] == 'a') ++a;
            else ++b;
        }
        ans = min(ans, b + totalA - a);
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1654. Minimum Jumps to Reach Home

算最少步数用BFS。然而，本题的关键在于如何控制状态空间，即避免一直向右走。比较自然的想法是有一个临界值，超过这一临界值后，只能向左走。关于临界值的确定，可以参考[残酷群主的解说](https://github.com/wisdompeak/LeetCode/tree/master/BFS/1654.Minimum-Jumps-to-Reach-Home)。

```cpp
class Solution {
public:
    int minimumJumps(vector<int>& forbidden, int a, int b, int x) {
        using pii = pair<int, bool>; // location, backward
        unordered_set<int> blocks;
        for (int i : forbidden) blocks.insert(i);
        queue<pii> q;
        set<pii> seen;
        q.push({0, false});
        seen.insert({0, false});
        const int limits = max(x, *max_element(forbidden.begin(), forbidden.end())) + b;
        int level = 0;
        while (!q.empty()) {
            const int s = q.size();
            for (int i = 0; i < s; ++i) {
                auto [location, back] = q.front();
                // cout << location << " " << back << endl;
                q.pop();
                if (location == x) return level;
                if (location <= limits) {
                    // forward
                    const int nextLocation = location + a;
                    if (blocks.find(nextLocation) == blocks.end() && seen.find({nextLocation, false}) == seen.end()) {
                        q.push({nextLocation, false});
                        seen.insert({nextLocation, false});
                    }
                }
                if (!back){
                    // backward
                    const int nextLocation = location - b;
                    if (nextLocation > 0 && blocks.find(nextLocation) == blocks.end() && seen.find({nextLocation, true}) == seen.end()) {
                        q.push({nextLocation, true});
                        seen.insert({nextLocation, true});
                    }
                }
            }
            ++level;
        }
        return -1;
    }
};
```

时间复杂度: O(max(x, max_forbidden) + b),
空间复杂度: O(max(x, max_forbidden) + b).

## 5553. Distribute Repeating Integers

比赛时只想到了暴力的回溯，试图通过剪枝优化，然而还是超时了。
时间复杂度为: O(50^10)，理论上就是过不了。

看了[讨论区的题解](https://leetcode-cn.com/problems/distribute-repeating-integers/solution/zi-ji-mei-ju-jing-dian-tao-lu-zhuang-ya-dp-by-arse/)才恍然大悟，这是道状态压缩DP。

[huahua的视频讲解]()也特别清楚。在这里我实现了他的python top-bottom的版本，相比bottom-top更好写一些，也更好理解。注意在集合枚举子集时，有特别的技巧。

```python
class Solution:
    def canDistribute(self, nums: List[int], quantity: List[int]) -> bool:
        cnts = list(Counter(nums).values())
        m = len(quantity)
        n = len(cnts)
        sums = [0] * (1 << m)
        for mask in range(1 << m):
            for i in range(m):
                if mask & (1 << i):
                    sums[mask] += quantity[i]
        @lru_cache(None)
        def dp(mask: int, i: int) -> bool:
            if mask == 0: return True
            if i >= n: return False
            cur = mask
            while cur:
                if sums[cur] <= cnts[i] and dp(mask ^ cur, i + 1):
                    return True
                cur = (cur - 1) & mask
            return dp(mask, i + 1)

        return dp((1 << m) - 1, 0)
```

时间复杂度: O(3^m * n),
空间复杂度: O(2^m * n).