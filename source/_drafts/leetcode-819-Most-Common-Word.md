---
title: leetcode 819 Most Common Word
tags:
categories:
- Leetcode
---

一道Easy难度的题目。此题的考察的是基本的数据结构和build-in函数的使用，如 字典，对字符串的处理。不存在算法上的优化和考察。

问题描述：https://leetcode.com/problems/most-common-word/description/
官方题解：https://leetcode.com/problems/most-common-word/solution/

```python
class Solution:
    def mostCommonWord(self, paragraph, banned):
        """
        :type paragraph: str
        :type banned: List[str]
        :rtype: str
        """
        paragraph = paragraph.replace('!', ' ')
        paragraph = paragraph.replace('?', ' ')
        paragraph = paragraph.replace('\'', ' ')
        paragraph = paragraph.replace(',', ' ')
        paragraph = paragraph.replace(';', ' ')
        paragraph = paragraph.replace('.', ' ')
        
        word_count = {}
        word_list = paragraph.split()
        
        max_occur = 0
        max_occur_word = ''
        for w in word_list:
            w = w.lower()
            if w not in banned:
                word_count[w] = word_count.get(w, 0) + 1
                
                if word_count[w] > max_occur:
                    max_occur = word_count[w]
                    max_occur_word = w
                    
        return max_occur_word
```            

官方题解：
```python
class Solution(object):
    def mostCommonWord(self, paragraph, banned):
        banset = set(banned)
        count = collections.Counter(
            word.strip("!?',;.") for word in paragraph.lower().split())

        ans, best = '', 0
        for word in count:
            if count[word] > best and word not in banset:
                ans, best = word, count[word]

        return ans
```

在官方题解中，使用了`collections.Counter`这个类以简化代码。从`help(collection.Counter)`可以看出，count最后存储的就是一个key为word，value为在列表中出现次数的字典。对Python比较熟悉才能想到这个类吧，反正我是第一次见，学习到了。不过用基础的数据结构来解决问题（像我自己写的Solution一样），也是一名合格程序员应掌握的技能。
`strip`也是比较有用的函数，大幅精简了代码。不用像我一样一个字符一个字符的替换了。