---
title: 'LeetCode #141 Linked List Cycle'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/linked-list-cycle/description/
Solution: https://leetcode.com/problems/linked-list-cycle/solution/
Difficulty: Easy

```python
# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution(object):
    def hasCycle(self, head):
        """
        :type head: ListNode
        :rtype: bool
        """
        quick = head
        slow = head
        
        while quick != None:
            quick = quick.next
            if quick == slow:
                return True
            
            if quick != None:
                quick = quick.next
                
            slow = slow.next
            
        return False
```