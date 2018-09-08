---
title: 'LeetCode #169 Majority Element'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/majority-element/description/
Solution: https://leetcode.com/problems/majority-element/solution/
Difficulty: Easy

```python
import collections

class Solution:
    def majorityElement(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        counter = collections.Counter(nums)
        
        for i in counter:
            if counter[i] > len(nums) // 2:
                return i
            
        return None
```

此题的Solution里提供了6种解法，能学到很多知识，一定要看。