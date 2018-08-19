---
title: 'leetcode #414 Third Maximum Number'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/third-maximum-number/description/
Solution: 无
Difficulty: Easy

```python
class Solution:
    def thirdMax(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        if len(nums) <= 2:
            return max(nums)
        
        first = nums[0]
        second = None
        third = None
        
        i = 1
        while i < len(nums):
            if nums[i] == first:
                i += 1
                continue
            if nums[i] > first:
                first, second = nums[i], first
            else:
                second = nums[i]
            break
        
        i += 1
        
        while i < len(nums):
            if nums[i] == first or nums[i] == second:
                i += 1
                continue
            if nums[i] > first:
                first, second, third = nums[i], first, second
            elif nums[i] > second:
                second, third = nums[i], second
            else:
                third = nums[i]
            break
        i += 1
            
        if third == None:
            return first
        
        while i < len(nums):
            if nums[i] in (first, second, third):
                i += 1
                continue
            if nums[i] > first:
                first, second, third = nums[i], first, second
            elif nums[i] > second:
                second, third = nums[i], second
            elif nums[i] > third:
                third = nums[i]
            else:
                pass
            i += 1
            
        return third
```

简短版：
```python
class Solution:
    def thirdMax(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        first = None
        second = None
        third = None
        
        for i in nums:
            if i in (first, second, third):
                continue
            if first == None or i > first:
                first, second, third = i, first, second
            elif second == None or i > second:
                second, third = i, second
            elif third == None or i > third:
                third = i
            else:
                continue
            
        if third == None:
            return first
        
        return third
```