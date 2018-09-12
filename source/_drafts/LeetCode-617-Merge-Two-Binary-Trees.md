---
title: 'LeetCode #617 Merge Two Binary Trees'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/merge-two-binary-trees/description/
Solution: https://leetcode.com/problems/merge-two-binary-trees/solution/
Difficulty: Easy

二叉树的题目特别适合用递归做，写起来比较简单。

```python
class Solution:
    def mergeTrees(self, t1, t2):
        """
        :type t1: TreeNode
        :type t2: TreeNode
        :rtype: TreeNode
        """
        ret = TreeNode(0)
        if t1 != None and t2 != None:
            ret.val = t1.val + t2.val
            ret.left = self.mergeTrees(t1.left, t2.left)
            ret.right = self.mergeTrees(t1.right, t2.right)
        elif t1 != None:
            ret.val = t1.val
            ret.left = self.mergeTrees(t1.left, None)
            ret.right = self.mergeTrees(t1.right, None)
        elif t2 != None:
            ret.val = t2.val
            ret.left = self.mergeTrees(t2.left, None)
            ret.right = self.mergeTrees(t2.right, None)
        else:
            return None
            
        return ret
```