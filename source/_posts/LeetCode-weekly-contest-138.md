---
title: LeetCode weekly conteset 138
date: 2019-05-26 11:27:38
tags:
- Competitive Programming
categories:
- LeetCode
---

本周比赛虽然题目质量还不错，但难度不高，是一场比拼速度的题目。
因为第二题题目比较长，所以我做题的顺序是 1->3->4->2。

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 247 / 4143|	YoungForest | 	20 | 	0:57:43 | 0:11:19 | 0:52:43 (1) |	0:27:35  | 0:36:44 |

## 1051. Height Checker

Intuition:
简单的排序，然后遍历比较一遍。
时间复杂度: O(N log N)
空间复杂度: O(N)

```cpp
class Solution {
public:
    int heightChecker(vector<int>& heights) {
        auto copy = heights;
        sort(copy.begin(), copy.end());
        int ret = 0;
        for (int i = 0; i < heights.size(); ++i) {
            if (copy[i] != heights[i])
                ++ret;
        }
        return ret;
    }
};
```

## 1052. Grumpy Bookstore Owner
本题是最后做的，花费了不少时间。本次进不了前200的原因，首先是第一题读懂题目花了过长的时间，其次就是本题有些着急做，直接写代码，写错了思路，后来才改的。然后是本题还有一次罚时，是因为第一次忘记更新`max_wanhui`了。事实上，我刚开始是记得要更新的，但是写的时候就忘了。
教训就是，先把题的算法想好，确定可行在写代码；另外，需要先写test case，尤其是corner case，再想算法，再下笔。这样可以有效验证算法和代码的正确性。

Intuition:
滑动窗口。不断更新最大的挽回损失的值。

时间复杂度: O(N).
空间复杂度: O(1).


```cpp
class Solution {
public:
    int maxSatisfied(vector<int>& customers, vector<int>& grumpy, int X) {
        int n = customers.size();
        const int total_customers = accumulate(customers.cbegin(), customers.cend(), 0);
        int sunshi = 0;
        for (int i = 0; i < n; ++i) {
            if (grumpy[i] == 1)
                sunshi += customers[i];
        }
        int max_wanhui = 0;
        int wanhui = 0;
        for (int i = 0; i < X; ++i) {
            if (grumpy[i] == 1)
                wanhui += customers[i];
        }
        max_wanhui = max(max_wanhui, wanhui);
        
        for (int i = X; i < n; ++i) {
            if (grumpy[i] == 1)
                wanhui += customers[i];
            if (grumpy[i - X] == 1)
                wanhui -= customers[i - X];
            max_wanhui = max(max_wanhui, wanhui);
        }
        // cout << total_customers << " " << sunshi << " " << max_wanhui << endl;
        return total_customers - sunshi + max_wanhui;
    }
};
```

## 1053. Previous Permutation With One Swap

Intuition:
Greedy. 我们想要找到一次交换产生的 最大的比当前小的枚举序列。
首先，要使枚举序列变小，必需交换一个大值和一个小值。
然后，为了使得交换后的序列尽可能大，大值需要尽可能靠后，小值也需尽可能靠后。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<int> prevPermOpt1(vector<int>& A) {
        int larger_index = A.size() - 1;
        while (larger_index >= 1) {
            if (A[larger_index] >= A[larger_index - 1]) {
                --larger_index;
            } else {
                break;
            }
        }
        if (larger_index == 0)
            return A;
        --larger_index;
        auto insert_it = lower_bound(A.cbegin() + larger_index + 1, A.cend(), A[larger_index]);
        int swap_index = std::distance(A.cbegin(), insert_it) - 1;
        swap(A[swap_index], A[larger_index]);
        
        return A;
    }
};
```
## 1054. Distant Barcodes
Intuition:
Greedy. 每次取频数最大的数，同时需要保证该数不是前一个数。
用一个 **优先队列** 恰好可以方便地实现取频数最大的数的需求。
时间复杂度: O(N log N), 优先队列的基本操作`push`的复杂度是`O(log N)`. 如果对STL里的算法和container, adapter不熟的话，我再推荐一遍[《C++ 标准库 第二版》（C++ Standard library)](https://book.douban.com/subject/26419721/)这本书。
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<int> rearrangeBarcodes(vector<int>& barcodes) {
        map<int, int> count;
        for (int barcode : barcodes) {
            ++count[barcode];
        }
        priority_queue<pair<int, int>> pq;
        for (const auto& p : count) {
            pq.push({p.second, p.first});
        }
        vector<int> ret;
        pair<int, int> old_top;
        while (!pq.empty()) {
            auto t = pq.top();
            pq.pop();
            ret.push_back(t.second);
            --t.first;
            if (old_top.first > 0)
                pq.push(old_top);
            old_top = t;
        }
        if (old_top.first > 0)
            ret.push_back(old_top.second);
        return ret;
    }
};
```