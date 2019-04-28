---
title: LeetCode weekly contest 133
date: 2019-04-21 20:50:55
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (5) |	Q4 (5)|
|--|--|--|--|--|--|--|--|
|864 / 4860	|	YoungForest |	14 | 	1:10:35 | 0:42:32 | 0:54:38 |	1:10:35 | null |

本周的题目相比前几周质量有了不少提升，水题减少，考察的算法知识也更多。即使是前2题是easy题，也考察了足够的编程能力。本次比赛由于一开始肚子疼耽误了半个小时，所以开始的比较晚。最后一题其实差一点是可以AC的。总的方向是对的，即使用`Trie`单词树。但最后10min时提交后，TLE，也没时间改了。单词树的构造方向走反了，对于匹配问题，我们可以从前向后，也可以从后向前。这道题从后向前不仅实现起来更简单，时间上也会更好些(即使最坏情况的时间复杂度是一样的)。

## 1030. Matrix Cells in Distance Order
Intuition:
根据距离对所有格子进行排序。
这里我是用了treemap，可以插入后保持有序。你也可以构造一个vector，然后再排序。
时间复杂度：O(R * C * log (R*C)).
空间复杂度：O(R * C).

```cpp
class Solution {
public:
    vector<vector<int>> allCellsDistOrder(int R, int C, int r0, int c0) {
        multimap<int, pair<int, int>> distance;
        for (int i = 0; i < R; ++i) {
            for (int j = 0; j < C; ++j) {
                distance.insert({abs(r0 - i) + abs(c0 - j), {i, j}});
            }
        }
        vector<vector<int>> ret;
        for (const auto& item : distance) {
            ret.push_back(vector<int> { item.second.first, item.second.second});
        }

        return ret;
    }
};
```

刚开始试图直接构造出结果，但发现不是很好写。果断放弃，不过还是耽误了些时间。
看了discuss后，发现主流的解法还是从构造出发的。不过用了标准的BFS，会好写的多。

## 1029. Two City Scheduling

Intuition:
贪心。
因为每个人肯定要被派到一个城市，而且结果是求最小花费和。
所以以每个人的不同城市的花费之差为标准进行排序，前一半去A，后一半去B即可。

时间复杂度: O(N log N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int twoCitySchedCost(vector<vector<int>>& costs) {
        sort(costs.begin(), costs.end(), [](const vector<int>& lhs, const vector<int>& rhs) -> bool {
            return lhs[1] - lhs[0] > rhs[1] - rhs[0];
        });
        int N = costs.size() / 2;
        
        int ret = 0;
        for (int i = 0; i < N; ++i) {
            ret += costs[i][0];
        }
        for (int i = N; i < 2*N; ++i) {
            ret += costs[i][1];
        }
        return ret;
    }
};
```

## 1031. Maximum Sum of Two Non-Overlapping Subarrays

Intuition: 
稍微有些暴力，计算所有长度L和M的子数组的和，然后挑出不重合的最大的一对。

时间复杂度: O(N ^ 2)
空间复杂度: O(N)

```cpp
class Solution {
public:
    int maxSumTwoNoOverlap(vector<int>& A, int L, int M) {
        const int n = A.size();
        vector<int> sum_l(n, 0);
        vector<int> sum_m(n, 0);
        
        int current_sum = accumulate(A.begin(), A.begin() + L, 0);
        sum_l.at(0) = current_sum;
        for (int i = 1; i <= n - L; ++i) {
            current_sum += A[i + L - 1] - A[i - 1];
            sum_l.at(i) = current_sum;
        }
        
        current_sum = accumulate(A.begin(), A.begin() + M, 0);
        sum_m.at(0) = current_sum;
        for (int i = 1; i <= n - M; ++i) {
            current_sum += A[i + M - 1] - A[i - 1];
            sum_m.at(i) = current_sum;
        }
        
        int ret = 0;
        for (int i = 0; i <= n - L; ++i) {
            for (int j = i + L; j <= n - M; ++j) {
                ret = max(ret, sum_l.at(i) + sum_m.at(j));
            }
        }
        for (int i = 0; i <= n - M; ++i) {
            for (int j = i + M; j <= n - L; ++j) {
                ret = max(ret, sum_m.at(i) + sum_l.at(j));
            }
        }
        
        return ret;
    }
};
```

One pass的解决方案，思想是 DP。
时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int maxSumTwoNoOverlap(vector<int>& A, int L, int M) {
        for (int i = 1; i < A.size(); ++i) {
            A[i] += A[i - 1];
        }
        // Lmax: 从头到当前位置再向前跳M个元素的子数组中，长度为L的子数组的最大和
        // Mmax: ... ... . .  .. . L ..   . . ..  . ..  .M.. ...
        int ret = A[L + M - 1], Lmax = A[L - 1], Mmax = A[M - 1];
        for (int i = L + M; i < A.size(); ++i) {
            Lmax = max(Lmax, A[i - M] - A[i - M - L]);
            Mmax = max(Mmax, A[i - L] - A[i - L - M]);
            ret = max({ret, A[i] - A[i - M] + Lmax, A[i] - A[i - L] + Mmax});
        }
        
        return ret;
    }
};
```

## 1032. Stream of Characters

Intuition:
单词树可以很好的解决此类字符串匹配查询问题。
从后向前匹配，更符合直觉，时间上也会好一点，实现起来也更简单。

时间复杂度: 构造 O(words.length * word.length), 查询 O(word.length).
空间复杂度: 最差 O(words.length * word.length).

```cpp
class StreamChecker {
    // 单词树
    struct Trie {
        vector<shared_ptr<Trie>> data = vector<shared_ptr<Trie>>(26);
        bool value = false;
    };
    shared_ptr<Trie> root = make_shared<Trie>();
    vector<char> history;
public:
    StreamChecker(vector<string>& words) {
        for (const auto& word : words) {
            shared_ptr<Trie> t = root;
            for (int i = word.size() - 1; i >= 0; --i) {
                char c = word[i];
                if (t->data[c - 'a'] == nullptr)
                    t->data[c - 'a'] = make_shared<Trie>();
                t = t->data[c - 'a'];
            }
            t->value = true;
        }
    }
    
    bool query(char letter) {
        history.push_back(letter);
        shared_ptr<Trie> current = root;
        if (current->value)
            return true;
        for (int i = history.size() - 1; i >= 0; --i) {
            char c = history[i];
            if (current->data[c - 'a'] != nullptr) {
                current = current->data[c - 'a'];
            } else {
                return false;
            }
            if (current->value)
                return true;
        }
        return false;
    }
};

/**
 * Your StreamChecker object will be instantiated and called as such:
 * StreamChecker* obj = new StreamChecker(words);
 * bool param_1 = obj->query(letter);
 */
```

## 后记

自从春节被快手师兄问C++新特性后，已经过去2个半月了。这期间，我看了《C++ Primer》，正在看《Effective Modern C++》，《C++ Concurrency in Action》。自信对新特性有了更多的了解，也在尝试更多地参与C++的项目，把C++当作自己的主语言来发展。希望在明年找工作的时候能有所核心竞争力。