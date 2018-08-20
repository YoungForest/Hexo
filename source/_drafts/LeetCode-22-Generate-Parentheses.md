---
title: 'LeetCode #22 Generate Parentheses'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/generate-parentheses/description/
Solution: https://leetcode.com/problems/generate-parentheses/solution/
Difficulty: Medium

```python
class Solution:
    def generateParenthesis(self, n):
        """
        :type n: int
        :rtype: List[str]
        """
        ret = []
        
        def generate(left, n, s):
            if left > 0:
                if n > 0:
                    generate(left + 1, n - 1, s + '(')`
                generate(left - 1, n, s + ')')
            else:
                if n > 0:
                    generate(left + 1, n - 1, s + '(')
                else:
                    ret.append(s)
        
        generate(0, n, '')
        
        return ret
```