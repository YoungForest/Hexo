---
title: C++ 中实现生成器(Generator, yield in Python)
date: 2019-12-15 21:34:30
tags:
- C++
categories:
- Programming
---

问题的起因是因为LeetCode上的一个题目[1286. Iterator for Combination](https://leetcode.com/problems/iterator-for-combination/)。最完美的实现是利用 生成器(Generator)，也就是Python中的`yield`。但是我不会，只实现了一个提前计算，然后存起来的解法。并不优雅，赛后，学习了一个C++中Generator的实现，在此分享下。因为我并未在网上找到很好的中文的关于此的文章。