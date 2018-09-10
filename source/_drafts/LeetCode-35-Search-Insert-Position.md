---
title: 'LeetCode #35 Search Insert Position'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/search-insert-position/description/
Solution: 无
Difficulty: Easy

# 暴力版

```python
class Solution:
    def searchInsert(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: int
        """
        for index, value in enumerate(nums):
            if target <= value:
                return index
            
        return len(nums)
```

# 二分查找

```python
class Solution:
    def searchInsert(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: int
        """
        low = 0
        high = len(nums)
        
        while low < high:
            mid = (low + high) // 2    
            if target == nums[mid]:
                return mid
            if target < nums[mid]:
                high = mid
            else:
                low = mid + 1
            
        return low
```

需要注意`high = mid`而不是`high = mid - 1`，开始时，`high = len(nums)`而不是`high = len(nums) - 1`.