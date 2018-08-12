---
title: 'LeetCode #82 Remove Duplicates from Sorted List II'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/description/
Solution: 无
Difficulty: Medium


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
        dummy = ListNode(0)
        dummy.next = head
        
        p = dummy
        q = dummy.next
        
        if q != None:
            q = q.next
        
        while p.next != None and q != None:
            if p.next.val == q.val:
                while q != None and p.next.val == q.val:
                    q = q.next

                p.next = q
                if q != None:
                    q = q.next
            else:
                p = p.next
                q = q.next
                
        return dummy.next
```
