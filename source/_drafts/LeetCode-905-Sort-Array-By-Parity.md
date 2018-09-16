---
title: 'LeetCode #905 Sort Array By Parity'
tags:
categories:
- LeetCode
---

Weekly Contest 102

Description: https://leetcode.com/contest/weekly-contest-102/problems/sort-array-by-parity/
Solution: 无
Difficulty: Easy

```python
class Solution:
    def sortArrayByParity(self, A):
        """
        :type A: List[int]
        :rtype: List[int]
        """
        i = 0
        j = len(A) - 1
        
        while i < j:
            while i < j and A[i] % 2 == 0:
                i += 1
            while i < j and A[j] % 2 == 1:
                j -= 1
                
            if i < j:
                A[i], A[j] = A[j], A[i]
                i += 1
                j -= 1
            
        return A
```

使用了快排中`partition`类似的方法。