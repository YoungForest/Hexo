---
title: leetcode 740 Delete and Earn
date: 2018-08-03 14:24:22
tags:
categories:
- LeetCode
---

问题描述：https://leetcode.com/problems/delete-and-earn/description/
题解：https://leetcode.com/problems/delete-and-earn/solution/#

第3道DP的题目。然而遗憾的是，通过自己半个小时的独立思考，并没有做出来。忍不住去看了题解，才豁然开朗。还是自己对动态规划这一思想的不熟悉呀。

核心思想在于：对于每一个可以取的值，都有取和不取2种操作。对于每个值k来说，我们维护2个最大值：
- `using`取k时，Earn的最大值
- `avoid`不取k时，Earn的最大值

更新`using`，还面临着k-1取没取的问题。

```python
class Solution:
    def deleteAndEarn(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        count = [0] * 10001
        
        for i in nums:
            count[i] += 1
            
        prev = -1
        using = 0
        avoid = 0
        for k in range(1, 10000):
            if count[k] > 0:
                m = max(using, avoid)
                if k - 1 != prev:
                    using = k * count[k] + m
                else:
                    using = k * count[k] + avoid
                avoid = m
                prev = k
                
        return max(using, avoid)
```

空间复杂度：O(W), W为nums[i]的取值范围。
时间复杂度：O(N+W), N为nums的长度。
