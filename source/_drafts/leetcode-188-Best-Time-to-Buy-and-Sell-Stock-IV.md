---
title: leetcode 188 Best Time to Buy and Sell Stock IV
tags:
categories:
- LeetCode
---

Decription: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/description/
Solution: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/discuss/54113/A-Concise-DP-Solution-in-Java

思路与“LeetCode #123 Best Time to Buy and Sell Stock III”完全一样，**123**事实上是本题的一种特殊情况，即`k=2`。
区别在于增加了`quickSolve`判断，以防止TLE，此时问题转化为“LeetCode 122 Best Time to Buy and Sell Stock II”，允许无限次数的买卖。

```python
class Solution:
    def maxProfit(self, k, prices):
        """
        :type k: int
        :type prices: List[int]
        :rtype: int
        """
        if len(prices) <= 1:
            return 0
        
        if k >= len(prices) // 2:
            return self.quickSolve(prices)
        
        dp = [0] * len(prices)
        new_dp = [0] * len(prices)
        max_profit = 0
        
        for i in range(k):
            tmp_max = dp[0] - prices[0]
            
            for j in range(1, len(prices)):
                new_dp[j] = max(new_dp[j-1], prices[j] + tmp_max)
                tmp_max = max(tmp_max, dp[j] - prices[j])
                max_profit = max(max_profit, new_dp[j])
                
            dp, new_dp = new_dp, dp
            
        return max_profit
    
    def quickSolve(self, prices):
        max_profit = 0
        
        for i in range(1, len(prices)):
            if prices[i - 1] < prices[i]:
                max_profit += prices[i] - prices[i - 1]
                
        return max_profit
```