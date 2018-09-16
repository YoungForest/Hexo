---
title: 'LeetCode #905 Sort Array By Parity'
tags:
categories:
- LeetCode
---

LeetCode每周日早上会开放一个比赛，4道算法题，其中1道Easy，2道Medium，1道Hard。
今天我参加的是Weekly Contest 102。做出来前2道题目，和最后一道Hard（不过这道题目没在规定的时间内做出来）。另一道Medium的题目只想出来时间复杂度为O(n^2)的答案，结果TLE了。

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