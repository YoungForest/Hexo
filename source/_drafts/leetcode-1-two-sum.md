---
title: leetcode-1-two-sum
date: 2018-07-18 16:15:19
tags:
categories:
- LeetCode
---

由于园子宝宝不会Java，而leetcode的官方题解是 Java代码，不方便园子宝宝学习。虽然Discuss板块有不同语言的题解，但对于初学者园子来说，过于困难。所以我在刷leetcode的同时，把题解转换成Python3版本的，以帮助园子。
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