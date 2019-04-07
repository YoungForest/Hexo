---
title: LeetCode 258 Add Digits
date: 2019-04-06 17:08:06
tags:
- LeetCode
categories:
- Programming
---

今天刷题的时候遇到一个有趣的题目，求一个数字各个位相加的和，知道和小于10。[链接](https://leetcode.com/problems/add-digits/description/).
题目本身并不难，递归或者迭代都可以解决。但如何在O(1)的复杂度内求解，才是真正的考点。

答案很简单: 1 + (num - 1) % 9.
有兴趣的可以看看证明和扩展: [wikipedia](https://en.wikipedia.org/wiki/Digital_root#Congruence_formula).