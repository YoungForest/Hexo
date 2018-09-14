---
title: 'LeetCode #268 Missing Number'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/missing-number/description/
Solution: https://leetcode.com/problems/missing-number/solution/
Difficulty: Easy

```python
class Solution:
    def missingNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        n = len(nums)
        total = ((n+1) * n) // 2
        
        for i in nums:
            total -= i
            
        return total
```
