---
title: LeetCode biweekly contest 22
date: 2020-03-23 22:47:33
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 1357 / 5632 |	YoungForest | 	12 | 1:27:09 |  0:05:06 |  0:48:41  1 |  1:22:09 |  null |

## 1385. Find the Distance Value Between Two Arrays

先对`arr2`进行排序，再对`arr1`中的每一个元素，利用二分搜索，判断`arr2`中是否有距离在`d`中的值。

时间复杂度: O(arr2.size() * log arr2.size() + arr1.size() * log arr2.size()),
空间复杂度: O(1).


```cpp
class Solution {
public:
    int findTheDistanceValue(vector<int>& arr1, vector<int>& arr2, int d) {
        int ans = 0;
        sort(arr2.begin(), arr2.end());
        for (int i : arr1) {
            auto it1 = lower_bound(arr2.begin(), arr2.end(), i - d);
            auto it2 = upper_bound(arr2.begin(), arr2.end(), i + d);
            if (it1 == it2)
                ++ans;
        }
        return ans;
    }
};
```

## 1386. Cinema Seat Allocation

贪心。每排尝试放2个family，再尝试放一个family。因为一行10个座位，所以可以用bitmap来表示占用情况。对于没reserverd的行，直接放2个。

时间复杂度: O(reservedSeats.size() * log reserveredSeats.size() + max(n, reservedSeats.size())),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int maxNumberOfFamilies(int n, vector<vector<int>>& reservedSeats) {
        sort(reservedSeats.begin(), reservedSeats.end(), [](const auto& a, const auto& b) -> bool {
            if (a[0] == b[0]) {
                return a[1] < b[1];
            } else {
                return a[0] < b[0];
            }
        });
        int ans = 0;
        for (int index = 0, row = 1; row <= n;) {
            unsigned int current_row = 0;
            for (; index < reservedSeats.size() && reservedSeats[index][0] == row; ++ index) {
                current_row |= 1 << (reservedSeats[index][1] - 1);
            }
            current_row = ~current_row;
            if ((current_row & 0b0111111110) == 0b0111111110)
                ans += 2;
            else if ((current_row & 0b0001111000) == 0b0001111000)
                ++ans;
            else if((current_row & 0b0000011110) == 0b0000011110)
                ++ans;
            else if ((current_row & 0b0111100000) == 0b0111100000)
                ++ans;
            if (index < reservedSeats.size()) {
                ans += (reservedSeats[index][0] - row - 1) * 2;
                row = reservedSeats[index][0];
            }
            else {
                ans += (n + 1 - row - 1) * 2;
                row = n + 1;
            }
        }
        return ans;
    }
};
```

## 1387. Sort Integers by The Power Value

刚开始想的是BFS，从1开始搜索。但是会超时，最后返回值的下标也不好处理，浪费了很多时间调试。

时间复杂度: O(2 ^ value of Kth),
空间复杂度: O(2 ^ value of Kth).

```cpp
class Solution {
public:
    int getKth(int lo, int hi, int k) {
        queue<int> q;
        unordered_set<int> seen;
        q.push(1);
        seen.insert(1);
        int count = 0;
        int level = 0;
        if (1 >= lo && 1 <= hi) ++count;
        if (count == k) return 1;
        while (!q.empty()) {
            int s = q.size();
            for (int i = 0; i < s; ++i) {
                int y = q.front();
                q.pop();
                int x = (y - 1) / 3;
                if ((y - 1) % 3 == 0 && x % 2 == 1 && seen.find(x) == seen.end()) {
                    q.push(x);
                    seen.insert(x);
                    if (x >= lo && x <= hi) ++count;
                }
                if (y <= numeric_limits<int>::max() / 2) {
                    x = y * 2;
                    if (seen.find(x) == seen.end()) {
                        q.push(x);
                        seen.insert(x);
                        if (x >= lo && x <= hi) ++count;
                    }
                }
            }
            ++level;
            if (count >= k)
                break;
        }
        int s = q.size();
        vector<int> remain;
        while (!q.empty()) {
            if (q.front() >= lo && q.front() <= hi) {
                remain.push_back(q.front());
            }
            q.pop();
        }
        sort(remain.begin(), remain.end());
        // cout << "count: " << count << ", " << remain.size() << endl;
        return remain[k - (count - remain.size()) - 1];
    }
};
```

后来发现其实是 记忆化搜索 即可，代码实现简单，效率还高。

时间复杂度: O((hi - lo) * log (hi - lo) * value),
空间复杂度: O(hi  -  lo).

```cpp
class Solution {
public:
    int getKth(int lo, int hi, int k) {
        unordered_map<int, int> memo;
        function<int(int)> recurse = [&](int index) -> int {
            if (index == 1) return 0;
            else if (memo.find(index) != memo.end()) {
                return memo[index];
            } else {
                if (index % 2 == 0)
                    return memo[index] = recurse(index / 2) + 1;
                else
                    return memo[index] = recurse(3 * index + 1) + 1;
            }
        };
        vector<int> v;
        for (int i = lo; i <= hi; ++i) {
            v.push_back(i);
        }
        sort(v.begin(), v.end(), [&](int a, int b) -> bool {
            int a_value = recurse(a);
            int b_value = recurse(b);
            if (a_value != b_value)
                return a_value < b_value;
            else
                return a < b;
        });
        return v[k - 1];
    }
};
```

## 1388. Pizza With 3n Slices

因为前面的题目花了太长时间，第4题只有10min，看了下题目，没有思路就放弃了。
其实，如果将问题转换一下，解法就呼之欲出了。

问题可以转换为：从3*n数组中挑选n个元素，要求元素不能邻接，并且不能同时挑 头和尾，使得得到的和最大。和[213. House Robber II](https://leetcode.com/problems/house-robber-ii/description/)类似。
状态转移方程:
```
f(begin, end, remain, cycle)
= max{
    nums[end] + f(begin + cycle, end - 2, remain - 1, 0), // take end
    f(begin, end - 1, remain, 0)    // not take end
}
```

时间复杂度: O(N ^ 3),
空间复杂度: O(N ^ 3).

```cpp
class Solution {
public:
    int maxSizeSlices(vector<int>& slices) {
        map<tuple<int, int, int, int>, int> memo;
        function<int(int,int,int,int)> f = [&](int begin, int end, int remain, int cycle) -> int {
            auto it = memo.find({begin, end, remain, cycle});
            if (it == memo.end()) {
                int ans = -1;
                if (remain == 1) {
                    ans = *max_element(slices.begin() + begin, slices.begin() + end + 1);
                } else if (end - begin + 1 < 2 * remain - 1)  {
                    ans = -1;
                } else {
                    ans = max(
                        slices[end] + f(begin + cycle, end - 2, remain - 1, 0),
                        f(begin, end - 1, remain, 0)
                    );
                }
                return memo[{begin, end, remain, cycle}] = ans;
            } else {
                return it->second;
            }
        };
        return f(0, slices.size() - 1, slices.size() / 3, 1);
    }
};
```