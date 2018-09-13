---
title: 'LeetCode #26 Remove Dubplicates from Sorted Array'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/
Solution: https://leetcode.com/problems/remove-duplicates-from-sorted-array/solution/
Difficulty: Easy

```python
class Solution:
    def removeDuplicates(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        if len(nums) == 0:
            return 0
        
        last_index = 0
        for i in nums[1:]:
            if i != nums[last_index]:
                last_index += 1
                nums[last_index] = i
        
        return last_index + 1
```