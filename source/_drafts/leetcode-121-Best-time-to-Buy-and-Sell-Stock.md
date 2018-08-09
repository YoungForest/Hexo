---
title: leetcode 121 Best time to Buy and Sell Stock
tags:
categories:
- LeetCode
---

问题描述：https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/
题解：https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solution/

## 我的submission
与官方题解的Approach 2思路一致。

```python
class Solution:
    def maxProfit(self, prices):
        """
        :type prices: List[int]
        :rtype: int
        """
        if len(prices) == 0:
            return 0
        
        current_min_price = prices[0]
        current_max = 0
        
        for i in prices[1:]:
            current_min_price = min(current_min_price, i)
            current_max = max(current_max, i - current_min_price)
            
        return current_max
```


## Kadane's Algorithm

```python
class Solution:
    def maxProfit(self, prices):
        """
        :type prices: List[int]
        :rtype: int
        """
        max_profit = 0
        left_pointer = 0
        right_pointer = 1
        
        while right_pointer < len(prices):
            max_profit = max(max_profit, prices[right_pointer] - prices[left_pointer])
            if prices[right_pointer] < prices[left_pointer]:
                left_pointer = right_pointer
            right_pointer += 1
        
        return max_profit
```