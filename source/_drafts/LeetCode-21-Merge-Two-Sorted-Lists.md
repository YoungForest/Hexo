---
title: 'LeetCode #21 Merge Two Sorted Lists'
tags:
categories:
- LeetCode
---

合并2个有序链表。我在实验室招收实习生时，作为面试官，还用这道题面试过学生。可惜的是，作为6系大三毕业的学生，很多人连这么简单的题目也写不好。所以说，没有基础并不可怕，这些差距只要努力都是可以弥补的。

Description: https://leetcode.com/problems/merge-two-sorted-lists/description/
Solution: 无
Difficulty: Easy

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def mergeTwoLists(self, l1, l2):
        """
        :type l1: ListNode
        :type l2: ListNode
        :rtype: ListNode
        """
        dummy = ListNode(0)
        cur = dummy
        
        node1 = l1
        node2 = l2
        
        while node1 != None and node2 != None:
            if node1.val < node2.val:
                cur.next = ListNode(node1.val)
                node1 = node1.next
            else:
                cur.next = ListNode(node2.val)
                node2 = node2.next
            
            cur = cur.next
            
        if node1 != None:
            node = node1
        else:
            node = node2
            
        while node != None:
            cur.next = ListNode(node.val)
            node = node.next
            cur = cur.next
            
        return dummy.next
```
