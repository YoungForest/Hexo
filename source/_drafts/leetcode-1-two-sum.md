---
title: leetcode-1-two-sum
date: 2018-07-18 16:15:19
tags:
categories:
- LeetCode
---

所有的Solution都是在Leetcode上Submit并Accepted的，请放心食用。

# 1. [two sum](https://leetcode-cn.com/problems/two-sum/description/)

## 方法 1：暴力法

```python
class Solution:
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
                
        return None
```

## 方法 2：两遍哈希表

```python
class Solution:
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        d = {}
        for index, value in enumerate(nums):
            d[value] = index
        for index, value in enumerate(nums):
            complement_index = d.get(target - value)
            if complement_index != None and complement_index != index:
                return [index, complement_index]
            
        return None
```

## 方法 3：一遍哈希表

```python
class Solution:
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        d = {}
        for index, data in enumerate(nums):
            value = d.get(target - data)
            if value != None:
                return [value, index]
            else:
                d[data] = index
        
        return None
```