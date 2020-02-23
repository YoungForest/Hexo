---
title: LeetCode biweekly contest 20
date: 2020-02-23 11:34:19
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 233 / 4347 |	YoungForest | 18 | 	0:41:39 | 0:03:32 |  0:13:58  1 |  0:24:13 |  0:31:39  1 |

本次比赛题目比较简单，又是一次手速和bug-free的比拼。
真的是错过比赛半年，连人数较少的双周赛都进不了前200了，吓～

## 1356. Sort Integers by The Number of 1 Bits

利用C++标准库中的排序函数和lambda表达式。

时间复杂度: O(n log n),
空间复杂度: O(1).

```cpp
class Solution {
public:
    vector<int> sortByBits(vector<int>& arr) {
        sort(arr.begin(), arr.end(), [](const auto& a, const auto& b) -> bool {
            auto aa = __builtin_popcount(a);
            auto bb = __builtin_popcount(b);
            if (aa == bb) {
                return a < b;
            } else {
                return aa < bb;
            }
        });
        return arr;
    }
};
```

## 1357. Apply Discount Every n Orders

考察对数据结构的熟悉程度。根据题意直接实现即可。
因为读题不仔细，把discount的定义搞错了（是减价多少，而不是剩下多少），导致了一次错误提交。

时间复杂度：O(product.length),
空间复杂度：O(getBill.length).

```cpp
class Cashier {
    unordered_map<int, int> m;
    int d;
    int nn;
    int index = 0;
public:
    Cashier(int n, int discount, vector<int>& products, vector<int>& prices) {
        d = discount;
        nn = n;
        for (int i = 0; i < products.size(); ++i) {
            m[products[i]] = prices[i];
        }
        index = 0;
    }
    
    double getBill(vector<int> product, vector<int> amount) {
        ++index;
        bool discount = false;
        if (index == nn) {
            index = 0;
            discount = true;
        }
        double ans = 0;
        for (int i = 0; i < product.size(); ++i) {
            ans += amount[i] * m[product[i]];
        }
        if (discount)
            ans *= 1 - d / 100.0;
        return ans;
    }
};

/**
 * Your Cashier object will be instantiated and called as such:
 * Cashier* obj = new Cashier(n, discount, products, prices);
 * double param_1 = obj->getBill(product,amount);
 */
```

## 1358. Number of Substrings Containing All Three Characters

滑动窗口。在右侧移动的时候，保持窗口最小，此时，左侧窗口的左边都是符合条件的子串。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int numberOfSubstrings(string s) {
        int right = 0, left = 0;
        vector<int> count(3, 0);
        int ans = 0;
        while (right < s.size()) {
            ++count[s[right] - 'a'];
            while (left <= right && count[s[left] - 'a'] > 1) {
                --count[s[left] - 'a'];
                ++left;
            }
            if (count[0] >= 1 && count[1] >= 1 && count[2] >= 1) {
                ans += (left + 1) * 1;
            }
            ++right;
        }
        return ans;
    }
};
```

## 1359. Count All Valid Pickup and Delivery Options

一个典型的递归问题。
对于n个物件，我们从中选择任何一个作为第一个pickup, 然后计算剩余n-1个物件的排序问题。diliver可以插入在任意位置(`2 * (n - 1) + 1`种情况)。

因为取余问题导致一次Wrong Answer，已经不是第一次了。下次需要注意。

时间复杂度: O(N),
空间复杂度: O(N) -> O(1), 使用迭代解法或尾递归解法，这里就不予展示了.

```cpp
class Solution {
    using ll = long long;
    ll mod = 1e9 + 7;
public:
    ll countOrders(int n) {
        if (n == 1) return 1;
        return (n * (countOrders(n - 1) * (2 * (n - 1) + 1)) % mod) % mod;
    }
};
```