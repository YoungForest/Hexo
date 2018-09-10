---
title: 'LeetCode #92 Reverse Linked List II'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/reverse-linked-list-ii/description/
Solution: 无
Difficulty: Medium

和前一个题目'LeetCode #206 Reverse Linked List'类似，关键在于处理`m=1`的情况，导致代码比较长。
看了讨论区，使用dummy node可以避免`m=1`的分支，使得代码更短。

```python
class Solution:
    def reverseBetween(self, head, m, n):
        """
        :type head: ListNode
        :type m: int
        :type n: int
        :rtype: ListNode
        """
        pre = head
        if m > 1:
            count = 2
            while count < m:
                count += 1
                pre = pre.next
                
            before = pre
            tail = before.next
            
            cur = pre.next
        else:
            count = 1
            tail = head
            cur = head

        pre = None
        
        while cur != None and count <= n:
            nxt = cur.next
            cur.next = pre
            pre = cur
            cur = nxt
            count += 1
            
        if m > 1:
            before.next = pre
            newhead = head
        else:
            newhead = pre
        tail.next = cur
        
        return newhead
```

## 使用dummy node的版本

```python
class Solution:
    def reverseBetween(self, head, m, n):
        """
        :type head: ListNode
        :type m: int
        :type n: int
        :rtype: ListNode
        """
        if head == None:
            return None
        
        dummy = ListNode(0)
        dummy.next = head
        
        pre = dummy
        count = 1
        while count < m:
            count += 1
            pre = pre.next

        before = pre
        tail = before.next

        cur = pre.next

        pre = None
        
        while cur != None and count <= n:
            nxt = cur.next
            cur.next = pre
            pre = cur
            cur = nxt
            count += 1
            

        before.next = pre
        tail.next = cur
        
        return dummy.next
```

使用dummy node确实有很多好处（减少分支和边界的思考难度），以后可以有意识地去使用。