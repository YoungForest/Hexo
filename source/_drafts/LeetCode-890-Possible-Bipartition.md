---
title: 'LeetCode #890 Possible Bipartition'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/possible-bipartition/description/
Solution: https://leetcode.com/problems/possible-bipartition/solution/
Difficulty: Medium

```python
class Solution:
    def possibleBipartition(self, N, dislikes):
        """
        :type N: int
        :type dislikes: List[List[int]]
        :rtype: bool
        """
        color = [0]
        edge = [[]]
        
        def dfs(i):
            nodes = edge[i]
            for j in nodes:
                if color[j] == 0:
                    color[j] = - color[i]
                    if not dfs(j):
                        return False
                else:
                    if color[j] != -color[i]:
                        return False
            
            return True
        
        for i in range(N):
            color.append(0)
            edge.append([])
        
        for a, b in dislikes:
            edge[a].append(b)
            edge[b].append(a)
        
        for i in range(1, N+1):
            if color[i] == 0:
                color[i] = 1
                if not dfs(i):
                    return False
                
        return True
```
