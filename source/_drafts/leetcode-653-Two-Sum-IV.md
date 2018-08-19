---
title: 'leetcode #653 Two Sum IV'
tags:
categories:
---

Description: https://leetcode.com/problems/two-sum-iv-input-is-a-bst/description/
Solution: https://leetcode.com/problems/two-sum-iv-input-is-a-bst/solution/
Difficulty: Easy

```python
class Solution:
    def findTarget(self, root, k):
        """
        :type root: TreeNode
        :type k: int
        :rtype: bool
        """
        numbers = set()
        queue = collections.deque()
        if root != None:
            queue.append(root)
        
        while len(queue) > 0:
            node = queue.popleft()
            if k - node.val in numbers:
                return True
            numbers.add(node.val)
            if node.left != None:
                queue.append(node.left)
            if node.right != None:
                queue.append(node.right)
                
        return False
```