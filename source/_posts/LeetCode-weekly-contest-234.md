---
title: LeetCode weekly contest 234
date: 2021-03-28 11:42:25
tags:
- LeetCode
categories:
- Programming
---


| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 672 / 12421 | YoungForest | 19 | 1:19:08 | 0:12:04  2 | 0:23:51 | 0:29:26 | 0:54:08  3 |

又要打卡了，已经连续5周残酷打卡了。而且确实自己本次做题没觉得多简单，WA5次，心态爆炸，但是排名却不理想。感觉还是LeetCode越来越卷了。

## 1805. Number of Different Integers in a String

本题其实用Python做会好很多，实现起来更快。Python对字符串和大整数的优势还是无可比拟的。
我还是坚持用C++ 完成，各种字符串不熟悉和不方便的操作。WA了2发。

```cpp
class Solution {
public:
    int numDifferentIntegers(string word) {
        for (char& c : word) {
            if (!isdigit(c)) {
                c = ' ';
            }
        }
        while (!word.empty() && word.back() == ' ') {
            word.pop_back();
        }
        if (word.empty()) return 0;
        std::istringstream is(word);
        unordered_set<string> ans;
        while (is)
        {
            string s;
            is >> s;
            reverse(s.begin(), s.end());
            while (s.size() > 1 && s.back() == '0') {
                s.pop_back();
            }
            // cout << "xx : " << s << endl;
            if (s.empty()) continue;
            ans.insert(s);
        }
        return ans.size();
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

## 1806. Minimum Number of Operations to Reinitialize a Permutation

本题我是倒着思考的，
操作的拟操作是 技术位置到后半段，偶数位置到前半段。
而且观察变化的过程，只需要关注一个数，如果他回到原位置，剩下所有的数都会回到原位置。

```cpp
class Solution {
    // operation: odd to half second, even to half first
    // [0 1 2 3 4 5] 4
    // [0 2 4 1 3 5] 3
    // [0 4 3 2 1 5] 2
    // [0 3 1 4 2 5] 1
    // [0 1 2 3 4 5] 0
    
public:
    int reinitializePermutation(int n) {
        int ans = 0;
        int index1 = 1;
        do {
            if (index1 % 2 == 1) {
                index1 = n / 2 + index1 / 2;
            } else {
                index1 = index1 / 2;
            }
            ++ans;
        } while (index1 != 1);
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1807. Evaluate the Bracket Pairs of a String

说实话，本题作为第3题，并没有相应的难度。完全可以作为签到题。
直接做即可。
知识点：字符串处理 + 字典/Map.

```cpp
class Solution {
public:
    string evaluate(string s, vector<vector<string>>& knowledge) {
        unordered_map<string, string> m;
        for (const auto& v : knowledge) {
            m[v[0]] = v[1];
        }
        string word;
        bool left = false;
        string ans;
        for (char c : s) {
            if (c == '(') {
                left = true;
            } else if (c == ')') {
                left = false;
                auto it = m.find(word);
                if (it == m.end()) {
                    ans.push_back('?');
                } else {
                    ans.append(it->second);
                }
                word.clear();
            } else {
                if (left) {
                    word.push_back(c);
                } else {
                    ans.push_back(c);
                }
            }
        }
        return ans;
    }
};
```

时间复杂度: O(s.size() + knowledge.size() * (knowledge[i][0].size() + knowledge[i][1].size())),
空间复杂度: O(s.size() + knowledge.size() * (knowledge[i][0].size() + knowledge[i][1].size())).

## 1808. Maximize Number of Nice Divisors

问题可以转换成 确定和，最大化乘积。

sum 确定是primeFactors。然后好因子的数目就是乘积，也就是题目里最大化的目标。
因为你观察好因子其实是每个质因数数目的乘积。

在Google上搜索`fix sum max multiplication`，第3条就有Geekforgeek的一个类似问题[Breaking an Integer to get Maximum Product](https://www.geeksforgeeks.org/breaking-integer-to-get-maximum-product/). 其实LeetCode上也有原题[343](https://leetcode-cn.com/problems/integer-break/).
我试图照搬它的代码，然而有2个地方不同：
- geekforgeek上必须break，不能作为一个整体。而本题是可以不break的。这个涉及到特殊case, 即primeFactors = 2 或 3时，应改为返回 n.
- geekforgeek上的代码采用一个for loop * 3. 时间复杂度是 O(n / 3). 在本题会超时。我自己写了`pow`以更快的方式*3，时间复杂度是 O(log n)。其实是[LeetCode 50 Pow(x, n)](https://leetcode-cn.com/problems/powx-n/).

```cpp
class Solution {
    using ll = long long;
    const ll MOD = 1e9 + 7;
    // https://www.geeksforgeeks.org/breaking-integer-to-get-maximum-product/
    /* The main function that returns the max possible product */
    ll mypow(ll a, ll b) {
        // a ^ b
        if (b == 0) {
            return 1;
        } else if (b % 2 == 1) {
            return (mypow(a, b - 1) * a) % MOD;
        } else {
            auto x = mypow(a, b/2);
            return (x * x) % MOD;
        }
    }
    int maxProd(ll n)
    {
       // n equals to 2 or 3 must be handled explicitly
       if (n == 2 || n == 3) return n;

       // Keep removing parts of size 3 while n is greater than 4
       ll res = 1;
       // while (n > 4)
       // {
       //     n -= 3;
       //     res = (res * 3) % MOD; // Keep multiplying 3 to res
       // }
        // 4 0
        // 5 1
        // 6 1
        // 7 1
        // 8 2
        if (n >= 5) {
            const int step = ((n - 5) / 3 + 1);
            res = mypow(3, step);
            n -= step * 3;
        }
       return (n * res) % MOD; // The last part multiplied by previous parts
    }
public:
    int maxNiceDivisors(int primeFactors) {
        return maxProd(primeFactors);
    }
};
```

时间复杂度: O(log n),
空间复杂度: O(1).