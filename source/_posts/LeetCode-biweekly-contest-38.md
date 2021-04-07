---
title: LeetCode biweekly contest 38
date: 2020-11-01 08:56:43
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 318 / 7446 | YoungForest | 18 | 1:07:29 | 0:12:38 | 0:16:42 |  0:57:29  2 |  0:41:26 |

## 5539. Sort Array by Increasing Frequency

签到题。按照题意先统计频数，再按频数排序即可。

```cpp
class Solution {
public:
    vector<int> frequencySort(vector<int>& nums) {
        unordered_map<int, int> cnt;
        for (int i : nums) {
            ++cnt[i];
        }
        using pii = pair<int,int>;
        vector<pii> frequency;
        for (const auto& p : cnt) {
            frequency.emplace_back(p.second, p.first);
        }
        sort(frequency.begin(), frequency.end(), [&](const auto& a, const auto& b) -> bool {
            if (a.first == b.first) {
                return a.second > b.second;
            } else {
                return a.first < b.first;
            }
        });
        vector<int> ans;
        for (const auto& p : frequency) {
            for (int i = 0; i < p.first; ++i) {
                ans.push_back(p.second);
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(N).

## 5540. Widest Vertical Area Between Two Points Containing No Points

虽然看起来很复杂，但其实就是一个按x排序，找最大间隔。题目故意说难了，绕了大家一圈。

```cpp
class Solution {
public:
    int maxWidthOfVerticalArea(vector<vector<int>>& points) {
        const int n = points.size();
        vector<int> x;
        x.reserve(n);
        for (const auto& v : points) {
            x.push_back(v[0]);
        }
        sort(x.begin(), x.end());
        int ans = 0;
        int lastx = x[0];
        for (int i = 1; i < n; ++i) {
            ans = max(ans, x[i] - lastx);
            lastx = x[i];
        }
        return ans;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(N).

## 5541. Count Substrings That Differ by One Character

这道题也是暴力。但一开始想复杂了，以为暴力是N^4（其实是N^3)。就跳过先做第四题了。回来后，仍然试图用所谓的25*N^3的算法做，TLE了2次。经舍友提醒，想恍然大悟，原来真是暴力。

```cpp
class Solution {
public:
    int countSubstrings(string s, string t) {
        int ans = 0;
        for (int si = 0; si < s.size(); ++si) {
            for (int sj = 1; si + sj <= s.size(); ++sj) {
                for (int ti = 0; ti < t.size(); ++ti) {
                    if (ti + sj > t.size()) break;
                    int diff = 0;
                    for (int x = 0; x < sj; ++x) {
                        if (s[si + x] != t[ti + x]) {
                            ++diff;
                            if (diff > 1) goto end;
                        }
                    }
                    if (diff == 1) ++ans;
                    end:;
                }
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N^3),
空间复杂度: O(1).

## 5542. Number of Ways to Form a Target String Given a Dictionary

经典DP。`dp(begin, i)`表示可以从`words`的第`begin`个字符开始，组成`target[i：]`的方案数。
状态转移方程为:
`dp(begin, i) = dp(begin + 1, i + 1) * (target[i]在words[j][begin]中出现的次数) + dp(begin + 1, i)`

```python
class Solution:
    def numWays(self, words: List[str], target: str) -> int:
        MOD = int(10**9 + 7)
        n = len(words[0])
        dictionary = defaultdict(lambda : defaultdict(int))
        for w in words:
            for i in range(n):
                dictionary[i][w[i]] += 1
            
        @lru_cache(None)
        def dp(begin, i):
            if i == len(target):
                # print ('return ', begin, i)
                return 1
            if begin >= n:
                return 0
            appear = dictionary[begin][target[i]]
            # print (begin, i)
            return (dp(begin + 1, i + 1) * appear + dp(begin + 1, i)) % MOD
        return dp(0, 0)
```

时间复杂度: O(words.size() * words[0].size() + words[0].size() * target.size()),
空间复杂度: O(words[0].size() * target.size()).