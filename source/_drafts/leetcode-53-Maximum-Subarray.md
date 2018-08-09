---
title: leetcode 53 Maximum Subarray
tags:
categories:
- LeetCode
---

问题描述：https://leetcode.com/problems/maximum-subarray/description/
题解：无

## Kadane's Algorithm

```python
class Solution:
    def maxSubArray(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        if len(nums) == 0:
            return None
        
        max_global = nums[0]
        max_current = nums[0]
        
        for i in nums[1:]:
            max_current = max(i, max_current + i)
            max_global = max(max_global, max_current)
            
        return max_global
```