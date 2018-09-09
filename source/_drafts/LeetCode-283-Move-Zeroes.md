---
title: 'LeetCode #283 Move Zeroes'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/move-zeroes/description/
Solution: https://leetcode.com/problems/move-zeroes/solution/
Difficulty: Easy

```python
class Solution:
    def moveZeroes(self, nums):
        """
        :type nums: List[int]
        :rtype: void Do not return anything, modify nums in-place instead.
        """
        i = 0
        j = 0
        while i < len(nums):
            if j >= len(nums):
                return
            while nums[j] == 0:
                j += 1
                if j >= len(nums):
                    return
            nums[i] = nums[j]
            if i != j:
                nums[j] = 0
            i = i + 1
            j = j + 1
```

看过Solution后，觉得自己的代码写的真是太糟糕了，虽然解法相同。下面给出优化后的代码，更加优雅：

```python
class Solution:
    def moveZeroes(self, nums):
        """
        :type nums: List[int]
        :rtype: void Do not return anything, modify nums in-place instead.
        """
        lastNotZeroIndex = 0
        
        for i in range(len(nums)):
            if nums[i] != 0:
                nums[lastNotZeroIndex], nums[i] = nums[i], nums[lastNotZeroIndex]
                lastNotZeroIndex += 1
```