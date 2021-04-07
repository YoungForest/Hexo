---
title: LeetCode weekly contest 185
date: 2020-04-20 11:42:21
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (4) |	Q3 (6) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 703 / 9206 |	YoungForest | 12 | 	0:36:35 |  0:10:24 | 0:22:03 | 0:31:35  1 | null |

## 1417. Reformat The String

分别统计数字和字母的个数。如果相差个数不大于1，则可以reformat。
先选多的那类。

时间复杂度: O(N),
空间复杂度: O(N). 可以用双指针的方法，节省存储数字和字母的string的空间。

```cpp
class Solution {
    string compose(const string& a, const string& b) {
        string ans;
        int ai = 0, bi = 0;
        if (a.size() > b.size())
            ans.push_back(a[ai++]);
        while (ai < a.size()) {
            ans.push_back(b[bi++]);
            ans.push_back(a[ai++]);
        }
        return ans;
    }
public:
    string reformat(string s) {
        string digit, alpha;
        for (char c : s) {
            if (c >= '0' && c <= '9') {
                digit.push_back(c);
            } else {
                alpha.push_back(c);
            }
        }
        if (digit.size() == alpha.size() || digit.size() + 1 == alpha.size() || alpha.size() + 1 == digit.size()) {
            if (digit.size() >= alpha.size()) {
                return compose(digit, alpha);
            } else {
                return compose(alpha, digit);
            }
        } else {
            return "";
        }
    }
};
```

## 1418. Display Table of Food Orders in a Restaurant

考察数据结构的使用。遍历orders，将其转换成dish->table的hashmap，同时用set存储table编号。

时间复杂度: O(orders.length * orders[i].length),
空间复杂度: O(tables.length * dishes.length).

```cpp
class Solution {
public:
    vector<vector<string>> displayTable(vector<vector<string>>& orders) {
        set<int> tables;
        map<string, unordered_map<int, int>> count;
        for (const auto& p : orders) {
            const int table_number = stoi(p[1]);
            const auto& dish = p[2];
            ++count[dish][table_number];
            tables.insert(table_number);
        }
        vector<vector<string>> ans;
        vector<string> first_row = {"Table"};
        for (const auto& p : count) {
            first_row.push_back(p.first);
        }
        ans.push_back(move(first_row));
        for (int i : tables) {
            vector<string> row;
            row.push_back(to_string(i));
            for (auto& p : count) {
                row.push_back(to_string(p.second[i]));
            }
            ans.push_back(move(row));
        }
        return ans;
    }
};
```

## 1419. Minimum Number of Frogs Croaking

有限状态机，记录处于不同位置青蛙的个数。模拟整个叫声。

时间复杂度: O(croakOfFrogs.length),
时间复杂度: O(croak.length).

```cpp
class Solution {
public:
    int minNumberOfFrogs(string croakOfFrogs) {
        vector<int> state_count(5, 0);
        unordered_map<char, int> position = {
            {'c', 0},
            {'r', 1},
            {'o', 2},
            {'a', 3},
            {'k', 4}
        };
        for (char c : croakOfFrogs) {
            if (position[c] == 0) {
                if (state_count[4] > 0) {
                    --state_count[4];
                }
                ++state_count[position[c]];
            } else {
                ++state_count[position[c]];
                if (state_count[position[c]-1] <= 0)
                    return -1;
                --state_count[position[c]-1];
            }
        }
        if (all_of(state_count.begin(), state_count.begin() + 4, [](const auto& a) -> bool {
            return a == 0;
        }))
            return state_count[4];
        else
            return -1;
    }
};
```

## 1420. Build Array Where You Can Find The Maximum Exactly K Comparisons

最近做DP的题目虽然做了很多，但遇到新的问题还是不一定能做出来。遇到的困难主要有：
- 确定dp的定义。一般情况下照搬目标就可以了，但有些题目不是。
- 确定边界条件。递归退出的条件。
- 状态转移方程，和dp的定义紧密相连。

本题中dp[i][currentMaxValue][cost]表示长度为i的数组，且数组中最大值为currentMaxValue, 递增子序列长度为cost 的数组个数。

状态转移方程 有2类：
一是i-1数组的最大值已经是currentMaxValue了。这时，我们可以在第i个位置加上[1, currentMaxValue], 而cost不变。
二是i-1数组的最大值小于currentMaxValue。此时，第i个位置必须是currentMaxValue。且之前的cost为cost-1. 需要注意的是，前面的最大值最小是cost-1，递增序列为1, ..., cost-1.

时间复杂度: O(n * m * k * (m - k)),
空间复杂度: O(n * m * k).

```python
class Solution:
    def numOfArrays(self, n: int, m: int, k: int) -> int:
        mod = 10**9 + 7
        @lru_cache(None)
        def dp(i, currentMaxValue, cost):
            if cost == 1:
                return currentMaxValue**i
            ans = 0
            # arr[i] <= currentMaxValue
            if i + 1 > cost:
                ans += dp(i-1, currentMaxValue, cost) * currentMaxValue
            # arr[i] == currentMaxValue
            ans += sum(dp(i-1, x, cost - 1) for x in range(cost - 1, currentMaxValue))
            return ans
        return sum(dp(n - 1, x, k) for x in range(k, m+1)) % mod
        # return sum(dp(length, k, x) * (x ** (n - length)) for x in range(1, m + 1) for length in range(1, n+1))
```

## 美团笔试中的一道DP题目

周四参加美团暑期实习招聘的笔试，最后一道也是DP，但当时没做出来, 其实也就那么回事。

>给2个字符串S, T. 求S的子串等于T的子序列的个数。注意，即使子串相同，但位置不同，算2种。
>S，T的长度最大为5000.

时间复杂度: (len(S) * (len(T) ^ 2)),
空间复杂度: (len(S) * len(T)).

```python
import functools
S = input()
T = input()

@functools.lru_cache(None)
def dp(i, j):
    # S[x:i], 以s[i]结尾的子串，T[:j]中子串匹配到的数目
    if i == 0:
        return sum(1 if S[i] == T[x] else 0 for x in range(0, j + 1))
    if j == 0:
        return 1 if S[i] == T[0] else 0
    ans = 0
    if T[0] == S[i]:
        ans = 1
    for x in range(1, j+1):
        if T[x] == S[i]:
            ans += dp(i-1, x-1) + 1
    return ans

mod = 1000000000 + 7
ans = sum(dp(x, len(T)-1) for x in range(0, len(S))) % mod
print(ans)
```