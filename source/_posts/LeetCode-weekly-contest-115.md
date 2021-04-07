---
title: LeetCode weekly contest 115
date: 2018-12-19 10:34:23
tags:
- Competitive Programming
categories:
- LeetCode
---

有些日子没有参加LeetCode的weekly contest了，最近由于准备一月末的Google电话面试，需要重新把算法捡起来。复习算法书是一部分，另一手就是准备刷题啦。由于时间有限，LeetCode的weekly contest不失为一个更好的选择。因为contest有时间限制，和实际面试更像。
weekly contest时长为1个半小时，4道不同难度的题目，每周末10点半开始(之前是9点半，可能是因为美国冬令时的原因，所以后沿了一小时)。
和之前一样，只完成了2道题目，第三道题有些思路(后来证明不对)，第四题看了下题目，果断放弃。
下面分享4道题目的思路和Solution，当然后2道是之后补题的。

## 958. Check Completeness of a Binary Tree

判断一颗树是否是完全树。
关于树的题目，递归、BFS、DFS是常用手段，可以很快发现，BFS最适合解决该题目。
一旦发现某个结点缺少child，就将`no_child`置为True，之后再搜索的时候，其他节点就不能有child了。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isCompleteTree(self, root: TreeNode) -> bool:
        no_child = False
        myqueue = collections.deque()
        if root:
            myqueue.append(root)
        
        while len(myqueue) > 0:
            node = myqueue.popleft()
            if no_child:
                if node.left != None or node.right != None:
                    return False
            else:
                if node.left != None:
                    myqueue.append(node.left)
                else:
                    no_child = True
                if node.right != None:
                    if no_child:
                        return False
                    else:
                        myqueue.append(node.right)
                else:
                    no_child = True
                    
        return True
```

时间复杂度：O(n), n 为节点数，因为在BFS中每个节点都要被遍历到(至少在完全树中，非完全树会提前退出)；
空间复杂度：O(n), BFS要用到一个队列，队列中最多要存一层的节点。

这道题的难度更像Easy，Medium真是高估了。

## 957 Prison Cells After N Days

状态转移的题目，可以直接模拟。但缺点是但N太大时，会TLE。
不难发现，Cells的状态最多有`2^6 = 64`种，所以在状态转移时，必然会出现循环。所以只要保存之前遇到的状态，如果再次遇到，就可以直接模掉循环长度了。
把状态转移打印出来，很快就可以发现，14是一个很神奇的数，每隔14必循环。所以最后的实现很多人都是直接mod 14了事。

时间复杂度: O(1),
空间复杂度: O(1).

```python
class Solution:
    def prisonAfterNDays(self, cells, N):
        """
        :type cells: List[int]
        :type N: int
        :rtype: List[int]
        """
        last_day = cells
        new_day = [0] * 8
        N = N % 14 + 14
        
        for i in range(1, 7):
            if last_day[i-1] == last_day[i+1]:
                new_day[i] = 1
            else:
                new_day[i] = 0
        new_day[0] = 0
        new_day[7] = 0
        last_day[0] = 0
        last_day[7] = 0
        last_day, new_day = new_day, last_day
        
        for _ in range(1, N):
            for i in range(1, 7):
                if last_day[i-1] == last_day[i+1]:
                    new_day[i] = 1
                else:
                    new_day[i] = 0
            last_day, new_day = new_day, last_day
            
        return last_day
