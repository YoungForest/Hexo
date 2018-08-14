---
title: 'LeetCode #54 Spiral Matrix'
tags:
categories:
- LeetCode
---

"LeetCode #54 Spiral Matrix", "LeetCode #59 Spiral Matrix II"和"LeetCode 889 Spiral Matrix III"是一组题目。
核心思想都是模仿顺时针旋转这一操作。

Description: https://leetcode.com/problems/spiral-matrix/description/
Solution: https://leetcode.com/problems/spiral-matrix/solution/
Difficulty: Easy

```python
class Solution:
    def spiralOrder(self, matrix):
        """
        :type matrix: List[List[int]]
        :rtype: List[int]
        """
        ret = []
        
        m = len(matrix)
        if m == 0:
            return ret
        n = len(matrix[0])
        if n == 0:
            return ret
        
        west = 0
        east = n - 1
        north = 1
        south = m - 1
        
        a, b = 0, 0
        
        ret.append(matrix[a][b])
        while True:
            if west > east:
                break
            
            while b + 1 <= east:
                b += 1
                ret.append(matrix[a][b])
            east -= 1
            
            if north > south:
                break
            
            while a + 1 <= south:
                a += 1
                ret.append(matrix[a][b])
            south -= 1
            
            if west > east:
                break
            
            while b - 1 >= west:
                b -= 1
                ret.append(matrix[a][b])
            west += 1
            
            if north > south:
                break
            
            while a - 1 >= north:
                a -= 1
                ret.append(matrix[a][b])
            north += 1
            
        return ret
```