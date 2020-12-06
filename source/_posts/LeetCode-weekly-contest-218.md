---
title: LeetCode weekly contest 218
date: 2020-12-06 16:45:12
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 71 / 9827 | YoungForest | 18 | 	0:48:21 | 0:03:32	 | 0:05:23 |  0:12:14 | 0:43:21  1 |


## 1678. Goal Parser Interpretation

签到题。字符串解释，通用的做法是先做词法分析得到token，然后在依次翻译。由于本题的token比较少，设定也简单，所以可以一次遍历，向前看以确定token。

```cpp
class Solution {
public:
    string interpret(string command) {
        string ans;
        for (int i = 0; i < command.size(); ++i) {
            if (command[i] == 'G') {
                ans.push_back('G');
            } else {
                if (command[i + 1] == ')') {
                    ans.push_back('o');
                    ++i;
                } else {
                    ans.push_back('a');
                    ans.push_back('l');
                    i += 3;
                }
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

据说Python 选手都是一行代码搞定。

## 1679. Max Number of K-Sum Pairs

贪心。对于每个数，找到它对应的数，然后remove掉即可。使用一个哈希表存储之前见到的数，然后找的花费就是O(1)了。

```cpp
class Solution {
public:
    int maxOperations(vector<int>& nums, int k) {
        sort(nums.begin(), nums.end());
        int ans = 0;
        unordered_map<int, int> count;
        for (int i : nums) {
            if (count[k - i] > 0) {
                ++ans;
                --count[k - i];
            } else {
                ++count[i];
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N), 代码中的排序其实是不需要的，比赛时没注意就先排序了。
空间复杂度: O(N).

## 1680. Concatenation of Consecutive Binary Numbers

Straight forward。用乘法和加法模拟拼接操作。

需要注意的是，左移操作是否可以直接取模。答案是可以的，加减乘都可以直接取模，但除法不行。
左移相当于是乘法。

```cpp
class Solution {
    using ll = long long;
    const ll MOD = 1e9 + 7;
    ll bits(ll x) {
        ll ans = 0;
        while (x > 0) {
            x = x >> 1;
            ++ans;
        }
        return ans;
    }
public:
    int concatenatedBinary(int n) {
        ll ans = 0;
        for (ll i = 1; i <= n; ++i) {
            ans = ((ans << bits(i)) + i) % MOD;
        }
        return ans;
    }
};
```

时间复杂度: O(N * log N),
空间复杂度: O(1).

## 1681. Minimum Incompatibility

本题标的是medium，但有6分，确实不大容易。
正确的做法是状态压缩DP，详见评论区。但比赛中还是有很多人AC了，包括我，都使用的是暴力的backtracking解法。因为回溯+剪枝的时间复杂度往往不好分析，所以即使通过了，心里也是没有底的。
尤其是LeetCode周赛最近加了rejudge的机制，比赛时通过并不意味着成功，所以更心虚。

我首先使用一个贪心的思路（每次都试图找最小的数加入集合）得到一个可能的解。
此时，这个解不一定是最小解，但可以用来后面的剪枝。
之后会有回溯搜索所有的解空间，构建解集合，得到最小解。

```cpp
class Solution {
public:
    int minimumIncompatibility(vector<int>& nums, int k) {
        const int n = nums.size();
        const int s = n / k;
        
        unordered_map<int, int> count;
        for (int i : nums) {
            ++count[i];
            if (count[i] > k) return -1;
        }
        auto greedy = [&]() -> int {
            int ans = 0;
            multiset<int> s(nums.begin(), nums.end());
            const int n = nums.size();
            for (int setIdx = 0; setIdx < k; ++setIdx) {
                int minValue = *s.begin();
                int maxValue = minValue;
                int current = minValue;
                s.erase(s.begin());
                int i = 1;
                while (i < n / k) {
                    auto it = s.upper_bound(current);
                    if (it == s.end()) return numeric_limits<int>::max();
                    current = *it;
                    s.erase(it);
                    maxValue = current;
                    ++i;
                }
                ans += maxValue - minValue;
            }
            return ans;
        };
        int ans = greedy();
        // if (ans != -1) return ans;
        vector<set<int>> results(k);
        vector<int> uncomp(k, 0);
        function<void(const int, const int)> backtracking = [&](const int i, const int condidate) -> void {
            if (condidate > ans) return;
            if (i == nums.size()) {
                ans = min(ans, condidate);
            } else {
                const int x = nums[i];
                for (int j = 0; j < k; ++j) {
                    if (results[j].size() < s) {
                        if (j - 1 >= 0 && results[j - 1].size() == 0) break;
                        if (results[j].find(x) == results[j].end()) {
                            const int tmpuncomp = uncomp[j];
                            results[j].insert(x);
                            uncomp[j] = *results[j].rbegin() - *results[j].begin();
                            backtracking(i + 1, condidate + uncomp[j] - tmpuncomp);
                            results[j].erase(x);
                            uncomp[j] = tmpuncomp;
                        }
                    }
                }
            }
        };
        backtracking(0, 0);
        if (ans == numeric_limits<int>::max()) return -1;
        else return ans;
    }
};
```

时间复杂度: O((k * log (n / k)) ^ N), 因为剪枝的存在，实际上运行会快些，但真正的时间复杂度不好分析。
空间复杂度: O(N).