```

## 959. Regions Cut By Slashes

问题的关键在于被划分为多少联通的区域，我最开始想用染色做，但后来被染色的顺序搞晕了。写了100行代码，最后还是不能全部正确解决。（事实上，DFS/BFS染色也是一种正确的解法）
看了官方的Solution后，发现Union-Find大法好。算法第4版 的第一章的最后也是着重讲解Union-Find的，解决这种联通问题最好不过了。不过因为Union-Find是太长时间前看的了，而且平时做题时几乎不用，所以根本想不到它可以很方便地解决类似的联通问题。

在此再次推荐 算法第4版，真的对面试和提升算法技能太有用啦。多看多有益处。

```python
class Solution:
    def regionsBySlashes(self, grid: List[str]) -> int:
        class UF:
            # quick union implement
            def __init__(self, size):
                self.parents = [i for i in range(size)]
                self.count = size
                
            def find(self, x):
                if self.parents[x] == x:
                    return x
                else:
                    self.parents[x] = self.find(self.parents[x])
                    return self.parents[x]
            
            def union(self, x, y):
                i = self.find(x)
                j = self.find(y)
                
                if i == j: return # already unioned
                
                self.parents[i] = j
                self.count -= 1
                
        uf = UF(4*len(grid)*len(grid[0]))
        
        for row, value in enumerate(grid):
            for column, char in enumerate(value):
                base = (row * len(grid[0]) + column) * 4
                if char == '\\':
                    uf.union(base, base + 2)
                    uf.union(base + 1, base + 3)
                elif char == '/':
                    uf.union(base, base + 1)
                    uf.union(base + 2, base + 3)
                elif char == ' ':
                    uf.union(base, base + 1)
                    uf.union(base, base + 2)
                    uf.union(base, base + 3)
                else:
                    pass
                if row > 0:
                    base_up = ((row - 1) * len(grid[0]) + column) * 4
                    uf.union(base, base_up + 3)
                if row < len(grid) - 1:
                    base_down = ((row + 1) * len(grid[0]) + column) * 4
                    uf.union(base + 3, base_down)
                if column > 0:
                    base_left = base - 4
                    uf.union(base + 1, base_left + 2)
                if column < len(grid[0]) - 1:
                    base_right = base + 4
                    uf.union(base + 2, base_right + 1)
                    
        return uf.count
```

## 960. Delete Columns to Make Sorted III

这是一道Dynamic Programming发挥作用的典型题目。(由于时间不够了，最后还是去看了Solution才豁然开朗。)
可惜的是 算法第4版 并未涉及DP这么重要的概念，如果要系统地学习DP的话，还是去看 算法导论 吧（虽然我从来都没有看完，向来都是挑着看的）。

我们按照算法导论上的一步一步来吧：
动态规划解题的4 steps:
1. 最优解结构
2. 递归定义最优解的值
3. 计算最优解的值
4. 从计算信息中构造最优解

When should we look for a Dynamic Programming solution to a problem?
1. 最优解结构
2. 重叠子问题


首先 最小删除列数 = 最大留下列数，我们把最大留下列数作为最优化目标。
1. 最优解结构：根据 算法导论 15.3中对最优子结构的讨论，子问题的空间越小（越简单）越好，所以我们选择dp[i]的子问题为dp[k]，其中 0 <= k < i, dp[i]表示只考虑前i个字符, 且第i列留下来的话，最大留下的列数。
2. 递归定义最优解的值：dp[i] = max(dp[k] + 1), for every string .indexAt[i] >= .indexAt[k]
3. 使用 Bottom-top 方法求解答案，for i in 0～len(A[0]), 计算dp[i], 最大留下列数为max(dp)。不是dp[-1]因为最后一列不一定要留下。
4. 由于问题不需要求解最后删去/留下哪几行，所以构造最优解可以忽略

时间复杂度: O(A.length ^2 * A[i].length),
空间复杂度: O(A.length).

```python
class Solution:
    def minDeletionSize(self, A):
        """
        :type A: List[str]
        :rtype: int
        """
        dp = [1 for i in range(len(A[0]))]
        
        for i in range(len(dp)):
            for k in range(i):
                if all(s[k] <= s[i] for s in A):
                    dp[i] = max(dp[i], dp[k] + 1)
                
        return len(A[0]) - max(dp)
```

## 后记

革命尚未成功，同志还需努力。

最近在知乎上关注了一个叫做Jennica的姐姐（找她要的Google内推），小姐姐热爱生活和编程，我想我其实也是这样的。所以打算多多向其学习，万一历史进程让我阴差阳错地可以进入Google工作呐。我一直以来（起码这1年以来），一直以进入外企工作作为自己的职业规划，现在看到前人的努力和成功，更加有动力和欲望啦。我要去Google/Microsoft做程序员，哈哈。