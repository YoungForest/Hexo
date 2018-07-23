---
title: leetcode-2-add-two-numbers
date: 2018-07-18 18:12:39
tags:
categories:
---

# 方法：初等数学

[问题描述](https://leetcode-cn.com/problems/add-two-numbers/description/)
[官方题解](https://leetcode-cn.com/problems/add-two-numbers/solution/)

官方的题解是使用了哑结点的，我自己最开始写的是没有用哑结点的，所以我把有无哑结点的版本都给出，这样可以帮助你理解哑结点的好处（减少一个条件语句）。

## 无哑结点的实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def addTwoNumbers(self, l1, l2):
        """
        :type l1: ListNode
        :type l2: ListNode
        :rtype: ListNode
        """
        result_head = None
        add1 = 0
        result = None
        
        while l1 != None and l2 != None:
            sum_l1_l2 = l1.val + l2.val + add1
            val = sum_l1_l2 % 10

            # 无哑结点需要加此判断
            if result != None:
                result.next = ListNode(val)
                result = result.next
            else:
                result = ListNode(val)
                result_head = result
            add1 = sum_l1_l2 // 10
            
            l1 = l1.next
            l2 = l2.next
            
        if l1 != None:
            l = l1
        else:
            l = l2
        
        while l != None:
            sum_l = l.val + add1
            val = sum_l % 10
            result.next = ListNode(val)
            result = result.next
            add1 = sum_l // 10
            
            l = l.next
            
        if add1 > 0:
            result.next = ListNode(add1)
            
        return result_head
```

## 有哑结点的实现

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def addTwoNumbers(self, l1, l2):
        """
        :type l1: ListNode
        :type l2: ListNode
        :rtype: ListNode
        """
        dummy_head = ListNode(0)
        add1 = 0
        result = dummy_head
        
        while l1 != None and l2 != None:
            sum_l1_l2 = l1.val + l2.val + add1
            val = sum_l1_l2 % 10
            result.next = ListNode(val)
            result = result.next

            add1 = sum_l1_l2 // 10
            
            l1 = l1.next
            l2 = l2.next
            
        if l1 != None:
            l = l1
        else:
            l = l2
        
        while l != None:
            sum_l = l.val + add1
            val = sum_l % 10
            result.next = ListNode(val)
            result = result.next
            add1 = sum_l // 10
            
            l = l.next
            
        if add1 > 0:
            result.next = ListNode(add1)
            
        return dummy_head.next
```

## 拓展

由于进位是从低到高进位，如果不是逆序存储的话，可以通过2个栈将其转换为逆序存储，再进行计算。

这是我能想到的一个题解，空间复杂度O(m+n)，因为要使用2个栈，栈的大小分别为m, n, 还有新链表的长度为max(m, n)+1。
加一是因为使用了哑结点。

时间复杂度O(m+n)，生成栈需m+n，释放栈和生成新链表需max(m, n)。