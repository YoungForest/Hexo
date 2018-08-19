---
title: 'LeetCode #20 Valid Parentheses'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/valid-parentheses/description/
Solution: 无
Difficulty: Easy

该题目是联系使用栈的一个入门题目，考察对栈**后进先出**这一特性的了解和应用。

```python
class Solution:
    def isValid(self, s):
        """
        :type s: str
        :rtype: bool
        """
        left = ['(', '[', '{']
        match = {
            ')': '(',
            ']': '[',
            '}': '{'
        }
        
        stack = []
        
        for i in s:
            if i in left:
                stack.append(i)
            else:
                if len(stack) == 0:
                    return False
                
                if match[i] != stack.pop():
                    return False
        
        if len(stack) != 0:
            return False
        
        return True
```