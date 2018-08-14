---
title: 'LeetCode #59 Spiral Matrix II'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/spiral-matrix-ii/description/
Solution: 无
Difficulty: Medium

```python
class Solution:
    def generateMatrix(self, n):
        """
        :type n: int
        :rtype: List[List[int]]
        """
        ret = [[0] * n for _ in range(n)]
        
        def clockWise(r1, c1, r2, c2):
            for c in range(c1, c2+1):
                yield r1, c
            for r in range(r1+1, r2+1):
                yield r, c2
                
            if r1 < r2 or c1 < c2:
                for c in range(c2-1, c1-1, -1):
                    yield r2, c
                for r in range(r2-1, r1, -1):
                    yield r, c1
                    
        step = 0
        for i in range((n+1)//2):
            for r, c in clockWise(i, i, n - i - 1, n - i - 1):
                step += 1
                ret[r][c] = step
                
        return ret
```