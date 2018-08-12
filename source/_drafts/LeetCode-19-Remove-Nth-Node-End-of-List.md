---
title: 'LeetCode #19 Remove Nth Node End of List'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/
Solution: https://leetcode.com/problems/remove-nth-node-from-end-of-list/solution/
Difficulty: Medium

## 我的submission

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def removeNthFromEnd(self, head, n):
        """
        :type head: ListNode
        :type n: int
        :rtype: ListNode
        """
        q = p = head
        
        for i in range(n):
            if q == None:
                return head
            q = q.next
        
        if q == None:
            head = head.next
            del p
            return head
        
        while q.next != None:
            p = p.next
            q = q.next
        
        delete_node = p.next
        p.next = p.next.next
        del delete_node
        
        return head
```

思路与Solution中Approach 2相同。只是没有用到dummy node。做过几道链表题后，确实发觉了dummy node的优势，以后要有意识地使用dummy node以简化代码。