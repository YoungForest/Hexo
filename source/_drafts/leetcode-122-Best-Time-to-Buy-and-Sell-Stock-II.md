---
title: leetcode 122 Best Time to Buy and Sell Stock II
tags:
categories:
- LeetCode
---

“Best Time to Buy and Sell Stock”系列共4道题目，昨天推送了“LeetCode #121 Best time to Buy and Sell Stock”，今天把后3道全部解决。
4道题的区别在于：允许买卖的次数不同。
难度依次递增，思路互相之间有可借鉴之处。

Description: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/description/
Solution: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/solution/

```python
class Solution:
    def maxProfit(self, prices):
        """
        :type prices: List[int]
        :rtype: int
        """
        max_profit = 0
        for i in range(1, len(prices)):
            if prices[i-1] < prices[i]:
                max_profit += prices[i] - prices[i-1]
                
        return max_profit
```
