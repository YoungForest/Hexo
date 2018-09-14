---
title: 'LeetCode #538 Convert BST to Greater Tree'
date: 2018-09-14 19:15:07
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/convert-bst-to-greater-tree/description/
Solution: https://leetcode.com/problems/convert-bst-to-greater-tree/solution/
Difficulty: Easy

此题虽为Easy难度，但一遍写对还是很困难的。
看到二叉树，就要想到用递归解决。本题的一个trick是，如何把需要累加的值这个信息，在递归过程中传递。

递归调用右子树时，需要返回整个右子树的和，将这个和加到根节点上。具体到我的解法，右子树的和可能存在于2个地方。1. 右子树的最左叶子节点 2. 右子树的根节点(此时，右子树无左子树)。

递归调用左子树时，需要把根节点和右子树的和，这些信息传递进去，加到右子树的最左叶子上（也就是右子树中最大的那个值）。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def convertBST(self, root):
        """
        :type root: TreeNode
        :rtype: TreeNode
        """
        def convert(root, addition):
            if root == None:
                return addition
            root.val += convert(root.right, addition)
            if root.left == None:
                return root.val
            return convert(root.left, root.val)
        
        convert(root, 0)
        
        return root
```

时间复杂度O(n)，需要遍历每个节点一次。
空间复杂度 平均O(log n)，最差O(n)，递归调用的最大深度。

看过Solution后，惊觉自己把问题搞得太复杂了。传递累加的值这一信息，通过一个全局变量维护即可。然后再对树右序遍历，代码写起来也简单很多。Solution中的Approach #3最好，其空间复杂度为O(1)。

## 迭代版本（无递归）

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def convertBST(self, root):
        """
        :type root: TreeNode
        :rtype: TreeNode
        """
        total = 0
        stack = []
        
        node = root
        
        while len(stack) > 0 or node != None:
            while node != None:
                stack.append(node)
                node = node.right
            
            node = stack.pop()
            
            total += node.val
            node.val = total
            
            node = node.left
        
        return root
```