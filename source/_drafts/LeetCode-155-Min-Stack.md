---
title: 'LeetCode #155 Min Stack'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/min-stack/description/
Solution: 无
Difficulty: Easy

经典的维护栈的最小值的数据结构的实现，借助一个辅助栈即可。在面试Face++时遇到过原题。

```python
class MinStack(object):

    def __init__(self):
        """
        initialize your data structure here.
        """
        self.stack = []
        self.min_stack = []
        

    def push(self, x):
        """
        :type x: int
        :rtype: void
        """
        self.stack.append(x)
        if len(self.min_stack) == 0 or x < self.min_stack[len(self.min_stack) - 1]:
            self.min_stack.append(x)
        else:
            self.min_stack.append(self.min_stack[len(self.min_stack) - 1])
        

    def pop(self):
        """
        :rtype: void
        """
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        """
        :rtype: int
        """
        return self.stack[len(self.stack) - 1]
        

    def getMin(self):
        """
        :rtype: int
        """
        return self.min_stack[len(self.min_stack) - 1]


# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(x)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.getMin()
```