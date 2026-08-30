---
title: 'LeetCode #136 Single Number'
date: 2018-09-12 15:38:08
tags:
categories:
- LeetCode
description: 只出现一次的数字：从线性时间与常数空间的约束，理解异或的成对抵消性质。
translations:
  zh-CN: https://youngforest.github.io/2018/09/12/LeetCode-136-Single-Number/
  en: https://youngforest.github.io/en/2018/09/12/LeetCode-136-Single-Number/
---
<figure class="editorial-illustration editorial-illustration--hero"><img src="/images/ai/LeetCode-136-Single-Number/zh-hero.webp" width="1536" height="864" alt="Forest 让成对石块穿过抵消拱门消失，只用一只累计碗留下唯一的琥珀石" decoding="async" fetchpriority="high"></figure>

<!-- more -->

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
