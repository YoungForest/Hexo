---
title: leetcode 746 Min Cost Climbing Stairs
tags:
categories:
- LeetCode
---

动态规划的题目在LeetCode中占很大的比重，共113道，其中大多数难度都是Medium的。
近期打算集中练几天动态规划的题目，希望对动态规划有更深的理解。

这道是我挑出来的一道Easy的DP(Dynamic Programming)的题目，先入个门咱。

问题描述：https://leetcode.com/problems/min-cost-climbing-stairs/description/
官方题解：https://leetcode.com/problems/min-cost-climbing-stairs/solution/#

## 我的题解
```python
class Solution:
    def minCostClimbingStairs(self, cost):
        """
        :type cost: List[int]
        :rtype: int
        """
        if len(cost) < 2:
            return 0
        min_cost = [cost[0], cost[1]]
        cost.append(0)
        
        for i in range(2, len(cost)):
            min_cost.append(min(min_cost[i-1], min_cost[i-2]) + cost[i])
            
        return min_cost.pop()
```

时间复杂度：O(N)
空间复杂度：O(N)

看了官方题解，意识到没有必要把所有的`min_cost`存下来，只需要存前两个就OK了。
所以，空间复杂度可以优化到O(1)。

## 官方题解
这是从后向前算的，我上面的是从前向后算的。
```python
class Solution(object):
    def minCostClimbingStairs(self, cost):
        f1 = f2 = 0
        for x in reversed(cost):
            f1, f2 = x + min(f1, f2), f1
        return min(f1, f2)
```