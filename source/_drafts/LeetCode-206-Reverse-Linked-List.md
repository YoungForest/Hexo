---
title: 'LeetCode #206 Reverse Linked List'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/reverse-linked-list/description/
Solution: https://leetcode.com/problems/reverse-linked-list/solution/
Difficulty: Easy

反转链表，绝对的经典面试题。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def reverseList(self, head):
        """
        :type head: ListNode
        :rtype: ListNode
        """
        pre = None
        cur = head
        
        while cur != None:
            nxt = cur.next
            cur.next = pre
            pre = cur
            cur = nxt
            
        return pre
```