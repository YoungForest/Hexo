---
title: leetcode 5 Longest Palindromic Substring
date: 2018-07-23 16:48:45
tags:
categories:
---

keyword:
- Palindrome
- Dynamic Programming
- String Manipulation

问题描述：https://leetcode.com/problems/longest-palindromic-substring/description/
官方题解：https://leetcode.com/problems/longest-palindromic-substring/solution/

## 方法1：暴力法
复杂度：O(n^3)
3层`for`循环。

```python
class Solution:
    def longestPalindrome(self, s):
        """
        :type s: str
        :rtype: str
        """
        def isPalindrome(s):
            length = len(s)
            for i in range(length):
                if s[i] != s[length - 1 - i]:
                    return False
            return True
    
        length = len(s)
        max_length = 0
        max_substring_begin_index = 0
        max_substring_end_index = 0
        for i in range(length):
            for j in range(i+1, length+1):
                if isPalindrome(s[i:j]) and max_length <= j - i:
                    max_length = j - i
                    max_substring_begin_index = i
                    max_substring_end_index = j
                    
        return s[max_substring_begin_index: max_substring_end_index]
```
