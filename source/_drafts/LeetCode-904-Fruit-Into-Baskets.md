---
title: 'LeetCode #904 Fruit Into Baskets'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/contest/weekly-contest-102/problems/fruit-into-baskets/
Solution: 无
Difficulty: Medium

此问题可以转化为：返回包括2个数字的最长子数组。

```python
class Solution:
    def totalFruit(self, tree):
        """
        :type tree: List[int]
        :rtype: int
        """
        max_account = 1
        ret = 1
        a = tree[0]
        b = -1
        continuous = 1
        pre = tree[0]
        
        for i in tree[1:]:
            if i == b or i == a:
                max_account += 1
            else:
                max_account = continuous + 1
                
            if i != pre:
                continuous = 1
                a, b = pre, i
            else:
                continuous += 1

                
            ret = max(max_account, ret)
            pre = i
            
        return ret
```