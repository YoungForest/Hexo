---
title: 'LeetCode #80 Remove Duplicates from Sorted Array II'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/description/
Solution: 无
Difficulty: Medium

虽然属于Medium难度的题目，但和'LeetCode #26 Remove Dubplicates from Sorted Array'相比，只需增加一个表示计数的变量，即可把至多一次出现改成至多二次出现。同理，可以改为至多n次出现。

```python
class Solution:
    def removeDuplicates(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        if len(nums) == 0:
            return 0
        
        count = 1
        last = 0
        
        for i in nums[1:]:
            if i != nums[last]:
                last += 1
                nums[last] = i
                count = 1
            elif count == 1:
                last += 1
                nums[last] = i
                count = 2
            else:
                continue
                
        return last + 1
```
