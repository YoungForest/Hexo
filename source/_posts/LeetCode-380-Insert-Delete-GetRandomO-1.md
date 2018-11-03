---
title: 'LeetCode #380 Insert Delete GetRandom O(1)'
date: 2018-10-26 23:19:20
tags:
- LeetCode
categories:
---

此题的重点在于理解“average O(1) time”，这是也是时间复杂度分析中的一个重要概念"amortized"。
在 算法第4版 中，很多数据结构的操作的分析都是用的这个方法。所以，“amortized time complexity"常常和对应的数据结构的操作相对应。我5月时面试旷世科技的时候，第二题问的是构造一个维护最大值的队的数据结构，最后要求操作的时间复杂度是“amortized O(1)"。很遗憾，当时我对“amortized"这一概念还不熟悉，对最差情况下的时间复杂度分析的倒是可以，虽然在面试官的引导下最后得出正确答案，但可想而知，最后的结果是no hire。

Description: https://leetcode.com/problems/insert-delete-getrandom-o1/description/
Solution: None
Difficulty: Medium

[answer](https://leetcode.com/problems/insert-delete-getrandom-o1/discuss/85401/Java-solution-using-a-HashMap-and-an-ArrayList-along-with-a-follow-up.-(131-ms))

关键点在于，利用hashmap查找效率为O(1),ArrayList很方便用下标来产生随机数。

```python
class RandomizedSet:

    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.array = []
        self.index_map = {}
        

    def insert(self, val):
        """
        Inserts a value to the set. Returns true if the set did not already contain the specified element.
        :type val: int
        :rtype: bool
        """
        if val in self.index_map:
            return False
        
        self.index_map[val] = len(self.array)
        self.array.append(val)
        
        return True
        

    def remove(self, val):
        """
        Removes a value from the set. Returns true if the set contained the specified element.
        :type val: int
        :rtype: bool
        """
        if val not in self.index_map:
            return False
        
        self.array[self.index_map[val]] = self.array[-1]
        self.index_map[self.array[-1]] = self.index_map[val]
        self.array.pop()
        self.index_map.pop(val)
        
        return True
        

    def getRandom(self):
        """
        Get a random element from the set.
        :rtype: int
        """
        rnd = random.randint(0, len(self.array)-1)
        
        return self.array[rnd]
        


# Your RandomizedSet object will be instantiated and called as such:
# obj = RandomizedSet()
# param_1 = obj.insert(val)
# param_2 = obj.remove(val)
# param_3 = obj.getRandom()
```