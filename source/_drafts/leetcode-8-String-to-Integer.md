---
title: leetcode 8 String to Integer
tags:
categories:
- LeetCode
---

问题描述：https://leetcode.com/problems/string-to-integer-atoi/description/
官方教程：暂无

```python
class Solution:
    def myAtoi(self, str):
        """
        :type str: str
        :rtype: int
        """
        digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        INT_MAX = 2**31 - 1
        INT_MIN = -2**31
        
        ret = 0
        flag = 0
        for i in str:
            if flag == 0 and i == ' ':
                continue
            elif flag == 0 and i in ['-', '+']:
                if i == '-':
                    flag = -1
                else:
                    flag = 1
            elif i in digits:
                if flag == 0:
                    flag = 1
                
                ret = ret * 10 + digits.index(i)
            else:
                break
                
        ret = flag * ret
        
        if ret > INT_MAX:
            return INT_MAX
        if ret < INT_MIN:
            return INT_MIN
        
        return ret
```