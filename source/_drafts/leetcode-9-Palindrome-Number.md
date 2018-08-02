---
title: leetcode 9 Palindrome Number
tags:
categories:
- LeetCode
---

问题描述：https://leetcode.com/problems/palindrome-number/description/
官方题解：https://leetcode.com/articles/palindrome-number/

## 我的解法
```python
class Solution:
    def isPalindrome(self, x):
        """
        :type x: int
        :rtype: bool
        """
        if x < 0:
            return False
        
        numbers = []
        
        while x > 0:
            digit, x = x % 10, x // 10
            numbers.append(digit)
            
        i = 0
        j = len(numbers) - 1
        while i < j:
            if numbers[i] != numbers[j]:
                return False
            i += 1
            j -= 1
            
        return True
```

时间复杂度：$O(log_{10}(n))$，即数字的长度。
空间复杂度：$O(log_{10}(n))$, 因为需要额外的列表存储数字。

## 不需要额外空间的官方题解
```python
class Solution:
    def isPalindrome(self, x):
        """
        :type x: int
        :rtype: bool
        """
        if x < 0 or (x != 0 and x % 10 == 0):
            return False
        
        reverted_number = 0
        
        while x > reverted_number:
            reverted_number = reverted_number * 10 + x % 10
            x //= 10
            
        return x == reverted_number or x == reverted_number // 10
```

时间复杂度：$O(log_{10}(n))$，即数字的长度。
空间复杂度：$O(1)$.