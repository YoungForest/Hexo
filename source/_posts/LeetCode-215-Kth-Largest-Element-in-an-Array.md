---
title: 'LeetCode #215 Kth Largest Element in an Array'
date: 2018-09-15 11:20:06
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/kth-largest-element-in-an-array/description/
Solution: https://leetcode.com/problems/kth-largest-element-in-an-array/discuss/
Difficulty: Medium

这是二师兄面试景驰的一道题目。因为他的面试在上午，我的在下午。所以，和他交流过面试内容后，我把他被面的题目都做了一遍。包括这道题目和[找硬币](https://leetcode.com/problems/coin-change/description/)。

## 我的动态规划

```python
class Solution:
    def findKthLargest(self, nums, k):
        """
        :type nums: List[int]
        :type k: int
        :rtype: int
        """
        memo = {}
        mi = nums[0]
        ma = nums[0]
        for i in range(len(nums)):
            ma = max(ma, nums[i])
            mi = min(mi, nums[i])
            memo[(i, i+1)] = mi
            memo[(i, 1)] = ma
            
        def find(n, k):
            if (n, k) in memo:
                return memo[(n, k)]
            
            n_sub_1_k = find(n-1, k)
            
            if nums[n] <= n_sub_1_k:
                return n_sub_1_k
            
            n_sub_1_k_sub_1 = find(n-1, k-1)
            
            if nums[n] >= n_sub_1_k_sub_1:
                return n_sub_1_k_sub_1
            else:
                return nums[n]
            
        return find(len(nums)-1, k)
```

时间复杂度 O(n^2)，memo中的每个元素需要遍历一遍;
空间复杂度 O(n^2)，创建一个二维的memo.

结果：TLE 超时。
还不如直接快排找第k个值。

## [选择算法](https://en.wikipedia.org/wiki/Selection_algorithm)

```python
class Solution:
    def findKthLargest(self, nums, k):
        """
        :type nums: List[int]
        :type k: int
        :rtype: int
        """
        def partition(nums, lo, hi):
            i = lo + 1
            j = hi
            
            while True:
                while i <= hi and nums[i] < nums[lo]:
                    i += 1
                while j > lo and nums[j] > nums[lo]:
                    j -= 1
                
                if i >= j:
                    break
                    
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
                j -= 1
                
            nums[lo], nums[j] = nums[j], nums[lo]
            
            return j
        
        lo = 0
        hi = len(nums) - 1
        k = len(nums) - k
        
        while lo < hi:
            j = partition(nums, lo, hi)
            if j < k:
                lo = j + 1
            elif j > k:
                hi = j - 1
            else:
                break
            
        return nums[k]
```

和快排很像，尤其是`partition`部分。
时间复杂度O(n)，空间复杂度O(n)。
具体解释见[Discuss](https://leetcode.com/problems/kth-largest-element-in-an-array/discuss/60294/Solution-explained)。