---
title: leetcode 6 ZigZag Conversion
tags:
categories:
- LeetCode
---

问题描述：https://leetcode.com/problems/zigzag-conversion/description/
官方题解：https://leetcode.com/problems/zigzag-conversion/solution/

## 方法一：按行排序
```python
class Solution:
    def convert(self, s, numRows):
        """
        :type s: str
        :type numRows: int
        :rtype: str
        """
        if numRows == 1 or len(s) < numRows:
            return s
        
        rows = ['' for i in range(numRows)]
        row_index = 0
        row_flag = -1
        
        for ch in s:
            rows[row_index] += ch
            if row_index in (0, numRows-1):
                row_flag *= -1
            row_index += row_flag
  
        return ''.join(rows)
```

## 方法二：
这也是我自己想出来的解法。

```python
class Solution:
    def convert(self, s, numRows):
        """
        :type s: str
        :type numRows: int
        :rtype: str
        """
        if numRows == 1:
            return s
        
        ret = ''
        
        for i in range(0, numRows):
            index = i
            while index < len(s):
                ret += s[index]
                if i not in (0, numRows-1):
                    index1 = index + (numRows-1-i)*2
                    if index1 < len(s):
                        ret += s[index1]
                index += (numRows-1) * 2 
                
        return ret
```