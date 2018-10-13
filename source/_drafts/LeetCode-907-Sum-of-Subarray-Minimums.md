---
title: 'LeetCode #907 Sum of Subarray Minimums'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/contest/weekly-contest-102/problems/sum-of-subarray-minimums/
Solution: 无
Difficulty: Medium

```python
class Solution:
    def sumSubarrayMins(self, A):
        """
        :type A: List[int]
        :rtype: int
        """
        old_array = A
        ret = 0
        
        for i in range(len(A)):
            length = len(A) - i
            for j in range(length):
                ret += old_array[j]
                
            new_array = []
            for j in range(length-1):
                new_array.append(min(old_array[j], old_array[j+1]))
                
            old_array = new_array
            
        return ret % (10**9 + 7)
```

时间复杂度O(n^2)，2层for循环;
空间复杂度O(n)，需要开一个额外的数组。
结果TLE。

## 一个时间复杂度O(n)的解法

reference: https://leetcode.com/problems/sum-of-subarray-minimums/discuss/170750/C++JavaPython-Stack-Solution

```python
class Solution:
    def sumSubarrayMins(self, A):
        """
        :type A: List[int]
        :rtype: int
        """
        left = [0] * len(A)
        right = [0] * len(A)
        
        s = []
        
        for i in range(len(A)):
            count = 1
            while s and s[-1][0] > A[i]:
                count += s.pop()[1]
                
            s.append([A[i], count])
            left[i] = count
        
        s = []
        
        for i in range(len(A))[::-1]:
            count = 1
            while s and s[-1][0] >= A[i]:
                count += s.pop()[1]
                
            s.append([A[i], count])
            right[i] = count
            
        ret = 0
        for i in range(len(A)):
            ret += A[i] * left[i] * right[i]
            
        return ret % (10**9 + 7)
```