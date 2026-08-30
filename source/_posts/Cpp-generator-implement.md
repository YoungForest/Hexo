---
title: C++ 中实现生成器(Generator, yield in Python)
date: 2019-12-15 21:34:30
tags:
- C++
categories:
- Programming
description: 从一道组合迭代器题出发，对比预先计算并保存全部结果，与按需逐个产出的生成器思路。
translations:
  zh-CN: https://youngforest.github.io/2019/12/15/Cpp-generator-implement/
  en: https://youngforest.github.io/en/2019/12/15/Cpp-generator-implement/
---
问题的起因是因为LeetCode上的一个题目[1286. Iterator for Combination](https://leetcode.com/problems/iterator-for-combination/)。最完美的实现是利用 生成器(Generator)，也就是Python中的`yield`。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/Cpp-generator-implement/zh-hero.webp" alt="一边的仓库先堆满全部组合零件再开门，另一边的小型生成器每转动一次只送出下一枚零件" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

但是我不会，只实现了一个提前计算，然后存起来的解法。并不优雅，赛后，学习了一个C++中Generator的实现，在此分享下。因为我并未在网上找到很好的中文的关于此的文章。
