---
title: LeetCode weekly contest 117
date: 2018-12-30 10:47:49
tags:
- LeetCode
categories:
---

今天参加LeetCode weekly contest 117, 采取了不同的策略：边做题边写博客总结。期望这样可以真实地记录所思所想，提高写博客的效率。因为之前2次，事后写博客总是耽误几天时间才写完。

## 965. Univalued Binary Tree

一道很简单、很弱智的题目，直接DFS/BFS即可。因为BFS在遇到异常节点的时候可以直接返回，更方便。我选择了BFS实现。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isUnivalTree(self, root):
        """
        :type root: TreeNode
        :rtype: bool
        """
        if root == None: return True
        univalue = root.val
        queue = [root]
        
        while len(queue) > 0:
            node = queue.pop(0)
            if node.left != None: queue.append(node.left)
            if node.right != None: queue.append(node.right)
            if node.val != univalue: return False
            
        return True
```

## 967. Numbers With Same Consecutive Differences

第二题也是一道十分弱智的题目，直接搜索即可。需要注意的地方是，N == 1 和 K == 0时的特殊处理。

```python
from functools import reduce

class Solution:
    def numsSameConsecDiff(self, N, K):
        """
        :type N: int
        :type K: int
        :rtype: List[int]
        """
        if N == 1:
            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        ret = []
        hashmap = {}
        for i in range (10):
            hashmap[i] = []
            if K == 0:
                hashmap[i].append(i)
            else:
                if i + K <= 9:
                    hashmap[i].append(i + K)
                if i - K >= 0:
                    hashmap[i].append(i - K)
        
        
        def helper(n, digits):
            if n == N:
                ret.append(reduce(lambda x, y: x * 10 + y, digits))
                return
            for i in hashmap[digits[n-1]]:
                digits.append(i)
                helper(n+1, digits)
                digits.pop()
                
        for i in range(1, 10):
            digits = [i]
            helper(1, digits)
            
        return ret
```

## 966. Vowel Spellchecker

由于前2题用brute search都解决了，本题我也上来就直接干。结果TLE了，因为暴力法的时间复杂度为O(MN)，M = len(wordlist), N = len(queries)。
怎样才能进一步降低时间复杂度呢？我脑子中闪过的第一个词是 单词书(Tire)，最近刚在 算法第四版 中学到这一技术。 时间复杂度为O(max(N * wordlist中最长单词的长度, M), 不出意料的话，可以AC，现在已经11:46了。应该写不完了，让我先看一下第4题吧。

```python
class Solution:
    def spellchecker(self, wordlist, queries):
        """
        :type wordlist: List[str]
        :type queries: List[str]
        :rtype: List[str]
        """
        wordlist_replace_vowel = []
        vowel = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']
        word_lower = []
        for word in wordlist:
            word_lower.append(word.lower())
            temp = list(word)
            for i in range(len(temp)):
                if temp[i] in vowel:
                    temp[i] = '0'
            wordlist_replace_vowel.append(''.join(temp).lower())
            
        ret = []
        for query in queries:
            flag = 0
            match = ''
            temp = list(query)
            for i in range(len(temp)):
                if temp[i] in vowel:
                    temp[i] = '0'
            query_replace_vowel = ''.join(temp).lower()
            query_lower = query.lower()
            
            for wi, word in enumerate(wordlist):
                if flag < 4 and word == query:
                    match = word
                    flag = 4
                    break
                if flag  < 3 and word_lower[wi] == query_lower:
                    match = word
                    flag = 3
                if flag < 2 and wordlist_replace_vowel[wi] == query_replace_vowel:
                    match = word
                    flag = 2
            
            ret.append(match)
            
        return ret
```

看完Solution后，才发现这也是一道很弱智的题目。brute search会TLE，使用HashMap就可以了嘛。
时间复杂度: O(C), C为wordlist和queries的总长度。
空间复杂度: O(C)。

```python
class Solution:
    def spellchecker(self, wordlist, queries):
        """
        :type wordlist: List[str]
        :type queries: List[str]
        :rtype: List[str]
        """
        wordlist_replace_vowel = {}
        vowel = ['a', 'e', 'i', 'o', 'u']
        word_lower = {}
        word_set = set(wordlist)
        for word in wordlist:
            wl = word.lower()
            # setdefault 的使用：第一次赋值，之后忽略。保证在wordlist中先出现的词优先
            word_lower.setdefault(word.lower(), word)
            wordlist_replace_vowel.setdefault(''.join('0' if i in vowel else i for i in wl), word)
            
        ret = []
        for query in queries:
            ql = query.lower()
            query_replace_vowel = ''.join('0' if i in vowel else i for i in ql)
            if query in word_set:
                ret.append(query)
            elif ql in word_lower:
                ret.append(word_lower[ql])
            elif query_replace_vowel in wordlist_replace_vowel:
                ret.append(wordlist_replace_vowel[query_replace_vowel])
            else:
                ret.append('')
            
        return ret
```

## 968. Binary Tree Cameras

看完Solution后，惊呼：动态规划还可以这样用！

每个节点有3种状态：
1. 子树都已被cover，但此节点没有被cover。
2. 子树和此节点都被cover，但此节点没有camera。
3. 子树和此节点都被cover，且此节点有camera。

对于每种状态的节点，他的子节点的状态也是确定的。
1. 左右子节点都为2。
2. 左右子节点为2或3，且至少有一个为3.
3. 左右子节点为1或2或3，但需要增加一个camera。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def minCameraCover(self, root):
        """
        :type root: TreeNode
        :rtype: int
        """
        def solve(root):
            if root is None: return 0, 0, math.inf
            
            L = solve(root.left)
            R = solve(root.right)
            
            dp0 = L[1] + R[1]
            dp1 = min(L[2] + min(R[1:]), R[2] + min(L[1:]))
            dp2 = 1 + min(L) + min(R)
            
            return dp0, dp1, dp2
        
        return min(solve(root)[1:])
```

## 总结

上午参加比赛，下午5点前写完博客。
总的来说，contest的题目的质量并没有之前的高。我之前喜欢用Liked排序刷题，体验非常好。
contest的优势在于有时间限制，可以逼迫自己在限定时间内解决。想不出解法也暂时不能去看题解（一种偷懒的刷题方式）。

这几天元旦放假，打算把《C++ Primer》看一部分，这样以后就可以在简历上写自己会C++啦。
之后是读CTCI，准备Google的第一次电面。
然后是CSAPP，我喜欢的计算机系统。