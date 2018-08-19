---
title: 'LeetCode #11 Container With Most Water'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/container-with-most-water/description/
Solution: https://leetcode.com/problems/container-with-most-water/solution/
Difficulty: Medium

## 优化目标
i, j in [0: len(height)]

max((j - i) * min(height[i], height[j]))


## 暴力法
时间复杂度: O(n^2)
空间复杂度：O(1)

结果由于时间复杂度太高而Time Limit Exceed

```python
class Solution:
    def maxArea(self, height):
        """
        :type height: List[int]
        :rtype: int
        """
        most_water = 0
        for i in range(len(height)):
            for j in range(i + 1, len(height)):
                most_water = max(most_water, (j - i)*min(height[i], height[j]))
                
        return most_water
```

## Two Pointer Approach
想了20分钟，毫无头绪。去看了Solution，学习到了这种方法。

思路是贪心法，每一步都向着试图增大面积的方向进行，即改变短边（结果不一定使得面积增加，但相对改变长边，效果一定更好）。具体的正确性证明参见solution，而且solution里还有一个直观的动画，演示了贪心每一步的变化。

时间复杂度：O(n)
空间复杂度：O(1)

```python
class Solution:
    def maxArea(self, height):
        """
        :type height: List[int]
        :rtype: int
        """
        most_water = 0
        l, r = 0, len(height) - 1
        
        while l < r:
            most_water = max(most_water, (r-l) * min(height[l], height[r]))
            if height[l] > height[r]:
                r -= 1
            else:
                l += 1
                
        return most_water
```