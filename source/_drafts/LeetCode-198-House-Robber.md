---
title: 'LeetCode #198 House Robber'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/house-robber/description/
Solution: 无
Difficulty: Easy

题目背景特别有趣，是最优化一个抢劫方案的。限制不能抢相邻的房子，好奇葩的设定。
典型地可以通过动态规划解决。

```python
class Solution:
    def rob(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        dp1, dp2 = 0, 0
        rob = False
        
        for n in nums:
            if not rob:
                rob = True
                if dp1 + n > dp2 + n:
                    dp2, dp1 = dp1 + n, dp2
                else:
                    dp2, dp1 = dp2 + n, dp2
            else:
                if dp1 + n > dp2:
                    rob = True
                    dp2, dp1 = dp1 + n, dp2
                else:
                    rob = False
                    dp2, dp1 = dp2, dp2
                    
        return dp2
```
