---
title: leetcode 12 Integer to Roman
tags:
categories:
- LeetCode
---

问题描述：https://leetcode.com/problems/integer-to-roman/description/
官方题解：暂无

```python
class Solution:
    def intToRoman(self, num):
        """
        :type num: int
        :rtype: str
        """
        def construct_map(one, five, ten):
            """
            :type one: char
            :type five: char
            :type ten: char
            """
            return {
                0: '',
                1: one,
                2: one * 2,
                3: one * 3,
                4: one + five,
                5: five,
                6: five + one,
                7: five + one * 2,
                8: five + one * 3,
                9: one + ten
            }
        
        digits = [construct_map('I', 'V', 'X'), construct_map('X', 'L', 'C'), construct_map('C', 'D', 'M'), construct_map('M', '', '')]
        ret = ''
        i = 0
        while num > 0:
            pop, num = num % 10, num // 10
            ret = digits[i][pop] + ret
            i += 1
            
        return ret
```
