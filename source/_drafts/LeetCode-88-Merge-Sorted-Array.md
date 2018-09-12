---
title: 'LeetCode #88 Merge Sorted Array'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/merge-sorted-array/description/
Solution: 无
Difficulty: Easy

```python
class Solution:
    def merge(self, nums1, m, nums2, n):
        """
        :type nums1: List[int]
        :type m: int
        :type nums2: List[int]
        :type n: int
        :rtype: void Do not return anything, modify nums1 in-place instead.
        """
        index1 = m - 1
        index2 = n - 1
        index_all = m + n -1
        
        while index1 >= 0 and index2 >= 0:
            if nums1[index1] > nums2[index2]:
                nums1[index_all] = nums1[index1]
                index1 -= 1
            else:
                nums1[index_all] = nums2[index2]
                index2 -= 1
                
            index_all -= 1
            
        while index2 >= 0:
            nums1[index_all] = nums2[index2]
            index2 -= 1
            index_all -= 1
```