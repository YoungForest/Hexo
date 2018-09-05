---
title: 'LeetCode #543 Diameter of Binary Tree'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/diameter-of-binary-tree/description/
Solution: https://leetcode.com/problems/diameter-of-binary-tree/solution/
Difficulty: Easy

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution(object):
    def diameterOfBinaryTree(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        global max_distance
        max_distance = 1
        
        def depthOfBinaryTree(root):
            if root == None:
                return 0
            
            depth_left = depthOfBinaryTree(root.left)
            depth_right = depthOfBinaryTree(root.right)
            global max_distance
            max_distance = max(max_distance, depth_left + depth_right + 1)
            return max(depth_left, depth_right) + 1
        
        depthOfBinaryTree(root)
        
        return max_distance - 1
```
