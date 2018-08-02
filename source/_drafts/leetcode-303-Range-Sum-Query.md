---
title: leetcode 303 Range Sum Query
date: 2018-08-02 21:32:56
tags:
categories:
- LeetCode
---

问题描述：https://leetcode.com/problems/range-sum-query-immutable/description/
官方题解：https://leetcode.com/problems/range-sum-query-immutable/solution/#

## 我的方法

```python
class NumArray:

    def __init__(self, nums):
        """
        :type nums: List[int]
        """
        self.array = []
        for i in range(len(nums)):
            self.array.append([0]*len(nums))
            
        for i in range(len(nums)):
            self.array[i][i] = nums[i]
            
        for j in range(len(nums)):
            for i in range(j - 1, -1, -1):
                self.array[i][j] = self.array[i][(i+j)//2] + self.array[(i+j)//2 + 1][j]

    def sumRange(self, i, j):
        """
        :type i: int
        :type j: int
        :rtype: int
        """
        return self.array[i][j]

# Your NumArray object will be instantiated and called as such:
# obj = NumArray(nums)
# param_1 = obj.sumRange(i,j)
```

时间复杂度：O(n^2)
空间复杂度：O(n^2)

然而Memory Limit Exceeded了。

尝试用一半的空间呢？
```python
class NumArray:

    def __init__(self, nums):
        """
        :type nums: List[int]
        """
        self.array = []
        for i in range(len(nums)):
            self.array.append([0]*(i+1))
            
        for i in range(len(nums)):
            self.array[i][i] = nums[i]
            
        for j in range(len(nums)):
            for i in range(j - 1, -1, -1):
                self.array[j][i] = self.array[(i+j)//2][i] + self.array[j][(i+j)//2 + 1]
        

    def sumRange(self, i, j):
        """
        :type i: int
        :type j: int
        :rtype: int
        """
        return self.array[j][i]


# Your NumArray object will be instantiated and called as such:
# obj = NumArray(nums)
# param_1 = obj.sumRange(i,j)
```

然而Time Limit Exceeded了。

难道是对时间复杂度有限制？官方题解给出的时间复杂度O(n^2), 空间复杂度O(n^2)的方法也是可以Accepted的。难道是Python和Java的区别？
我看到评论中同样有 "用数组代替Pair，结果却是MLE"的疑问。

修改成官方题解的第三种方法：时间复杂度O(n)，空间复杂度O(n)。终于Accepted了。
```python
class NumArray:

    def __init__(self, nums):
        """
        :type nums: List[int]
        """
        self.array = []
        
        sum_nums = 0
        
        self.array.append(sum_nums)
        for i in nums:
            sum_nums += i
            self.array.append(sum_nums)
        
        print(self.array)

    def sumRange(self, i, j):
        """
        :type i: int
        :type j: int
        :rtype: int
        """
        return self.array[j+1] - self.array[i]


# Your NumArray object will be instantiated and called as such:
# obj = NumArray(nums)
# param_1 = obj.sumRange(i,j)
```