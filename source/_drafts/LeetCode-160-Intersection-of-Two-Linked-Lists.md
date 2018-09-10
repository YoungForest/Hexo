---
title: 'LeetCode #160 Intersection of Two Linked Lists'
tags:
categories:
- LeetCode
---

Description: https://leetcode.com/problems/intersection-of-two-linked-lists/description/
Solution: https://leetcode.com/problems/intersection-of-two-linked-lists/solution/
Difficulty: Easy

也是一道经典的链表题目。虽然难度为简单，但会者不难，难者不会。如何在O(m+n)的时间复杂度，O(1)的空间复杂度内解决，还是很tricky的。

```python
# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution(object):
    def getIntersectionNode(self, headA, headB):
        """
        :type head1, head1: ListNode
        :rtype: ListNode
        """
        if headA == None or headB == None:
            return None

        tailA, tailB = None, None
        pA = headA
        pB = headB
        
        while pA != pB:
            if pA.next == None:
                tailA = pA
                if tailB != None and tailA != tailB:
                    return None
                pA = headB
            else:
                pA = pA.next
                
            if pB.next == None:
                tailB = pB
                if tailA != None and tailA != tailB:
                    return None
                pB = headA
            else:
                pB = pB.next
                
        return pA
```

解法的关键在于 充分利用2条链表的长度差。