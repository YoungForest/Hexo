---
title: leetcode 7 Reverse Integer
tags:
categories:
- Leetcode
---

问题描述：https://leetcode.com/problems/reverse-integer/description/
官方题解：https://leetcode.com/problems/reverse-integer/solution/

## 方法一：Pop and Push Digits & Check before Overflow
```python
class Solution:
    def reverse(self, x):
        """
        :type x: int
        :rtype: int
        """
        rev = 0
        OVERFLOW_LINE_TOP = (2**31 - 1) // 10

        flag = 1
        if x < 0:
            flag = -1
            x = -x 
        
        while x != 0:
            x, pop = divmod(x, 10)
            
            if rev > OVERFLOW_LINE_TOP or (rev == OVERFLOW_LINE_TOP and ((flag == 1 and pop > 7) or (flag == -1 and pop > 8))):
                return 0
            
            rev = rev * 10 + pop    
            
        return flag * rev

if __name__ == '__main__':
    s = Solution()
    print(s.reverse(-123))
```

这里需要注意，在Python中`%`是`Modulo operation`，而C++ JAVA中是`remainder`。
see this: https://stackoverflow.com/questions/13683563/whats-the-difference-between-mod-and-remainder

## 我的解决方案

```python
class Solution:
    def reverse(self, x):
        """
        :type x: int
        :rtype: int
        """
        top = 2**31
        bottom, top = -top, top - 1      
        
        if x < 0:
            flag = -1
        else:
            flag = 1
            
        x = abs(x)
        
        s = list(str(x))
        s.reverse()
        
        re = flag * int(''.join(s))
        
        if re < bottom or re > top:
            return 0
        
        return re
```