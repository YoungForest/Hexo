---
title: leetcode 70 Climbing Stairs
tags:
categories:
- LeetCode
---

此题的本质是菲波那切数列。与昨天的推送“#747 Min Cost Climbing Stairs”一起看，效果更佳。
虽然是一道Easy的题目，但是从题解中还是学到很多求菲波那切数列的技巧，在此总结。

问题描述：https://leetcode.com/problems/climbing-stairs/description/
题解：https://leetcode.com/problems/climbing-stairs/solution/

```python
class Solution:
    def climbStairs(self, n):
        """
        :type n: int
        :rtype: int
        """
        if n <= 0:
            return 0
        step_n_sub_2 = 1
        step_n_sub_1 = 1
        
        for i in range(1, n):
            step_n_sub_1, step_n_sub_2 = step_n_sub_1 + step_n_sub_2, step_n_sub_1
        
        return step_n_sub_1
```

时间复杂度：O(n)
空间复杂度：O(1)

题解中一共给出了6种方法，其中第5种和第6种的时间复杂度达到了惊人的O(log(n))，学习一个。相当于2种计算菲波那切数列的快捷方法。

## Binets Method
```python
class Solution:
    def climbStairs(self, n):
        """
        :type n: int
        :rtype: int
        """
        unit = [[1, 1], [1, 0]]
        
        def multiply(a, b):
            c = [[0, 0], [0, 0]]
            
            for i in range(2):
                for j in range(2):
                    c[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j]
                    
            return c
        
        def power(mat, n):
            ret = [[1, 0], [0, 1]]
            while n > 0:
                if n % 2 == 1:
                    ret = multiply(mat, ret)
                n //= 2
                mat = multiply(mat, mat)
                
            return ret
        
        return power(unit, n)[0][0]
```

## Fibonacci Formula
题解中有一些细节的错误，如评论中指出的：
> Approach 6 says F0 = 1, F1 = 1, F1 = 2. The second F1 should be F2.
> 
> B is (sqrt5 - 1)/2sqrt5, not (1-sqrt5)/2sqrt5.
还有最开始给出的那个公式指的是F_0 = 0, F_1 = 1的菲波那切数列，而最后给出的公式是该题用到的F_1 = 1, F_2 = 1的菲波那切数列。

```python
import math 

class Solution:
    def climbStairs(self, n):
        """
        :type n: int
        :rtype: int
        """
        sqrt5 = math.sqrt(5)
        
        return int((pow((1+sqrt5)/2, n+1) - pow((1-sqrt5)/2, n+1))/sqrt5)
```

Time complexity : O(log(n)). `pow` method takes log(n) time.
Space complexity : O(1). Constant space is used.