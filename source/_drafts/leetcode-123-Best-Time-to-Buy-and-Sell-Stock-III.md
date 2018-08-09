---
title: leetcode 123 Best Time to Buy and Sell Stock III
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/
Solution: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/discuss/39608/A-clean-DP-solution-which-generalizes-to-k-transactions

```python
class Solution:
    def maxProfit(self, prices):
        """
        :type prices: List[int]
        :rtype: int
        """
        if len(prices) <= 1:
            return 0
        
        dp = [0] * len(prices)
        new_dp = [0] * len(prices)
        max_profit = 0
        
        for i in range(2):
            tmp_max = dp[0] - prices[0]
            
            for j in range(1, len(prices)):
                new_dp[j] = max(new_dp[j-1], prices[j] + tmp_max)
                tmp_max = max(tmp_max, dp[j] - prices[j])
                max_profit = max(max_profit, new_dp[j])
                
            dp, new_dp = new_dp, dp
            
        return max_profit
```
时间复杂度：O(n)
空间复杂度：O(n)