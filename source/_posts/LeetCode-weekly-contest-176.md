---
title: LeetCode weekly contest 176
date: 2020-02-16 12:07:55
tags:
- Competitive Programming
categories:
- LeetCode
---


| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 306 / 8105 |	YoungForest | 	19 | 	1:36:07 | 0:02:47 | 0:23:09 | 0:54:53  1 | 1:26:07  1 |

本次比赛在最后关头终于AC，也是极其的惊现刺激。自从加入中国区的同学之后，我周赛的排名都很难进入前200了。比如本次就从229掉到了306。不得不承认，我国内卷之严重呀。

排名落后的主要原因在于第3题花费了很多时间调试和试，差点最后一题都没时间实现了。最近缺少练习也导致debug能力和一遍bug-free的能力急剧下降。

## 1351. Count Negative Numbers in a Sorted Matrix

利用横竖都是有序的条件，可以实现O(m + n)的计数。
和[search-a-2d-matrix-ii](https://leetcode.com/problems/search-a-2d-matrix-ii/)类似。

时间复杂度: O(m + n),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int countNegatives(vector<vector<int>>& grid) {
        int ans = 0;
        const int m = grid.size();
        const int n = grid[0].size();
        int row = 0, col = n - 1;
        while (row < m && col >= 0) {
            if (grid[row][col] < 0) {
                ans += m - row;
                --col;
            } else {
                ++row;
            }
        }
        return ans;
    }
};
```

## 1352. Product of the Last K Numbers

记录最后0的位置和累计的乘积。判断最后K个数中是否有0，如果没有的话，借助最后的乘积除以倒数第k + 1个乘积即可。

时间复杂度:
- add: O(1)
- getProduct: O(1)
空间复杂度: O(N)

```cpp
class ProductOfNumbers {
    vector<int> product;
    int zeros = 0;
    int index = 1;
public:
    ProductOfNumbers() {
        product.push_back(1);
    }
    
    void add(int num) {
        if (num == 0) {
            product.push_back(1);
            zeros = index;
        }
        else
            product.push_back(num * product.back());
        ++index;
    }
    
    int getProduct(int k) {
        int b = index - k;
        int e = index; // [b, e)
        if (zeros < b) {
            return product.back() / product[product.size() - k - 1];
        } else {
            return 0;
        }
    }
};

/**
 * Your ProductOfNumbers object will be instantiated and called as such:
 * ProductOfNumbers* obj = new ProductOfNumbers();
 * obj->add(num);
 * int param_2 = obj->getProduct(k);
 */
```

## 1353. Maximum Number of Events That Can Be Attended

贪心策略。
每次都做结束时间最早的事件。

时间复杂度: O(N log N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int maxEvents(vector<vector<int>>& events) {
        int ans = 0;
        int current_day = 1;
        multiset<int> q;
        int i = 0;
        sort(begin(events), end(events), [](const auto& a, const auto& b) -> bool {
            if (a[0] != b[0]) {
                return a[0] < b[0];
            } else {
                return a[1] < b[1];
            }
        });
        while (i < events.size() || !q.empty()) {
            while (i < events.size() && events[i][0] <= current_day) {
                q.insert(events[i][1]);
                ++i;
            }
            while (!q.empty() && *q.begin() < current_day) {
                q.erase(q.begin());
            }
            if (!q.empty() && *q.begin() >= current_day) {
                ++ans;
                // cout << *q.begin() << endl;
                q.erase(q.begin());
            }
            ++current_day;
        }
        return ans;
    }
};
```

## 1354. Construct Target Array With Multiple Sums

貌似很难的题目，但一旦发现：每次replace的结果都是替换成最大的数，就可以从最后的数组倒推回初始数组。

时间复杂度: O(N log N max_number)
空间复杂度: O(N).

```cpp
class Solution {
    using ll = long long;
public:
    bool isPossible(vector<int>& target) {
        multimap<ll, ll> m;
        ll s = 0;
        for (int i = 0; i < target.size(); ++i) {
            m.insert({target[i], i});
            s += target[i];
        }
        function<bool()> recurse = [&]() -> bool {
            if (s == target.size())
                return true;
            auto max_item = m.end();
            --max_item;
            ll left = max_item->first;
            ll index = max_item->second;
            ll others = s - left;
            ll x = left - others;
            // cout << left << " " << index << " " << others << " " << x << endl;
            if (x < 1)
                return false;
            s = left;
            m.erase(max_item);
            m.insert({x, index});
            target[index] = x;
            return recurse();
        };
        return recurse();
    }
};
```