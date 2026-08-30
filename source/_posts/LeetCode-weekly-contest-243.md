---
title: LeetCode weekly contest 243
date: 2021-05-30 17:22:10
description: 四道题把词转换为数值、贪心插入一位、用双优先队列调度服务器，并以动态规划计算准时到会的最少跳过休息次数。
tags:
- Competitive Programming
categories:
- LeetCode
translations:
  zh-CN: https://youngforest.github.io/2021/05/30/LeetCode-weekly-contest-243/
  en: https://youngforest.github.io/en/2021/05/30/LeetCode-weekly-contest-243/
---
| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 95 / 12835 | YoungForest | 18 | 1:19:18 | 0:02:50 | 0:11:21 | 0:36:27  🐞1 | 1:04:18 🐞2 |

零神大数据：
1880,Check if Word Equals Summation of Two Words,check-if-word-equals-summation-of-two-words,1187.1641565458
1881,Maximum Value after Insertion,maximum-value-after-insertion,1381.2168789318
1882,Process Tasks Using Servers,process-tasks-using-servers,1979.1112273597
1883,Minimum Skips to Arrive at Meeting On Time,minimum-skips-to-arrive-at-meeting-on-time,2587.8725248485

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/LeetCode-weekly-contest-243/zh-hero.webp" alt="彩珠词串在算盘上合并，单珠插入序列取得最大轮廓，任务经双队列分给服务器，旅程跳过部分休息赶上沙漏" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

## 1880. Check if Word Equals Summation of Two Words

签到题。按题目要求转换字符串到数字，再进行判断。

```python
class Solution:
    def isSumEqual(self, firstWord: str, secondWord: str, targetWord: str) -> bool:
        def toDigit(w):
            ans = 0
            for i in w:
                ans = ans * 10 + ord(i) - ord('a')
            return ans
        
        return toDigit(firstWord) + toDigit(secondWord) == toDigit(targetWord)
```

时间复杂度: O(N),
空间复杂度: O(N).

## 1881. Maximum Value after Insertion

贪心。正数时插入到第一个比x小的数，负数时插入到第一个比x大的数。

```python
class Solution:
    def maxValue(self, n: str, x: int) -> str:
        # insert into the position where the first digit < x
        # negative first > x
        if n[0] == '-':
            for i in range(1, len(n)):
                if ord(n[i]) - ord('0') > x:
                    return n[:i] + str(x) + n[i:]
            return n + str(x)
        else:
            for i in range(len(n)):
                if ord(n[i]) - ord('0') < x:
                    return n[:i] + str(x) + n[i:]
            return n + str(x)
```

时间复杂度: O(N),
空间复杂度: O(N).

## 1882. Process Tasks Using Servers

直接暴力模拟即可。使用优先队列维护空闲服务器，等待任务和释放时间。
模拟时需要注意时间不能1单位1单位地进行，而是只进行那些有事件发生的时刻。
即任务开始等待，服务器释放。
需要注意时间的大小可能会超过`int`, 用`long long`更保险些。

```cpp
class Solution {
    using ll = long long;
    using pii = pair<ll, ll>;
public:
    vector<int> assignTasks(vector<int>& servers, vector<int>& tasks) {
        // brute-force: (m + n) * log n
        priority_queue<pii, vector<pii>, greater<>> freeServers, releaseTime;
        for (int i = 0; i < servers.size(); ++i) {
            freeServers.emplace(servers[i], i);
        }
        priority_queue<int, vector<int>, greater<>> waitTasks;
        const int m = tasks.size();
        vector<int> ans(m);
        for (int i = 0; i < m; ++i) {
            waitTasks.push(i);
            while (!releaseTime.empty() && releaseTime.top().first <= i) {
                const int idx = releaseTime.top().second;
                freeServers.emplace(servers[idx], idx);
                releaseTime.pop();
            }
            while (!freeServers.empty() && !waitTasks.empty()) {
                const int idx = waitTasks.top();
                waitTasks.pop();
                auto [weight, serverIdx] = freeServers.top();
                freeServers.pop();
                ans[idx] = serverIdx;
                releaseTime.emplace(i + tasks[idx], serverIdx);
            }
        }
        ll current = m - 1;
        while (!releaseTime.empty() && !waitTasks.empty()) {
            const int idx = releaseTime.top().second;
            current = releaseTime.top().first;
            freeServers.emplace(servers[idx], idx);
            releaseTime.pop();
            while (!releaseTime.empty() && releaseTime.top().first <= current) {
                const int idx = releaseTime.top().second;
                current = releaseTime.top().first;
                freeServers.emplace(servers[idx], idx);
                releaseTime.pop();
            }
            while (!freeServers.empty() && !waitTasks.empty()) {
                const int idx = waitTasks.top();
                waitTasks.pop();
                auto [weight, serverIdx] = freeServers.top();
                freeServers.pop();
                ans[idx] = serverIdx;
                releaseTime.emplace(current + tasks[idx], serverIdx);
            }
        }
        
        return ans;
    }
};
```

时间复杂度: O((m + n) * log n),
空间复杂度: O(m + n).

## 1883. Minimum Skips to Arrive at Meeting On Time

动态规划。
dp(i, k)表示，从dist0到i（inclusive），k次休息，结束的最早时间。
状态转移方程为
dp(i, k) = min(
    dp(i-1, k) + .. 最后一站不休息
    dp(i-1, k-1) + .. 最后一站休息
)，
然后使用二分搜索找到最小的k使得 dp(n-1, k) <= hoursBefore.
（其实不用二分也行，从小到大遍历寻找也行。因为时间复杂度瓶颈不在这里，而在计算dp那里）。

最近经常遇到动态规划的题目，之前在找状态转移方程时，时间复杂度总是超。试图利用枚举最后一个休息位置发生在何处。正确的做法应该是，只枚举最后一站是否休息。可以将时间复杂度降一个n.

本题有个坑是浮点数精度，我因此WA了2次。
解决方法有二:
1. 增加err, 我这里用了10^-9, 在大多数情况下都是够了。
2. 转换成整型。可能需要用`long long`。在本题中就是把所有的 时间 * speed 用来表示距离，这种解决方案不存在精度丢失。

```python
class Solution:
    def minSkips(self, dist: List[int], speed: int, hoursBefore: int) -> int:
        n = len(dist)
        err = 10**-9
        @cache
        def dp(i, k):
            if i == 0:
                return dist[0] / speed
            if k == 0:
                # no relax
                return ceil(dp(i-1, 0) - err) + dist[i] / speed
            if i == k:
                # relax all
                return dp(i-1, k-1) + dist[i] / speed
            # not relax + relax
            return min(ceil(dp(i-1, k) - err) + dist[i] / speed, dp(i-1, k-1) + dist[i] / speed)
                       
        lo = 0
        hi = n
        
        if dp(n-1, n-1) > hoursBefore + err: return -1
        
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if dp(n-1, mid) <= hoursBefore + err: # -err?
                hi = mid
            else:
                lo = mid + 1
        
        if lo == n: return -1
        else: return lo
```

时间复杂度: O(n ^ 2),
空间复杂度: O(m ^ 2).
