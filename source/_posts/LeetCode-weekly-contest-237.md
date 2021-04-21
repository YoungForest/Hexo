---
title: LeetCode weekly contest 237
date: 2021-04-18 16:55:22
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 345 / 11446 | YoungForest | 18 | 0:40:04 | 0:03:21 | 0:05:10 | 0:25:30 | 0:35:04  1 |

久违的四题并进入前500名。终于可以免打卡了。
已经连续打卡7周了，快要遭不住了呀。最近LeetCode难度提升不小，大佬入场也很多。要同时达到4题和前500属实不易。
今天手速也算正常发挥.

## 1832. Check if the Sentence Is Pangram

签到题。
统计每个单词出现的次数，判断是否都大于0.

```cpp
class Solution {
public:
    bool checkIfPangram(string sentence) {
        vector<int> cnt(26, 0);
        for (char c : sentence) {
            ++cnt[c - 'a'];
        }
        for (int i : cnt) {
            if (i == 0) return false;
        }
        return true;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1833. Maximum Ice Cream Bars

贪心。优先买便宜的。

```cpp
class Solution {
public:
    int maxIceCream(vector<int>& costs, int coins) {
        sort(begin(costs), end(costs));
        int ans = 0;
        for (int i : costs) {
            if (coins >= i) {
                ++ans;
                coins -= i;
            } else break;
        }
        return ans;
    }
};
```

时间复杂度: O(costs.length * log cost.length),
空间复杂度: O(log cost.length).

## 1834. Single-Threaded CPU

使用优先队列选择执行任务，根据题目要求，需要按`processTime, index`的顺序取。
另外，任务还需要按照`enqueueTime`排序，加入到等待的优先队列中。

此题C++是有坑的。
`tasks.length == n`
`1 <= n <= 10^5`
`1 <= enqueueTimei, processingTimei <= 10^9`,
因此，时间最后会超出`int`范围，需要使用`long long`解决。
当然, 选择`Python`就没这个问题了。

```cpp
class Solution {
    using ll = long long;
public:
    vector<int> getOrder(vector<vector<int>>& tasks) {
        using pii = pair<ll, int>; // processTime, index
        // events
        using tii = tuple<ll, ll, ll>;  // enqueueTime, processTime, index
        vector<tii> events;
        events.reserve(tasks.size());
        for (int i = 0; i < tasks.size(); ++i) {
            events.push_back({tasks[i][0], tasks[i][1], i});
        }
        sort(begin(events), end(events));
        vector<int> ans;
        ans.reserve(tasks.size());
        ll now = 0;
        int i = 0;
        priority_queue<pii, vector<pii>, greater<>> wait; 
        while (i < events.size() || !wait.empty()) {
            while (i < events.size() && get<0>(events[i]) <= now) {
                wait.push({get<1>(events[i]), get<2>(events[i])});
                ++i;
            }
            if (wait.empty()) {
                wait.push({get<1>(events[i]), get<2>(events[i])});
                now = get<0>(events[i]);
                ++i;
            }
            auto run = wait.top();
            wait.pop();
            ans.push_back(run.second);
            now += run.first;
        }
        return ans;
    }
};
```

时间复杂度: O(N log N), N = tasks.length,
空间复杂度: O(N).

## 1835. Find XOR Sum of All Pairs Bitwise AND

问题咋一看无从下手，只想到暴力方法，枚举所有的pair，时间复杂度显然不够：`arr1.length * arr2.length = 10^10`。
但其实细想，对于这种位操作来说，每一位之间都是相互独立的。我们可以把问题简化成针对特定位的。只关注一个位的话，解法就呼之欲出了。
我们只需要统计`arr1`和`arr2`中0 和 1的数目。
假设`arr1`有`x`个0、`y`个1，`arr2`有`a`个0，`b`个1。
AND 为 1的数目即为`b*y`，为0的数目为`ax + ay + bx`。
再异或的话，只需要判断1的个数，即`b*y`，是不是奇数就OK了。
这里C++又有一个坑，因为`arr.length`最大为 10^ 5, `b*y`是可以`int`溢出的。LeetCode因为编译器开了溢出检查，因此会报类似下面的错误。我也因此罚时一次。
解决方案是要么用`long long`，要么 分别判断 `(b % 2 == 1) && (y % 2 == 1)`.

>Line 24: Char 26: runtime error: signed integer overflow: 100000 * 100000 cannot be represented in type 'int' (solution.cpp)
>SUMMARY: UndefinedBehaviorSanitizer: undefined-behavior prog_joined.cpp:33:26

```cpp
class Solution {
    pair<int, int> extract(const vector<int>& arr, const int i) {
        int x = 0, y = 0;
        for (int num : arr) {
            if (num & (1 << i)) ++y;
            else ++x;
        }
        return {x, y};
    }
public:
    int getXORSum(vector<int>& arr1, vector<int>& arr2) {
        // brute-force: arr1.length * arr2.length = 10^10
        // smart: 32 * (arr1.length + arr2.length)
        // x0 y1
        // a0 b1
        // AND 0 = (ax + ay + bx)
        // AND 1 = (by)
        // if AND 1 % 2 == 1:
        //     k += (1 << i)
        int ans = 0;
        for (int i = 0; i < 31; ++i) {
            auto [x, y] = extract(arr1, i);
            auto [a, b] = extract(arr2, i);
            if ((b % 2 == 1) && (y % 2 == 1)) {
                ans += (1 << i);
            }
        }
        return ans;
    }
};
```