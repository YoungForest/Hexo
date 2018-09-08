---
title: 'LeetCode #229 Majority Element II'
tags:
categories:
- LeetCode
---

此题是昨天推送的'LeetCode #169 Majority Element'扩展题目，“多数”从超过1半变为超过三分之一。

Description: https://leetcode.com/problems/majority-element-ii/description/
Solution: 无
Difficulty: Medium

```python
class Solution:
    def majorityElement(self, nums):
        """
        :type nums: List[int]
        :rtype: List[int]
        """
        count1, count2, condidate1, condidate2 = 0, 0, 0, 1
        
        for num in nums:
            if num == condidate1:
                count1 += 1
            elif num == condidate2:
                count2 += 1
            elif count1 == 0:
                condidate1 = num
                count1 = 1
            elif count2 == 0:
                condidate2 = num
                count2 = 1
            else:
                count1 -= 1
                count2 -= 1
            
        return [n for n in (condidate1, condidate2) if nums.count(n) > len(nums) // 3]
```

该解法是“Boyer-Moore Majority Vote algorithm”(https://gregable.com/2013/10/majority-vote-algorithm-find-majority.html)一种扩展形式，重点在于理解投票机制的正确性。