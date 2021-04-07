---
title: LeetCode weeekly contest 186
date: 2020-04-26 13:04:58
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (4) |	Q3 (6) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 113 / 11684 |	YoungForest | 18 | 0:34:17 | 0:04:32 |  0:10:54 | 0:18:49 | 0:34:17 |

手速场。换成Python后，手速场很轻松。真的是人生苦短，我用Python。不过在用Python刷题的过程中，我也发现了一些问题。
- API不熟悉。比如sorted会返回一个排好序的list，而不是in-place sort.
- 数据结构不全。如没有treemap，priority_queue只能用heap，代替。最小堆需要把所有数*-1，使用这种丑陋的实现方式。
- runtime error。在一些手误情况下，会有错误的提交。这时候很考验你的测试用例了，是否覆盖所有的情况和边界条件。

## 1422. Maximum Score After Splitting a String

brute-force. `2 <= s.length <= 500`.

时间复杂度: O(N ^ 2),
空间复杂度: O(1).

另外，如果采取Presum的方式的话，时间复杂度可以降为`O(N)`。

```python
class Solution:
    def maxScore(self, s: str) -> int:
        def count(s, c):
            ans = 0
            for i in s:
                if i == c:
                    ans += 1
            return ans
        return max(count(s[:x], '0') + count(s[x:], '1') for x in range(1,len(s)))
```

## 1423. Maximum Points You Can Obtain from Cards

问题可以转化为：从头取x个，从尾取k-x个 和最大。

时间复杂度: O(N),
空间复杂度: O(N).

```python
class Solution:
    def maxScore(self, cardPoints: List[int], k: int) -> int:
        n = len(cardPoints)
        presum = [0] * (n + 1)
        suffixsum = [0] * (n + 1)
        for i in range(1, n+1):
            presum[i] = presum[i-1] + cardPoints[i-1]
            suffixsum[i] = suffixsum[i-1] + cardPoints[n-i]
        
        return max(presum[x] + suffixsum[k-x] for x in range(k+1)) # take x from head, k - x from tail
```

评论区还有一种主流方法。将问题转化为 寻找和最小的大小为`num.size()-k`的子数组。使用滑动窗口的方法，时间复杂度: O(N), 空间复杂度: O(1).

## 1424. Diagonal Traverse II

遍历一遍，把元素放入适当的对角线上。对角线用一个dict存储，每条对角线是个list.
需要注意的是，python中dict是hashmap，3.7后保证遍历时的顺序和插入的顺序一致。所以在这里我们可以直接遍历对角线字典。

时间复杂度: O(the number of elements),
空间复杂度: O(the number of elements).

```python
class Solution:
    def findDiagonalOrder(self, nums: List[List[int]]) -> List[int]:
        line = defaultdict(list)
        for start in range(len(nums)):
            for i in range(len(nums[start])):
                line[start + i].append(nums[start][i])
        ans = []
        for i in line:
            while line[i]:
                ans.append(line[i].pop())
        return ans
```

## 1425. Constrained Subset Sum

动态规划。dp[i]表示以第i个元素结尾，的最大子集和。
dp[i] = max(dp[j] + nums[i] for i - j >= k).
观察有，当遇到非负数时，可以提前跳出。因为子集中肯定尽量加正数（非负数）。

时间复杂度: O(n * k),
空间复杂度: O(n).

```python
class Solution:
    def constrainedSubsetSum(self, nums: List[int], k: int) -> int:
        n = len(nums)
        dp = nums[:]
        ans = float('-inf')
        for i in range(n):
            for j in range(k):
                index = i - 1 - j
                if index < 0:
                    break
                dp[i] = max(dp[i], dp[index] + nums[i])
                if nums[index] >= 0:
                    break
            ans = max(ans, dp[i])
        return ans
```

[评论区](https://leetcode.com/problems/constrained-subset-sum/discuss/597693/PythonC%2B%2B-DP-with-decreasing-deque)中有正确的O(N)的解法。利用单调递减deque，可以在O(1)的时间里维护`max(dp[j] + nums[i] for i - j >= k)`.