---
title: LeetCode biweekly contest 51
date: 2021-05-02 11:52:18
tags:
- Competitive Programming
categories:
- LeetCode
---


| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 150 / 9378 | YoungForest | 18 | 0:32:04 |  0:05:26 |  0:07:22 |  0:11:24 | 0:32:04 |

手速场。最近手速已大不如从前，最后一题也因为不熟练花费了比较多的时间。
其实，手速场中，所有题目的算法其实都不难，想到正确的解法很快，但迅速实现 + bug free就考验每位程序员的功力了。

<!-- more -->

## 1844. Replace All Digits with Characters

签到题。按照题目要求完成即可。

```cpp
class Solution {
    char shift(char c, int x) {
        return c + x;
    }
public:
    string replaceDigits(string s) {
        for (int i = 1; i < s.size(); i += 2) {
            s[i] = shift(s[i-1], s[i] - '0');
        }
        return s;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1845. Seat Reservation Manager

因为每次都找最小的座位号，同时有`insert`(`unreserve`)的操作。显然需要使用 `priority_queue`优先队列/Heap 实现这一需求。

```cpp
class SeatManager {
    priority_queue<int, vector<int>, greater<>> pq;
public:
    SeatManager(int n) {
        for (int i = 1; i <= n; ++i) {
            pq.push(i);
        }
    }
    
    int reserve() {
        const int ans = pq.top();
        pq.pop();
        return ans;
    }
    
    void unreserve(int seatNumber) {
        pq.push(seatNumber);
    }
};

/**
 * Your SeatManager object will be instantiated and called as such:
 * SeatManager* obj = new SeatManager(n);
 * int param_1 = obj->reserve();
 * obj->unreserve(seatNumber);
 */
```

时间复杂度:
- SeatManager: O(n),
- reserve: O(log n),
- unreserve: O(log n).
空间复杂度: O(n).

## 1846. Maximum Element After Decreasing and Rearranging

贪心。
观察2种操作 `Decrease` 和 `Rearrange` 可以发现，
其实只需要`Reagrrage`一次，`Decrease`时，优先减小的。因为大的减起来一定可以包括小的，但小的不行。

```cpp
class Solution {
public:
    int maximumElementAfterDecrementingAndRearranging(vector<int>& arr) {
        const int n = arr.size();
        sort(arr.begin(), arr.end());
        int last = 0;
        for (int i = 0; i < n; ++i) {
            if (arr[i] > last) {
                arr[i] = last + 1;
            } else {
                arr[i] = last;
            }
            last = arr[i];
        }
        return arr[n - 1];
    }
};
```

时间复杂度: O(n log n + n),
空间复杂度: O(1).

## 1847. Closest Room

首先想到暴力解法，对于每一个`query`, 遍历一遍`rooms`，就可以找到答案。时间复杂度为 `O(k * n)`，显然会TLE。
解法时间复杂度应该是类似`O(n log n)`这种形式。

这里需要用到一个所谓**离线计算(offline query)**的技术。
所谓在线计算，就是`queries`的解答顺序是不变的，类似一个函数，每次被call，解答一次。
所谓离线计算，就是`queries`的解答顺序是可以变的，需要一次性求解一个数组的`queries`。此时，我们可以通过对`queries`重新排序得到均摊速度更快的算法。

首先，将`queries`按`minisize`排序，将`rooms`按`size`排序。
用双指针的方式，保证对于当前的`query`，符合要求的`rooms`都被加入候选集合中。这里我们用`TreeSet`维护候选集合，以实现`log n`的搜索最近`room`。


```cpp
class Solution {
public:
    vector<int> closestRoom(vector<vector<int>>& rooms, vector<vector<int>>& queries) {
        // brute force: k * n
        // need: k * log n + n log n
        // online, sort queries by minisize from big to small, find close candidate
        const int n = rooms.size();
        sort(rooms.begin(), rooms.end(), [&](const auto& a, const auto& b) -> bool {
            return a[1] > b[1];
        });
        const int k = queries.size();
        using pii = pair<int, int>;
        vector<pii> searchOrder; // miniSize, index
        searchOrder.reserve(k);
        for (int i = 0; i < k; ++i) {
            searchOrder.push_back({queries[i][1], i});
        }
        sort(searchOrder.begin(), searchOrder.end(), [&](const auto& a, const auto& b) -> bool {
            return a.first > b.first;
        });
        int i = 0;
        set<int> candidate;
        vector<int> ans(k, -1);
        for (int j = 0; j < k; ++j) {
            while (i < n && rooms[i][1] >= searchOrder[j].first) {
                candidate.insert(rooms[i++][0]);
            }
            const int prefer = queries[searchOrder[j].second][0];
            if (!candidate.empty()) {
                auto it = candidate.lower_bound(prefer);
                if (it == candidate.begin()) {
                    ans[searchOrder[j].second] = *it;
                } else if (it == candidate.end()) {
                    ans[searchOrder[j].second] = *prev(it);
                } else {
                    if (abs(*it - prefer) < (prefer - *prev(it))) {
                        ans[searchOrder[j].second] = *it;
                    } else {
                        ans[searchOrder[j].second] = *prev(it);
                    }
                }
            } else {
                ans[searchOrder[j].second] = -1;
            }
        }
        return ans;
    }
};
```

时间复杂度: O(n log n + k log n + k log k),
空间复杂度: O(k + n).
