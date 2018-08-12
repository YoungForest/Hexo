---
title: 'LeetCode #889 Spiral Matrix III'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/spiral-matrix-iii/description/
Solution: https://leetcode.com/problems/spiral-matrix-iii/description/
Difficulty: Medium

```python
class Solution:
    def spiralMatrixIII(self, R, C, r0, c0):
        """
        :type R: int
        :type C: int
        :type r0: int
        :type c0: int
        :rtype: List[List[int]]
        """
        max_curcle = max(r0+1, c0+1, R-r0, C-c0)
        
        ret = []
        a, b = r0, c0
        ret.append([a, b])
        
        def inside(a, b):
            if a >= 0 and a < R and b >= 0 and b < C:
                ret.append([a, b])
        
        for i in range(1, max_curcle):
            a, b = a, b + 1
            inside(a, b)
            # south
            for j in range(i*2 - 1):
                a += 1
                inside(a, b)
            # west
            for j in range(i*2):
                b -= 1
                inside(a, b)
            # north
            for j in range(i*2):
                a -= 1
                inside(a, b)
            # east
            for j in range(i*2):
                b += 1
                inside(a, b)
                
        return ret
```
