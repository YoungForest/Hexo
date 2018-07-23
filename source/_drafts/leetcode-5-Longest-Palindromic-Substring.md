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

## 方法2：动态规划
时间复杂度：O(n^2)
空间复杂度：O(n^2)

```python
import numpy as np

class Solution:
    def longestPalindrome(self, s):
        """
        :type s: str
        :rtype: str
        """
        length = len(s)
        if length == 0:
            return ""
        dp = np.full((length, length), fill_value=False)
        
        max_substring_begin_index = 0  # included
        max_substring_end_index = 0  # included
        max_length = 1
        
        for i in range(length):
            dp[i][i] = True

        for i in range(1, length):
            if s[i] == s[i-1]:
                dp[i-1][i] = True
                if max_length < 2:
                    max_length = 2
                    max_substring_begin_index = i-1
                    max_substring_end_index = i
                
        for i in range(length):
            for j in range(i-2, -1, -1):
                if dp[j+1][i-1] and s[j] == s[i]:
                    dp[j][i] = True
                    if max_length < i + 1 - j:
                        max_length = i + 1 -j
                        max_substring_begin_index = j
                        max_substring_end_index = i
        
        return s[max_substring_begin_index: max_substring_end_index + 1]
```

优化空间复杂度到O(n).
```python
import numpy as np

class Solution:
    def longestPalindrome(self, s):
        """
        :type s: str
        :rtype: str
        """
        length = len(s)
        if length == 0:
            return ""
        dp_old = np.full((length), fill_value=False)
        dp = np.full((length), fill_value=False)
        
        max_substring_begin_index = 0  # included
        max_substring_end_index = 0  # included
        max_length = 1
        
        for i in range(1, length):
            dp[i] = True
            if s[i] == s[i-1]:
                dp[i-1] = True
                
                if max_length < 2:
                    max_length = 2
                    max_substring_begin_index = i-1
                    max_substring_end_index = i
        
            else:
                dp[i-1] = False
                
            for j in range(i-2, -1, -1):
                if dp_old[j+1] and s[j] == s[i]:
                    dp[j] = True
                    if max_length < i + 1 - j:
                        max_length = i + 1 -j
                        max_substring_begin_index = j
                        max_substring_end_index = i
                else:
                    dp[j] = False
            
            dp, dp_old = dp_old, dp

        return s[max_substring_begin_index: max_substring_end_index + 1]

if __name__ == '__main__':
    s = Solution()
    result = s.longestPalindrome('babad')
    print(result)
```

## 方法3：中心扩展法

这个方法比较straightforward，遍历每个回文子串的中心，对其进行最大扩展。

- 时间复杂度：O(n^2)
- 空间复杂度：O(n)

```python
class Solution:
    def longestPalindrome(self, s):
        """
        :type s: str
        :rtype: str
        """
        def expandAroundCenter(s, left, right):
            """
            :type s: str
            :type left: int
            :type right: int
            :rtype int
            """
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            
            return right - left - 1
        
        max_length = 0
        max_substring_begin_index = 0
        max_substring_end_index = 0
        
        for i in range(len(s)):
            len1 = expandAroundCenter(s, i, i)
            len2 = expandAroundCenter(s, i, i+1)
            max_len = max(len1, len2)
            if max_len > max_length:
                max_length = max_len
                max_substring_begin_index = i - (max_length - 1) // 2
                max_substring_end_index = i + max_length // 2
                
        return s[max_substring_begin_index:max_substring_end_index + 1]

if __name__ == '__main__':
    s = Solution()
    result = s.longestPalindrome('babad')
    print(result)
```

## 方法4：神奇的Manacher’s algorithm
英文版：https://articles.leetcode.com/longest-palindromic-substring-part-ii/
中文版：https://www.felix021.com/blog/read.php?2040

自己实现的python版：待续
