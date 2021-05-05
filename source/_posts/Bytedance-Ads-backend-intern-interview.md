---
title: 字节跳动 暑期实习 广告系统后端开发 面试
date: 2020-02-27 18:34:40
tags:
- ByteDance
- intern
categories:
- interview
---

* HashMap
* 数据库
    * 索引、优化、事务
    * 聚簇索引和非聚簇索引
* 并发编程
* 网络编程，RPC
* 算法题:
    * 编辑距离


算法题问了一道计算[编辑距离(Levenshtein Distance)](https://en.wikipedia.org/wiki/Levenshtein_distance)的问题。编辑距离的问题恰好我在之前度《图解算法》的时候有所涉及，用DP解决即可。但本题目稍微复杂度写，需要在很多字符串中，寻找距离最近的字符串。可以理解为"Fuzzy matching"。
题面大概为：
```
莱文斯坦距离，又称 Levenshtein 距离，是编辑距离的一种。指两个字串之间，由一个转成另一个所需的最少编辑操作次数。
允许的编辑操作包括：
插入一个字符
删除一个字符
将一个字符替换成另一个字符
需要你编写一个程序，实现以下功能：
给定一个字符串集合 S 以及一个模板串 P，从 S 中找出与 P 莱文斯坦距离最小的字符串 T，输出 T 以及其对应的编辑距离 D。如果 S 中出现多个满足条件的字符串，则取按字典序排列的第一个。
```

并没有想到很好的解法，暴力解法的话, 比较所有字符串和P的距离 时间复杂度为: O(P.size() * sum(S_i.size()).

后在网上搜索解法，并不难找到。利用Trie以避免不同字符串的DP重复的计算，时间复杂度为: O(P.size() * Trie的节点数). 虽然最坏时间复杂度没有变好，但是实实在在的优化。应该这就是面试官想要的解法了。

```cpp
#include 
#include 
#include 
#include 
#include 
#include 

using namespace std;

struct Node {
    array, 26> children;
    vector distance;
    Node() = delete;
    Node(int n) {
        distance.resize(n);
    }
};

pair solve(const string& target, const vector& s) {
    const int k = target.size() + 1;
    auto root = make_shared(k);
    for (int i = 0; i distance.size(); ++i) {
        root->distance[i] = i;
    }
    int ans_distance = 0x3f3f3f3f,  ans_index = -1;
    for (int j = 0; j < s.size(); ++j) {
        const string& str = s[j];
        auto current = root;
        // cout << endl << "debug: " << str << endl;
        int distance_from_empty = 0;
        for (char c : str) {
            if (current->children[c - 'a'] == nullptr) {
                current->children[c - 'a'] = make_shared(k);
                auto next_current = current->children[c - 'a'];
                next_current->distance[0] = distance_from_empty;
                for (int i = 1; i < k; ++i) {
                    if (c == target[i - 1]) {
                        next_current->distance[i] = current->distance[i - 1];
                    } else {
                        next_current->distance[i] = min({
                            current->distance[i - 1],
                            current->distance[i],
                            next_current->distance[i - 1]
                        }) + 1;
                    }
                    // cout distance[i] << " ";
                }
                // cout << endl;
            }
            current = current->children[c - 'a'];
            ++distance_from_empty;
        }
        if (current->distance[k - 1] < ans_distance) {
            ans_distance = current->distance[k - 1];
            ans_index = j;
        } else  if (current->distance[k - 1] == ans_distance) {
            if (s[ans_index] > s[j])
                ans_index = j;
        }
    }
    return {ans_distance, s[ans_index]};
}

int main() {
    string P;
    cin >> P;
    int N;
    cin >> N;
    vector S(N);
    for (int i = 0; i < N; ++i) {
        cin >> S[i];
    }
    auto ans = solve(P, S);
    cout << ans.first << endl;
    cout << ans.second << endl;
    return 0;
}
```