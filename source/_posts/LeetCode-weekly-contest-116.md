---
title: LeetCode weekly contest 116
date: 2018-12-26 11:26:03
tags:
- LeetCode
categories:
---

又到周末LeetCode weekly contest的时候了，这次战果不佳。原因主要是，二三题都想做出来，结果都没有做出来。如果把时间都集中于第二题，应该也还是能AC的。

## 961. N-Repeated Element in Size 2N Array
这道题总觉得之前在LeetCode上已经做过了，还记得solution的方向。
思路是这样的，既然有一半的元素是一样的，我们随机抽取2个元素，判断是否相等就可以了。从概率上来讲，虽然有永远算不出来的概率，但在实际应用中效果很好。

```python
import random

class Solution:
    def repeatedNTimes(self, A):
        """
        :type A: List[int]
        :rtype: int
        """
        while True:
            s = random.sample(A, 2)
            if s[0] == s[1]:
                return s[0]
```

## 962. Maximum Width Ramp
或许是最近dp学的有点多，遇见道题目就想着空间换时间。殊不知，忘记了dp的用武之地：
When should we look for a Dynamic Programming solution to a problem?
1. 最优解结构
2. 重叠子问题
找了半天最优解结构和重叠子问题：
dp[x] = max[dp[x] + x - k] for all A[x] >= A[k],
发现时间复杂度和brute search一样，都是O(n^2)呀！

真是dp学魔怔了，忘记了其他更基础的算法。其实这道题用简单的排序就能解决。
排序可以避免二次循环，将复杂度从O(n^2)降为O(n logn)。

```python
class Solution:
    def maxWidthRamp(self, A):
        """
        :type A: List[int]
        :rtype: int
        """
        min_value = math.inf
        ret = 0
        for i in sorted(range(len(A)), key=A.__getitem__):
            min_value = min(min_value, i)
            ret = max(ret, i - min_value)
            
        return ret
```

Solution中还有一种利用二分查找的方法，我觉得很巧妙。
关键点在于注意到，对于j1 < j2, A[j1] <= A[j2], 此时，我们总是倾向于选择j2的。所以，对于这样的输入[6,0,8,2,1,5]，maximum width ramp的A[j] 一定会出现在[5, 8]中。对于i的选择，就需要遍历一遍了。那么A[j]是[5, 8]中的哪一个呢？就需要根据A[i]就行二分查找了，选择比A[i]恰好大一点的A[j]。

```python
import bisect

class Solution:
    def maxWidthRamp(self, A):
        """
        :type A: List[int]
        :rtype: int
        """
        condinates = [(A[-1], len(A)-1)]
        ret = 0
        
        for i in range(len(A)-2, -1, -1):
            jx = bisect.bisect(condinates, (A[i],))
            if jx >= len(condinates):
                condinates.append((A[i], i))
            else:
                ret = max(ret, condinates[jx][1] - i)
            
        return ret
```

## 963. Minimum Area Rectangle II

这道题其实挺恶心的，怪不得downvote >> upvote。对数学的要求远大于算法的要求，brute search( O(n^3) )也能过。

```python
import math
import collections
import itertools

class Solution:
    def minAreaFreeRect(self, points):
        """
        :type points: List[List[int]]
        :rtype: float
        """
        EPS = 1e-7
        points_set = set(map(lambda x: complex(*x), points))
        ans = math.inf
        
        for p1, p2, p3 in itertools.permutations(points_set, 3):
            p4 = p1 + p3 - p2
            if p4 in points_set and abs((p3 - p2).real * (p1 - p2).real + (p3 - p2).imag * (p1 - p2).imag) < EPS:
                ans = min(ans, abs(p1 - p2) * abs(p3 - p2))
                
        return ans if ans < math.inf else 0
```

Solution中还有一种时间复杂度为O(n^2 log n)的解法，利用了矩形的中心这一特点。

## 964. Least Operators to Express Number

上一周的weekly contest竟然拖到本周六才完成，要知道明天就是新的weekly contest啦。我的效率真是感人呀。不过临近年底，真的是事情超级多。不过再忙也不能忘记以“找一份好工作”为中心的纲领。

此题难度为Hard，果然不知道怎么做。看看题解学习学习先。
题解看的一塌糊涂，完全不知所以。幸运的是，找到一份很好理解的[Discuss](https://leetcode.com/problems/least-operators-to-express-number/discuss/208376/python2-O(log-target)-chinese)。
正如作者所云：
> 此题归根结底还是考察对进制的理解

```python
class Solution:
    def leastOpsExpressTarget(self, x, target):
        """
        :type x: int
        :type target: int
        :rtype: int
        """
        rl = []
        while target > 0:
            rl.append(target % x)
            target //= x
            
        n = len(rl)
            
        pos = rl[0] * 2
        neg = (x - rl[0]) * 2
        
        for i in range(1, n):
            pos, neg = min(rl[i] * i + pos, rl[i] * i + i + neg), min((x - rl[i]) * i + pos, (x - rl[i]) * i - i + neg)
            
        return min(pos - 1, n + neg - 1)
```