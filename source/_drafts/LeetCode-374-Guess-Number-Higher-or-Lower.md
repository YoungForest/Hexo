---
title: 'LeetCode #374 Guess Number Higher or Lower'
tags:
categories:
- LeetCode
---

这个题目与昨天做的‘LeetCode #35 Search Insert Position’，‘LeetCode #278 First Bad Version’2道题目类似，都是考察二分查找的。不过更加简单的是，寻找的元素是唯一且一定有的。这意味着`high`和`low`2个变量的更新更简单，直接`mid`减一加一就好了。

Description: https://leetcode.com/problems/guess-number-higher-or-lower/description/
Solution: https://leetcode.com/problems/guess-number-higher-or-lower/solution/
Difficulty: Easy


```python
# The guess API is already defined for you.
# @param num, your guess
# @return -1 if my number is lower, 1 if my number is higher, otherwise return 0
# def guess(num):

class Solution(object):
    def guessNumber(self, n):
        """
        :type n: int
        :rtype: int
        """
        low = 0
        high = n
        
        while low < high:
            mid = (low + high) // 2
            guess_result = guess(mid)
            if guess_result == 0:
                return mid
            elif guess_result == 1:
                low = mid + 1
            else:
                high = mid - 1
                
        return low
```

在Solution里，还有一种三分搜索的解法。时间复杂度为`O(log_3 n)`。
以及 二分搜索 和 三分搜索 的比较。事实上，三分查找在时间复杂度上是不占任何优势的。