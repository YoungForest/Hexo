---
title: LeetCode biweekly contest 24
date: 2020-04-19 05:37:57
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 700 / 7729 |	YoungForest | 18 | 	1:17:49 | 0:04:50 |  0:10:38 | 0:17:45 |   1:02:49 3 |

最近参加了2场codforces的比赛，cf的rating徘徊在1400+。cf的题目相对leetcode还是难的多的。并没有坚持下来。这也和cf没有很好的discuss区有关，每届比赛结束后，只能看官方的editorial。

## 1413. Minimum Value to Get Positive Step by Step Sum

统计presum的最负值，需要注意的是startValue必须是正数。

时间复杂度: O(N),
空间复杂度: O(N).

```python
class Solution:
    def minStartValue(self, nums: List[int]) -> int:
        min_sum = 0
        current_sum = 0
        for i in nums:
            current_sum += i
            min_sum = min(current_sum, min_sum)
        return 1 - min_sum if min_sum <= 0 else 1
```

## 1414. Find the Minimum Number of Fibonacci Numbers Whose Sum Is K

贪心，永远选用小于等于i的最大的Fibonacci数，然后递归解决剩余的数。

时间复杂度：O((log k)^2),
空间复杂度: O(log k).


```python
class Solution:
    def findMinFibonacciNumbers(self, k: int) -> int:
        def findLargestFibonacciLessEqualThan(i):
            a = 1
            b = 1
            while a <= i:
                a, b = a + b, a
            return b
        
        def dp(i):
            x = findLargestFibonacciLessEqualThan(i)
            if x == i:
                return 1
            else:
                return 1 + dp(i - x)
        return dp(k)
```

## 1415. The k-th Lexicographical String of All Happy Strings of Length n

回溯法按字典序枚举所有的Happy string, 直到找到第`k`个。

时间复杂度: O(min(3 ^ n, k)),
空间复杂度: O(n).

```cpp
class Solution {
public:
    string getHappyString(int n, int k) {
        int rank = 0;
        string ans;
        function<void(string&)> backtracking = [&](string& current) -> void {
            if (current.size() == n) {
                ++rank;
                if (rank == k) {
                    ans = current;
                }
            } else {
                char last = current.empty() ? '0' : current.back();
                for (char c : {'a', 'b', 'c'}) {
                    if (c == last) continue;
                    current.push_back(c);
                    backtracking(current);
                    if (rank >= k) return;
                    current.pop_back();
                }
            }
        };
        string current;
        backtracking(current);
        end:;
        return ans;
    }
};
```

## 1416. Restore The Array

DP. dp[i]: 以第i个元素结尾的array可以有多少种分割方法。
`dp[i] = sum(dp[j] for j + 1, ..., i 可以组成一个有效的数字)`

时间复杂度: O(N * log K),
空间复杂度: O(N).

```python
class Solution:
    def numberOfArrays(self, s: str, k: int) -> int:
        dp = [0] * (10**5 + 5)
        dp[0] = 1
        for index in range(1, len(s)):
            i = index
            ans = 0
            current = int(s[i])
            base = 1
            while current <= k and 10**(index - i) <= k and i - 1 >= 0:
                ans += dp[i-1] if s[i] != '0' else 0
                i -= 1
                base *= 10
                current = current + int(s[i]) * base
            if current <= k and 10**(index - i) <= k:
                ans += 1
            dp[index] = ans
            
        return dp[len(s) - 1] % int(10**9 + 7)
```