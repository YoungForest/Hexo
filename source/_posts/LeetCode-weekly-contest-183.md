---
title: LeetCode weekly contest 183
date: 2020-04-07 12:33:13
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (4) |	Q3 (6) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 91 / 12542 |	YoungForest | 	21 | 0:39:07 | 0:09:24 |  0:15:33 |  0:29:53 | 0:39:07 |

本周又是手速场，足足有800人AK。可能是由于疫情的原因，程序员都wfh（work from home），每次周赛的参加人数都稳步上涨，比我刚回国的时候已经增加一个一倍了。rating掉了有一个月了，这周终于涨上来了，2187，恢复到了最高点。

## 1403. Minimum Subsequence in Non-Increasing Order

贪心。先排序，试图选大的值，直到累计和超过一半。

时间复杂度: O(N log N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<int> minSubsequence(vector<int>& nums) {
        sort(nums.begin(), nums.end(), greater<int>());
        int sumAll = accumulate(nums.begin(), nums.end(), 0);
        vector<int> ans;
        int sumCurrent = 0;
        for (int i : nums) {
            ans.push_back(i);
            sumCurrent += i;
            if (sumCurrent > sumAll / 2) {
                return ans;
            }
        }
        return ans;
    }
};
```

## 1404. Number of Steps to Reduce a Number in Binary Representation to One

用字符串模拟“加一”操作，直到为1.
这里我用了一个list来存字符，以方便进位操作。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int numSteps(string s) {
        list<char> l(s.begin(), s.end());
        int ans = 0;
        while (l.size() > 1) {
            if (l.back() == '1') {
                auto it = l.rbegin();
                for (;it != l.rend(); ++it) {
                    if (*it == '0') {
                        *it = '1';
                        goto endIf;
                    } else {
                        *it = '0';
                    }
                }
                l.push_front('1');
                endIf: ;
            } else {
                l.pop_back();
            }
            ++ans;
        }
        return ans;
    }
};
```

## 1405. Longest Happy String

贪心。每次试图用剩余最多的字符。

时间复杂度: O(a + b + c),
空间复杂度: O(a + b + c).

```cpp
class Solution {
public:
    string longestDiverseString(int a, int b, int c) {
        // greedy
        string ans;
        vector<int> count = {a, b, c};
        auto maxChar = [&](const vector<int>& mask) -> int {
            int ans = -1;
            for (int i = 0; i < count.size(); ++i) {
                if (mask[i] == 0 && (ans == -1 || count[i] > count[ans])) {
                    ans = i;
                }
            }
            return ans;
        };
        while (count[0] > 0 || count[1] > 0 || count[2] > 0) {
            int nextChar = -1;
            vector<int> mask(3, 0);
            if (ans.size() >= 2 && ans[ans.size() - 1] == ans[ans.size() - 2]) {
                mask[ans[ans.size() - 1] - 'a'] = 1;
                nextChar = maxChar(mask);
            } else {
                nextChar = maxChar(mask);
            }
            if (count[nextChar] == 0) {
                return ans;
            }
            ans.push_back('a' + nextChar);
            --count[nextChar];
        }
        return ans;
    }
};
```

## 1406. Stone Game III

DP。
f(x): 以x开头，先手最优情况下获得的分数。
因为2个人都以最优策略执行, 所以
```
f(x) = max(剩余所有和 - f(x + 1),
剩余所有和 - f(x + 2),
剩余所有和 - f(x + 3)).
```
Alice获得的最大分数为`f(0)`.

时间复杂度: O(N),
空间复杂度: O(N).

```python
class Solution:
    def stoneGameIII(self, stoneValue: List[int]) -> str:
        @lru_cache(None)
        def suffixFunction(x: int) -> int:
            if x == len(stoneValue):
                return 0
            else:
                return stoneValue[x] + suffixFunction(x + 1)
            
        @lru_cache(None)
        def f(x: int) -> int:
            if x >= len(stoneValue):
                return 0
            else:
                suffix = suffixFunction(x)
                return max(suffix - f(x + 1), suffix - f(x + 2), suffix - f(x + 3))
        alice = f(0)
        bob = suffixFunction(0) - alice
        if alice == bob:
            return 'Tie'
        elif alice > bob:
            return 'Alice'
        else:
            return 'Bob'
```

## 后记

今天翻到很久之前写的contest的博客，大概一年多前准备Google电话面试的时候。当时还是很菜的，一般能做出2题就差不多了。谷歌的面试也挂在了第一轮，就问了个加油站问题 和 最近公共祖先问题。都答的不是很好。现在看来都是不难的题目。遗憾当时准备不足，水平也有限。一年过后，同样面对Google的面试，虽回答的不完美，但也通过了第一轮面试。我从18年底开始大量刷题，现在做了有900+道了，contest也参加了50+，算法水平还是有可见的进步的。虽然离大佬的差距依旧很大。
不过由于疫情的原因，application并没有继续进行下去。HR只说是招聘流程有变化。和残酷刷题群的群友交流，美国那边很多New Graduate和intern的招聘都停了，原来发的offer很多也收回了，或者work from home。谷歌中国不会也这样吧。
之前只知道就业形势一年不如一年，没想到今年这么糟糕呀。实习、毕业都成问题。