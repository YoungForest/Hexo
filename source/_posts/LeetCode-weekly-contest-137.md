---
title: LeetCode weekly contest 137
date: 2019-05-19 14:35:35
tags:
- Competitive Programming
categories:
- LeetCode
---

本周的题目要比以往的难，也可以说恰好考到我的知识盲区，DP问题。老实的说，我对DP问题没有过深入的研究。这次DP题目尤其多，尤其是第4题，更是可以可以用经典的**背包问题**求解。

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 576 / 4091 |	YoungForest | 13 | 	0:45:56 | 0:09:24 | 0:14:20 |	0:35:56  2 | null |

## 1046. Last Stone Weight

Intuition：
本题解法不难。我首先想到了最暴力的模拟整个smash的过程的解法。因为是签到题，暴力解也够了。
时间复杂度: O(n^2 log n)
空间复杂度: O(1)
```cpp
class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        // 模拟smash
        // sort
        // pick two heaviest
        // smash
        // n^2 log n
        while (stones.size() > 1) {
            sort(stones.begin(), stones.end());
            int n = stones.size();
            stones[n - 2] = stones[n - 1] - stones[n - 2];
            stones.pop_back();
        }
        return stones[0];
    }
};
```

但事实上，同样是模拟smash的过程，找到最大的2个石头。我用的办法是sort，该操作的时间复杂度为`O(n log n)`. 大佬们就能想到优先队列(Priority Queue), 找石头的时间复杂度为`O(log n)`. 而且我的解法并没有专门处理`x == y`的情况，虽然不会出什么问题，但确实不符合模拟过程的初衷。

### Priority queue 版本
时间复杂度：O(N log N)
空间复杂度: O(1)
```cpp
class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        priority_queue<int> pq(stones.begin(), stones.end());
        while (pq.size() > 1) {
            int y = pq.top();
            pq.pop();
            int x = pq.top();
            pq.pop();
            if (y > x)
                pq.push(y - x);
        }
        return pq.empty() ? 0 : pq.top();
    }
};
```

## 1047. Remove All Adjacent Duplicates In String
Intuition:
用栈来保存之前的数，依次读取下一个数，视条件进行remove操作。
时间复杂度: `O(N)`,
空间复杂度: `O(N)`.

```cpp
class Solution {
public:
    string removeDuplicates(string S) {
        stack<char> s;
        for (char c : S) {
            if (s.empty()) {
                s.push(c);
            } else if (s.top() == c) {
                s.pop();
            } else {
                s.push(c);
            }
        }
        string ret;
        while (!s.empty()) {
            ret.push_back(s.top());
            s.pop();
        }
        reverse(ret.begin(), ret.end());
        return ret;
    }
};
```

使用 stack 应该是该题的标准解法，大佬们也基本上都用的同样的方法。

## 1048. Longest String Chain

Intuition:
DP. 对于每个单词，遍历一遍比它短1的所有单词，更新成最大的dp+1。
时间复杂度: `O(N^2 * word.length)`
空间复杂度: `O(N)`.
其中N为`words.length`.

```cpp
class Solution {
    bool isPredecessor(const string& last, const string& current) {
        if (last.size() + 1 != current.size())
            return false;
        int flag = 0;
        for (int i = 0; i < last.size();) {
            if (last[i] == current[i + flag]) {
                ++i;
                continue;
            }
            if (flag == 0)
                ++flag;
            else
                return false;
        }
        return true;
    }
public:
    int longestStrChain(vector<string>& words) {
        vector<vector<pair<string, int>>> dp(16);
        for (const auto& s : words) {
            dp[s.size() - 1].push_back({s, 1});
        }
        // for (const auto& i : dp) {
        //     for (const auto& j : i) {
        //         cout << j.first << " ";
        //     }
        //     cout << endl;
        // }
        int ret = 1;
        for (int i = 1; i < 16; ++i) {
            int last_length = i - 1;
            const auto& last_dp = dp[last_length];
            auto& current_dp = dp[i];
            for (auto& current : current_dp) {
                for (const auto& last : last_dp) {
                    if (isPredecessor(last.first, current.first)) {
                        current.second = max(current.second, last.second + 1);
                        ret = max(ret, current.second);
                    }
                }
            }
        }
        // for (const auto& i : dp) {
        //     for (const auto& j : i) {
        //         cout << "(" << j.first << " " << j.second << "), ";
        //     }
        //     cout << endl;
        // }
        return ret;
    }
};
```

Discuss总结：大概只有2种方法，DP(bottom-top)和DFS。DFS的复杂度会更高些，需要用memoization，其实也就是top-bottom的DP。

## 1049. Last Stone Weight II

Intuition:
backtracking. 
时间复杂度：O(N!), N = 30. 所以肯定会超时。

另外，我还尝试了Greedy的方法。
但并没有找到正确的解并证明它，试了2次，都Wrong Answer了。

**正确的思路**：
考虑一个smash剩下的石头`y - x`，再次被smash，则有剩下的石头`z - (y - x) = z - y + x`。
任何一个初始的石头，如果被smash的次数是奇数，则前面是 负号，反之，正号。
所以，原始问题可以转化为 将所有石头分成2份，求2份石头差的绝对值的最小值。
该问题是经典的背包问题之一“minimum knapsack partition”。

### Solution: DP for classic knapsack problem
```cpp
class Solution {
public:
    int lastStoneWeightII(vector<int>& stones) {
        const int sum_bound = 1500;
        bitset<1500 + 1> dp {1}; // present whether the sum of group is i is possible; initial true when i == 0  
        int sumOfStones = 0;
        for (auto stone : stones) {
            sumOfStones += stone;
            for (int i = sum_bound; i >= stone; --i) {  // reverse traversal is needed, for a stone can be used only once
                dp[i] = dp[i] + dp[i - stone];
            }
        }
        int ret = numeric_limits<int>::max();
        for (int i = 0; i <= sum_bound; ++i) {
            ret = min(ret, abs(sumOfStones - dp[i]*i*2));
        }
        return ret;
    }
};
```

时间复杂度: O(sum_bound * stones.size())
空间复杂度: O(sum_bound)

C++ 中 Bitset 是内含bit 或 Boolean值且大小固定的array。对其不熟悉的同学，可以看看[《C++ 标准库 第二版》（C++ Standard library)](https://book.douban.com/subject/26419721/)这本书。我最近也在看，目的是熟悉一下C++的标准库，学习其中的智慧和用法。
除了使用Bitset外，直接使用set

## 后记

周五剁手买了一年的LeetCode Premium, 花了159刀，大概1000元RMB。
刷题走起！！！