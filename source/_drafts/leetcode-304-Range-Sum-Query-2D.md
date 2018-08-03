---
title: leetcode 304 Range Sum Query 2D
tags:
categories:
- LeetCode
---

本题和昨天的推送`#303`题是一脉相承的，从1维求和扩展成为2维求和。有了昨天的经验，这道题做起来容易多了，而且一上来就想到了最优的解法。LeetCode还有一道“Range Sum Query 2D - Mutable"的题目，不过需要Premium才能做，"$35/mo, $159/yr"。作为一个贫穷的学生，只能放弃了。

问题描述：https://leetcode.com/problems/range-sum-query-2d-immutable/description/
题解：https://leetcode.com/problems/range-sum-query-2d-immutable/solution/#

```python
class NumMatrix:

    def __init__(self, matrix):
        """
        :type matrix: List[List[int]]
        """
        self.sum = []
        if len(matrix) == 0 or len(matrix[0]) == 0:
            return
        cols = len(matrix[0])
        rows = len(matrix)
        
        
        
        for i in range(rows):
            row = []
            self.sum.append(row)
            sum_of_row = 0
            for j in range(cols):
                sum_of_row += matrix[i][j]
                if i > 0:
                    row.append(sum_of_row + self.sum[i-1][j])
                else:
                    row.append(sum_of_row)
                

    def sumRegion(self, row1, col1, row2, col2):
        """
        :type row1: int
        :type col1: int
        :type row2: int
        :type col2: int
        :rtype: int
        """
        if row1 == 0 and col1 == 0:
            return self.sum[row2][col2]
        elif row1 == 0 and col1 != 0:
            return self.sum[row2][col2] - self.sum[row2][col1-1]
        elif row1 != 0 and col1 == 0:
            return self.sum[row2][col2] - self.sum[row1-1][col2]
        else:
            return self.sum[row2][col2] - self.sum[row1-1][col2] - self.sum[row2][col1-1] + self.sum[row1-1][col1-1]
        


# Your NumMatrix object will be instantiated and called as such:
# obj = NumMatrix(matrix)
# param_1 = obj.sumRegion(row1,col1,row2,col2)
```

使用dummy行和列的版本。好处是 省去很多条件语句。

```python
class NumMatrix:

    def __init__(self, matrix):
        """
        :type matrix: List[List[int]]
        """
        self.sum = []
        if len(matrix) == 0 or len(matrix[0]) == 0:
            return
        cols = len(matrix[0])
        rows = len(matrix)
        
        row = [0] * (cols + 1)
        self.sum.append(row)
        
        for i in range(rows):
            row = []
            self.sum.append(row)
            sum_of_row = 0
            row.append(sum_of_row)
            for j in range(cols):
                sum_of_row += matrix[i][j]
                if i > 0:
                    row.append(sum_of_row + self.sum[i][j+1])
                else:
                    row.append(sum_of_row)
                

    def sumRegion(self, row1, col1, row2, col2):
        """
        :type row1: int
        :type col1: int
        :type row2: int
        :type col2: int
        :rtype: int
        """
        return self.sum[row2+1][col2+1] - self.sum[row1][col2+1] - self.sum[row2+1][col1] + self.sum[row1][col1]
        


# Your NumMatrix object will be instantiated and called as such:
# obj = NumMatrix(matrix)
# param_1 = obj.sumRegion(row1,col1,row2,col2)
```
