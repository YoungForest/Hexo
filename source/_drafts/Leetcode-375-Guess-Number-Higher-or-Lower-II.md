---
title: 'Leetcode #375 Guess Number Higher or Lower II'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/guess-number-higher-or-lower-ii/description/
Solution: 无
Difficulty: Medium

看完问题描述我的第一反应是和扔鸡蛋问题(887. Super Egg Drop)类似，用动态规划可以解决。
讨论区里吐槽最多的是本题的Description很不清晰，误导人，推荐看这个Clarification(https://leetcode.com/problems/guess-number-higher-or-lower-ii/discuss/84766/Clarification-on-the-problem-description.-Problem-description-need-to-be-updated-!!!)。

```python
class Solution(object):
    def getMoneyAmount(self, n):
        """
        :type n: int
        :rtype: int
        """
        cache = {}
        def dp(start, end):
            if (start, end) in cache:
                return cache[(start, end)]
            if start == end:
                cache[(start, end)] = 0
                return 0
            if start + 1 == end:
                cache[(start, end)] = start
                return start
            
            min_try = end * (end - start + 1)
            for k in range(start, end + 1):
                min_try = min(min_try, k + max(dp(start, k - 1), dp(k + 1, end)))
            
            cache[(start, end)] = min_try
            return min_try
        
        return dp(1, n)
            
```