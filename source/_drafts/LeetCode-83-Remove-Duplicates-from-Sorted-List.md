---
title: 'LeetCode #83 Remove Duplicates from Sorted List'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/remove-duplicates-from-sorted-list/description/
Solution: https://leetcode.com/problems/remove-duplicates-from-sorted-list/solution/
Difficulty: Easy

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def deleteDuplicates(self, head):
        """
        :type head: ListNode
        :rtype: ListNode
        """
        dummy = ListNode('0')
        dummy.next = head
        
        p = dummy
        while p.next != None:
            if p.val == p.next.val:
                p.next = p.next.next
                continue
            
            p = p.next
                
        return head
```