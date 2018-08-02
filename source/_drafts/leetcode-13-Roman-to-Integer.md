---
title: leetcode 13 Roman to Integer
tags:
categories:
- LeetCode
---

问题描述：https://leetcode.com/problems/roman-to-integer/description/
官方教程：暂无

```python
class Solution:
    def romanToInt(self, s):
        """
        :type s: str
        :rtype: int
        """
        roman_map = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000,
            '': 10000000
        }
        
        last_state = ''
        ret = 0
        for i in s:
            if roman_map[last_state] < roman_map[i]:
                ret += roman_map[i] - 2*roman_map[last_state]
            else:
                ret += roman_map[i]
            last_state = i
            
        return ret
```