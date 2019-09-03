---
title: LeetCode weekly contest 152
date: 2019-09-01 19:52:40
tags:
categories:
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 111 / 5333 |	YoungForest | 	18	 | 	1:11:49 | 0:11:56  1 | 0:21:44  1 | 0:37:27 | 1:01:49 |

本期比赛由于粗心，第一题忘记考虑corner case，0的排列是1；第二题干脆upper lower写反了。获得2次罚时。否则应该可以进入前100的。题目比较简单，都是常规题目，之前的原题改改就行。

## 1175. Prime Arrangements

筛法求素数 + 排列组合。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
    using ll = long long;
    const int modulo = 1e9 + 7;
    unordered_map<int, ll> memo;
    ll A(int x) {
        if (x == 0)
            return 1;
        if (x == 1)
            return 1;
        if (memo.find(x) == memo.end()) {
            memo[x] = (x * A(x - 1)) % modulo;
        }
        return memo[x];
    }
public:
    int numPrimeArrangements(int n) {
        vector<bool> a(n + 1, true);
        int count = 0;
        for (int i = 2; i < n + 1; ++i) {
            if (a[i]) {
                ++count;
                for (int j = 2; j * i < n + 1; ++j) {
                    a[j * i] = false;
                }
            }
        }
        return (A(count) * A(n - count)) % modulo;
    }
};
```

## 1176. Diet Plan Performance

简单的滑动窗口。竟然因为粗心错了一次。

时间复杂度: O(N),
空间复杂度: O(N).


```cpp
class Solution {
public:
    int dietPlanPerformance(vector<int>& calories, int k, int lower, int upper) {
        if (k > calories.size())
            return 0;
        int sum = accumulate(calories.begin(), calories.begin() + k, 0);
        int ans = 0;
        if (sum > upper)
            ++ans;
        else if (sum < lower)
            --ans;
        for (int i = k; i < calories.size(); ++i) {
            sum = sum + calories[i] - calories[i - k];
            if (sum > upper)
                ++ans;
            else if (sum < lower)
                --ans;
        }
        return ans;
    }
};
```

## 5175. Can Make Palindrome from Substring

对回文字符串要敏感。观察有：回文串只允许一个字母的数量是奇数，没多一个替换，多2个允许的单数。

时间复杂度：O(max(s.size(), queries.size()).
空间复杂度: O(max(s.size(), queries.size()).

```cpp
class Solution {
public:
    vector<bool> canMakePaliQueries(string s, vector<vector<int>>& queries) {
        vector<int> count(26, 0);
        vector<vector<int>> prefix(s.size() + 1);
        prefix[0] = count;
        for (int i = 1; i < s.size() + 1; ++i) {
            ++count[s[i - 1] - 'a'];
            prefix[i] = count;
        }
        vector<bool> ans(queries.size());
        for (int j = 0; j < queries.size(); ++j) {
            const auto& query = queries[j];
            const auto& l = prefix[query[0]];
            const auto& r = prefix[query[1] + 1];
            int odd = 0;
            for (int i = 0; i < 26; ++i) {
                // cout << r[i] << ", " << l[i] << endl;
                int sub = r[i] - l[i];
                if (sub % 2 == 1) {
                    ++odd;
                }
            }
            ans[j] = odd <= 1 + 2 * query[2];
        }
        return ans;
    }
};
```

## 1178. Number of Valid Words for Each Puzzle

字典树的变种。

首先起码想到暴力解法，每个puzzle和每个word去匹配。时间复杂度为 O(words.length * puzzles.length), 肯定会超时。
优化方向是，整合word的信息，字典树是一个很好的数据结构。

时间复杂度: O(2^puzzles[i].length * puzzles.length, words.length * words[i].length).
空间复杂度: O(puzzles.length + min(2 ^ 26, words.length)).

```cpp
class Solution {
    struct Trie {
        shared_ptr<Trie> zero, one;
        int value = 0;
    };
    shared_ptr<Trie> root;
    int dfs(const vector<bool>& appear, int begin, shared_ptr<Trie> current, int special) {
        if (current == nullptr)
            return 0;
        if (special == begin) {
            return dfs(appear, begin + 1, current->one, special) + current->value;
        }
        if (appear[begin]) {
            return dfs(appear, begin + 1, current->zero, special) + dfs(appear, begin + 1, current->one, special) + current->value;
        } else {
            return dfs(appear, begin + 1, current->zero, special) + current->value;
        }
    }
public:
    vector<int> findNumOfValidWords(vector<string>& words, vector<string>& puzzles) {
        root = make_shared<Trie>();
        for (const string& w : words) {
            vector<bool> appear(26, false);
            for (char c : w) {
                appear[c - 'a'] = true;
            }
            auto current = root;
            for (bool b : appear) {
                if (b) {
                    if (current->one == nullptr) {
                        current->one = make_shared<Trie>();
                    }
                    current = current->one;
                } else {
                    if (current->zero == nullptr) {
                        current->zero = make_shared<Trie>();
                    }
                    current = current->zero;
                }
            }
            ++current->value;
        }
        vector<int> ans(puzzles.size());
        for (int i = 0; i < puzzles.size(); ++i) {
            const auto& puzzle = puzzles[i];
            auto current = root;
            vector<bool> appear(26, false);
            for (char c : puzzle) {
                appear[c - 'a'] = true;
            }
            ans[i] = dfs(appear, 0, root, puzzle[0] - 'a');
        }
        return ans;
    }
};
```