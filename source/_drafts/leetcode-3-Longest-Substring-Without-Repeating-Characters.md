---
title: leetcode 3 Longest Substring Without Repeating Characters
date: 2018-07-19 13:57:40
tags:
categories:
- Leetcode
---

问题描述：https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/description/
官方题解：https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/solution/

## 方法1：暴力法
```python
class Solution:
    def lengthOfLongestSubstring(self, s):
        """
        :type s: str
        :rtype: int
        """
        max_substring = 0
        for i in range(len(s)):
            for j in range(i+1, len(s)+1):
                if self.allUnique(s[i:j]):
                    max_substring = max(max_substring, j - i)
                    
        return max_substring
        
    def allUnique(self, s):
        """
        :type s: str
        :rtype: bool
        """
        myset = set()
        for i in s:
            if i in myset:
                return False
            myset.add(i)
            
        return True
```

由于时间复杂度太高 O(n^3)，所以Submit上去后，超时了(Time Limit Exceeded).

## 方法2：滑动窗口法

```python
class Solution:
    def lengthOfLongestSubstring(self, s):
        """
        :type s: str
        :rtype: int
        """
        max_substring = 0
        i, j = 0, 0
        length = len(s)
        while i < length and j < length:
            if s[j] in s[i:j]:
                i += 1
            else:
                j += 1
                max_substring = max(max_substring, j-i)
                
        return max_substring
```

## 方法3：优化的滑动窗口

```python
class Solution:
    def lengthOfLongestSubstring(self, s):
        """
        :type s: str
        :rtype: int
        """
        max_substring = 0
        i = 0
        for j in range(len(s)):
            if s[j] in s[i: j]:
                i = s[i: j].index(s[j]) + i + 1
            max_substring = max(max_substring, j + 1 - i)
            
        return max_substring
```