---
title: 'LeetCode #703 Kth Largest Element in a Stream'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/kth-largest-element-in-a-stream/description/
Solution: https://leetcode.com/problems/kth-largest-element-in-a-stream/discuss/
Difficulty: Easy

Hints: 优先队列(PriorityQueue) / 小顶堆(MinHeap)

```python
import queue

class KthLargest:

    def __init__(self, k, nums):
        """
        :type k: int
        :type nums: List[int]
        """
        self.pq = queue.PriorityQueue(k)
        for i in nums:
            temp = None
            if self.pq.full():
                temp = self.pq.get()
            if temp != None and temp > i:
                self.pq.put(temp)
            else:
                self.pq.put(i)

    def add(self, val):
        """
        :type val: int
        :rtype: int
        """
        temp = None
        if self.pq.full():
            temp = self.pq.get()
        if temp != None and temp > val:
            self.pq.put(temp)
            return temp
        else:
            self.pq.put(val)
            ret = self.pq.get()
            self.pq.put(ret)
            return ret


# Your KthLargest object will be instantiated and called as such:
# obj = KthLargest(k, nums)
# param_1 = obj.add(val)
```
