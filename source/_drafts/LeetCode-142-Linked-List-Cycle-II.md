---
title: 'LeetCode #142 Linked List Cycle II'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/linked-list-cycle-ii/description/
Difficulty: Medium

```python
# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution(object):
    def detectCycle(self, head):
        """
        :type head: ListNode
        :rtype: ListNode
        """
        if head == None or head.next == None:
            return None
        
        slow = head
        fast = head.next
        
        step = 0
        
        while fast != slow:
            if fast.next == None or fast.next.next == None:
                return None
            
            fast = fast.next.next
            slow = slow.next
            step += 1
            
        first = head
        second = head
        k = step + 1
        while k > 0:
            first = first.next
            k -= 1
            
        while first != second:
            first = first.next
            second = second.next
            
        return first
```