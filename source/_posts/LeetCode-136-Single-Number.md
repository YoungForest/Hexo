---
title: 'LeetCode #136 Single Number'
date: 2018-09-12 15:38:08
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/single-number/description/
Solution: https://leetcode.com/problems/single-number/solution/
Difficulty: Easy

题目的难点在于：Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?

我苦思冥想，实在无法同时满足时间复杂度O(n)，空间复杂的O(1)的要求。跑去看题解，Approach 4满足条件。使用了异或的位运算的性质，确实需要技巧。也可以看到评论区充满了"awesome"的感叹。会者不难，以后再遇到就Easy了。

```python
class Solution:
    def singleNumber(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        ret = 0
        for i in nums:
            ret ^= i
            
        return ret
```