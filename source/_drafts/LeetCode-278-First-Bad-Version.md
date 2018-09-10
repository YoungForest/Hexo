---
title: 'LeetCode #278 First Bad Version'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/first-bad-version/description/
Solution: https://leetcode.com/problems/first-bad-version/solution/
Difficulty: Easy

## 二分查找

```python
# The isBadVersion API is already defined for you.
# @param version, an integer
# @return a bool
# def isBadVersion(version):

class Solution:
    def firstBadVersion(self, n):
        """
        :type n: int
        :rtype: int
        """
        low = 1
        high = n
        
        while low < high:
            mid = (low + high) // 2
            if isBadVersion(mid):
                high = mid
            else:
                low = mid + 1
                
        return low
```

需要注意`high = mid`而不是`high = mid - 1`。