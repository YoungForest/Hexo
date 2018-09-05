---
title: 'LeetCode #572 Subtree of Another Tree'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/subtree-of-another-tree/description/
Solution: https://leetcode.com/problems/subtree-of-another-tree/solution/
Difficulty: Easy

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def isSubtree(self, s, t):
        """
        :type s: TreeNode
        :type t: TreeNode
        :rtype: bool
        """
        def equalTree(s, t):
            if s == None and t == None:[4,1,2]
                return True
            if s == None or t == None or s.val != t.val:
                return False
            
            return equalTree(s.left, t.left) and equalTree(s.right, t.right)
        
        if equalTree(s, t):
            return True
        
        if s == None:
            return False
        
        return self.isSubtree(s.left, t) or self.isSubtree(s.right, t)
```

其实与Solution中的Approach #2是一样的。