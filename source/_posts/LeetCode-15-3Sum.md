---
title: 'LeetCode #15 3Sum'
date: 2018-10-25 23:54:23
tags:
- LeetCode
categories:
---

这道很经典的题目我恰好在面试“景驰”的时候遇到过，当时是二面的Eric问的。我没做过这道题，但与之关联的2Sum做过（毕竟是LeetCode的首题，大概很多人都做过）。而且算法第4版中讨论算法复杂度的时候，用的也是一样的问题（细节可能不同，比如要求了结果中没有重复的triplet...），当时还有些印象。顺利地写出了O(n^2)时间复杂度的Solution，虽然事后发现有些小bug，比如list的sort是inplace的。但无伤大雅。
今天我把面试时的solution整理了一下，submit后竟然Time Limit Exceeded了。

Description: https://leetcode.com/problems/3sum/description/
Solution: None
Difficulty: Medium

## 面试时的solution

```python
class Solution:
    def threeSum(self, nums):
        """
        :type nums: List[int]
        :rtype: List[List[int]]
        """
        mymap = {}
        results = set()
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if - nums[i] - nums[j] in mymap:
                    a = [- nums[i] - nums[j], nums[i], nums[j]]
                    a.sort()
                    results.add(tuple(a))
            mymap[nums[i]] = i
        
        re = []
        for a in results:
            re.append(list(a))
        return re
```

## 解决超时问题

reference[https://fizzbuzzed.com/top-interview-questions-1/]

总的思想是，O(n^2)的时间复杂度已经不能再低了。更多的是尝试一些小的技巧，降低时间复杂度中的常数。

### 先排序

```python
class Solution:
    def threeSum(self, nums):
        """
        :type nums: List[int]
        :rtype: List[List[int]]
        """
        nums.sort()
        mymap = set()
        results = set()
        for i in range(len(nums)):
            if i > 1 and nums[i] == nums[i-2]:
                continue
            for j in range(i + 1, len(nums)):
                if j != i + 1 and nums[j] == nums[j-1]:
                    continue
                if - nums[i] - nums[j] in mymap:
                    a = [- nums[i] - nums[j], nums[i], nums[j]]
                    a.sort()
                    results.add(tuple(a))
            mymap.add(nums[i])
        
        re = []
        for a in results:
            re.append(list(a))
        return re
```

增加了排序，和2层循环中的判断，使得重复的triplet出现的次数更少(`result.add(tuple(a))`被执行的次数更少)。
观察之前TLE的Test case可以发现，leetcode卡了重复的triplet这块。python `set.add`操作的时间复杂度为O(1)，所以还是被卡了常数。


### two pointer, 空间复杂度降为O(1)

```python
class Solution:
    def threeSum(self, nums):
        """
        :type nums: List[int]
        :rtype: List[List[int]]
        """
        nums.sort()
        results = []
        
        for i in range(len(nums)):
            # never let i refer to the same value twice
            if i != 0 and nums[i] == nums[i-1]:
                continue
                
            j = i + 1
            k = len(nums) - 1
            
            while j < k:
                if nums[i] + nums[j] + nums[k] == 0:
                    results.append([nums[i], nums[j], nums[k]])
                    j += 1
                    k -= 1
                    while j < k and nums[j] == nums[j-1]: # never let j refer the same value twice
                        j += 1
                elif nums[i] + nums[j] + nums[k] < 0:
                    j += 1
                else:
                    k -= 1
        
        return results
```

第一次提交上去仍然是超时，然而啥也没改再次提交就Accepted了。看来leetcode也是看脸。