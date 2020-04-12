---
title: LeetCode weekly contest 184
date: 2020-04-12 20:04:46
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (4) |	Q3 (6) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 589 / 9816 |	YoungForest | 19 | 0:55:30 | 0:07:04 |  0:15:05 | 0:37:18  1 | 0:50:30 |

今天又是一轮手速场。Python告诉我们，“人生苦短，我用Python”。我有2题用Python实现，1和4。事实上，对于第3题，直接调用Python Str API更是如鱼得水，不过我当时选择了用Trie+自动机的方式实现，也活该名次掉下来。

## 1408. String Matching in an Array

签到题。使用Python Str的find函数确定是否是子字符串即可。

时间复杂度: O(words.length ^ 2 * words[i].length),
空间复杂度: O(words.length * words[i].length).

```python
class Solution:
    def stringMatching(self, words: List[str]) -> List[str]:
        ans = set()
        n = len(words)
        for i in range(n):
            for j in range(i + 1, n):
                if words[i].find(words[j]) != -1:
                    ans.add(words[j])
                if words[j].find(words[i]) != -1:
                    ans.add(words[i])
        return [i for i in ans]
```

## 1409. Queries on a Permutation With Key

用List模拟Permutation的变化。
寻找位置时使用顺序查找。

时间复杂度: O(m + queries.length * m),
空间复杂度: O(m + queries.length).

```cpp
class Solution {
public:
    vector<int> processQueries(vector<int>& queries, int m) {
        list<int> P;
        for (int i = 1; i <= m; ++i) {
            P.push_back(i);
        }
        vector<int> ans(queries.size());
        for (int i = 0; i < queries.size(); ++i) {
            auto it = P.begin();
            int position = 0;
            while (it != P.end() && *it != queries[i]) {
                ++it;
                ++position;
            }
            ans[i] = position;
            P.push_front(*it);
            P.erase(it);
        }
        return ans;
    }
};
```

Discuss中提供了一种[Fenwick Tree的解法](https://leetcode.com/problems/queries-on-a-permutation-with-key/discuss/575019/Python-Fenwick-tree-O(n-log-n))，时间复杂度: O(queries.length * log m + m * log m).

## 1410. HTML Entity Parser

自动机，用Trie维护自动机的状态转移。

时间复杂度: O(text.length),
空间复杂度: O(text.length + 1).

```cpp
class Solution {
    struct Trie {
        unordered_map<char, shared_ptr<Trie>> children;
        char replace;
        bool valid = false;
        void add(const string& s, char c, int index = 1) {
            if (index == s.size()) {
                valid = true;
                replace = c;
                return;
            }
            if (children[s[index]] == nullptr) {
                children[s[index]] = make_shared<Trie>();
            }
            children[s[index]]->add(s, c, index + 1);
        }
    };
public:
    string entityParser(string text) {
        shared_ptr<Trie> root = make_shared<Trie>();
        root->add("&quot;", '"');
        root->add("&apos;", '\'');
        root->add("&amp;", '&');
        root->add("&gt;", '>');
        root->add("&lt;", '<');
        root->add("&frasl;", '/');
        string ans;
        int  i = 0;
        while (i < text.size())  {
            if (text[i] == '&') {
                int j = i + 1;
                auto current = root;
                while (j < text.size() && current->children[text[j]] != nullptr) {
                    current = current->children[text[j++]];
                }
                if (current->valid) {
                    ans.push_back(current->replace);
                    i = j;
                } else {
                    ans.push_back(text[i++]);
                }
            } else {
                ans.push_back(text[i++]);
            }
        }
        return  ans;
    }
};
```

## 1411. Number of Ways to Paint N × 3 Grid

递归解法，一行一行地确定Paint数目。明确本行可行和上行兼容的表示方法即可。

时间复杂度: O(n),
空间复杂度: O(n) -> O(1). 最多只需要保存2行的状态即可。

```python
class Solution:
    def numOfWays(self, n: int) -> int:
        import functools
        @functools.lru_cache(None)
        def unzip(x: int) -> List[int]:
            a = x // (3*3)
            b = (x // (3)) % 3
            c = x % 3
            return [a, b, c]
        @functools.lru_cache(None)
        def row_not_valid(state: int) -> bool:
            a, b, c = unzip(state)
            return a == b or b == c
        @functools.lru_cache(None)
        def between_row_valid(a: int, b: int) -> bool:
            al = unzip(a)
            bl = unzip(b)
            return all(al[i] != bl[i] for i in range(3))
            
        @functools.lru_cache(None)
        def dp(n: int, state: int) -> int:
            if row_not_valid(state):
                return 0
            else:
                if n == 0:
                    return 1
                else:
                    ans = 0
                    for i in range(3**3):
                        if not row_not_valid(i) and between_row_valid(state, i):
                            ans += dp(n-1, i)
                    return ans
        
        ans = 0
        for i in range(3**3):
            if not row_not_valid(i):
                ans += dp(n-1, i)
        return ans % (1000000000 + 7)
```