---
title: LeetCode weekly contest 233
date: 2021-03-25 09:43:36
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 923 / 12037 | YoungForest | 13 | 1:13:09 | 0:29:59 | 0:50:24 | 1:13:09 | null |

周末和女朋友KFC，整整耽误了3场比赛。
双周赛没参加，周赛迟到半小时，紧接着参加KickStart，人已经废了。
以后打比赛还是要养精蓄锐，好好打才行。

第四题我最后其实是有思路的，无奈时间不够了。之前做过类似用Trie处理异或问题的题目，印象还挺深刻的。

<!-- more -->

## 1800. Maximum Ascending Subarray Sum

签到题。2个变量分别记录当前符合递增条件的累加值和上一个元素的值，更新最大累加值。

```cpp
class Solution {
public:
    int maxAscendingSum(vector<int>& nums) {
        int ans = 1;
        int last = 0;
        int current = 0;
        for (int i : nums) {
            if (i > last) {
                current += i;
            } else {
                current = i;
            }
            ans = max(ans, current);
            last = i;
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1801. Number of Orders in the Backlog

用`TreeMap`维护price和数量的 key, value. 按照题意进行更新即可。

```cpp
template <typename A, typename B>
ostream& operator <<(ostream& out, const pair<A, B>& a) {
  out << "(" << a.first << "," << a.second << ")";
  return out;
}
template <typename U, typename T, class Cmp>
ostream& operator <<(ostream& out, const map<U, T, Cmp>& a) {
  out << "{"; bool first = true;
  for (auto& p : a) { out << (first ? "" : ", "); out << p.first << ":" << p.second; first = 0;} out << "}";
  return out;
}
class Solution {
    using ll = long long;
    const int MOD = 1e9 + 7;
public:
    int getNumberOfBacklogOrders(vector<vector<int>>& orders) {
        // 0 buy 1 sell
        map<int, ll> buy, sell;
        for (const auto & v : orders) {
            int price = v[0], amount = v[1];
            if (v[2] == 0) {
                // buy
                for (auto& p : sell) {
                    if (amount <= 0 || p.first > price) break;
                    if (p.second >= amount) {
                        p.second -= amount;
                        amount = 0;
                    } else {
                        amount -= p.second;
                        p.second = 0;
                    }
                }
                while (!sell.empty() && sell.begin()->second == 0) {
                    sell.erase(sell.begin());
                }
                if (amount > 0) {
                    buy[price] += amount;
                }
            } else {
                // sell
                for (auto it = buy.rbegin(); it != buy.rend(); ++it) {
                    auto& p = *it;
                    if (amount <= 0 || p.first < price) break;
                    if (p.second >= amount) {
                        p.second -= amount;
                        amount = 0;
                    } else {
                        amount -= p.second;
                        p.second = 0;
                    }
                }
                while (!buy.empty() && buy.rbegin()->second == 0) {
                    buy.erase(prev(buy.end()));
                }
                if (amount > 0) {
                    sell[price] += amount;
                }
            }
        }
        ll ans = 0;
        // cout << buy << endl;
        // cout << sell << endl;
        for (const auto& p : buy) {
            ans = (ans + p.second) % MOD;
        }
        for (const auto& p : sell) {
            ans = (ans + p.second) % MOD;
        }
        return ans;
    }
};
```

时间复杂度: O(orders.length * log orders.length),
空间复杂度: o(orders.length).

## 1802. Maximum Value at a Given Index in a Bounded Array

二分搜索。将最优化问题转化成判定问题。
限定最大值后，使用等差数列求和计算总和。


```cpp
class Solution {
    using ll = long long;
public:
    int maxValue(int n, int index, int maxSum) {
        // peek, peek - 1, ..., 1
        // Sn=n*a1+n(n-1)d/2
        // Sn=n(a1+an)/2
        auto oneSide = [&](const ll peek, const ll index) -> ll {
            if (index + 1 >= peek) {
                return ((peek) * (peek + 1) / 2) + index + 1 - peek;
            } else {
                return (index + 1) * peek + (index + 1) * (index) * (-1) / 2;
            }
        };
        // 0 1 2 3 4 5
        // n = 6
        // index = 2
        auto sumOf = [&](const ll peek) -> ll {
            // cout << "oneSide " << oneSide(peek, index) << " " << oneSide(peek, n - index - 1) << endl;
            return oneSide(peek, index) + oneSide(peek, n - index - 1) - peek;
        };
        // first true
        auto binary = [&](ll lo, ll hi, function<bool(const ll)> predicate) -> ll {
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
        // f f f t t t
        // cout << sumOf(3) << " "<< sumOf(2) << " " << sumOf(1) << endl;
        return binary(1, 1e9 + 7, [&](const ll x) -> bool {
            return sumOf(x) > maxSum;
        }) - 1;
    }
};
```

时间复杂度: O(log maxSum),
空间复杂度: O(1).

## 1803. Count Pairs With XOR in a Range

类似的题目 LC 421 1707.
使用Trie以解决XOR异或问题。时间复杂度一般为 O(31 * N).

```cpp
class Solution {
    struct Trie {
        array<Trie*, 2> children;
        int count = 0;
    };
    const int MAX_BIT = 16;
public:
    int countPairs(vector<int>& nums, int low, int high) {
        const int n = nums.size();
        Trie *root = new Trie();
        for (int i : nums) {
            auto current = root;
            for (int k = MAX_BIT; k >= 0; --k) {
                if (current->children[(i >> k) & 1] == nullptr) {
                    current->children[(i >> k) & 1] = new Trie();
                }
                current = current->children[(i >> k) & 1];
                current->count += 1;
            }
        }
        auto countLessThan = [&](const int target) -> int {
            int ans = 0;
            for (int i : nums) {
                auto current = root;
                for (int k = MAX_BIT; k >= 0 && current; --k) {
                    const int x = (i >> k) & 1;
                    const int y = (target >> k) & 1;
                    if (y == 1) {
                        if (current->children[x]) {
                            ans += current->children[x]->count;     // take all xor = zero
                        }
                        current = current->children[1 - x];
                    } else {
                        current = current->children[x];
                    }
                }
            }
            return ans;
        };
        return (countLessThan(high + 1) - countLessThan(low)) / 2;
        
    }
};
```

时间复杂度: O(16 N),
空间复杂度: O(16 N).