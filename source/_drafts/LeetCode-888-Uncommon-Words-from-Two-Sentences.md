---
title: 'LeetCode #888 Uncommon Words from Two Sentences'
tags:
categories:
- LeetCode
---

今天第一次参加LeetCode的Weekly Contest，算是对这20天以来刷LeetCode的检验。
结果如下：

| Rank | Name | Score | Finish Time | Q1(3) | Q2(5) | Q3(5) | Q4(5) |
|-----|-----|-----|-----|----|----|---|---|
| 848/3760 | YoungForest | 8 | 1:04:52 | 0:35:18 | 1:04:52 | | |

一个半小时（虽然到实验室的时候就已经快过去半个小时啦），只做出2道题目。离能找到满意的工作还有很大的距离。
感受有3点：
- 解题和编码的速度不够快
- 基础算法的掌握不够全面，空缺很大（比如第三题涉及到图论的二部图，自己还没复习到）
- 对hard题目仍然束手无措（第四题是比赛结束之后才去看的，之前看过原题，但还是无法正确解答和编码）

针对这3点，我认为之后的学习有如下需要改进的地方：
解题和编码速度可以考刷更多的题目、限时刷、参加比赛来获得，并不是很着急需要改善的。
基础算法的掌握，我认为才是当下急需拯救的。可以将每天刷题的时间缩短，先系统地看完“算法第四版”，建立完备和扎实的基础。
hard题目的解决，也不是当务之急；随着基础的扎实，会有更多的时间和精力去学习和复杂复杂的算法；而且相对性价比比较低。

Description: https://leetcode.com/problems/uncommon-words-from-two-sentences/description/
Solution: https://leetcode.com/problems/uncommon-words-from-two-sentences/solution/
Difficulty: Easy

```python
class Solution:
    def uncommonFromSentences(self, A, B):
        """
        :type A: str
        :type B: str
        :rtype: List[str]
        """
        word_list_A = A.split(' ')
        word_list_B = B.split(' ')
        
        set_A = collections.Counter(word_list_A)
        set_B = collections.Counter(word_list_B)
        set_all = set_A + set_B
        set_all[''] = 2
        
        ret = []
        
        for word in set_all:
            if set_all[word] == 1:
                ret.append(word)
                
        return ret
```