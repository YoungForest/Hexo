---
title: 'LeetCode #27 Remove Element'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/remove-element/description/
Solution: https://leetcode.com/problems/remove-element/solution/
Difficulty: Easy

此题与前一个问题‘LeetCode #283 Move Zeroes’其实是一样的。

## Approach 1

```python
class Solution:
    def removeElement(self, nums, val):
        """
        :type nums: List[int]
        :type val: int
        :rtype: int
        """
        slow = 0
        for fast in range(len(nums)):
            if nums[fast] != val:
                nums[slow] = nums[fast]
                slow += 1
        
        return slow
```

## Approach 2

在被移除的元素数目比较小的情况下，时间上会更具优势，移动数组元素的次数更少。虽然都是O(n)的。

```python
class Solution:
    def removeElement(self, nums, val):
        """
        :type nums: List[int]
        :type val: int
        :rtype: int
        """
        n = len(nums)
        i = 0
        
        while i < n:
            if nums[i] == val:
                nums[i] = nums[n-1]
                n -= 1
            else:
                i += 1
                
        return i
```