---
title: 'leetcode #167 Two Sum II'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/
Solution: 无
Difficulty: Easy

```python
class Solution:
    def twoSum(self, numbers, target):
        """
        :type numbers: List[int]
        :type target: int
        :rtype: List[int]
        """
        hashmap = {}
        
        for index, i in enumerate(numbers):
            if target - i in hashmap:
                return [hashmap[target - i] + 1, index + 1]
            else:
                hashmap[i] = index
                
        return None
```

Without hashmap version:
```python
class Solution:
    def twoSum(self, numbers, target):
        """
        :type numbers: List[int]
        :type target: int
        :rtype: List[int]
        """
        i = 0
        j = len(numbers) - 1
        
        while True:
            he = numbers[i] + numbers[j]
            if he == target:
                return [i+1, j+1]
            elif he < target:
                i += 1
            else:
                j -= 1
        
        return None
```