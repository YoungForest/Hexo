---
title: LeetCode weekly contest 132
date: 2019-04-14 11:55:04
tags:
- LeetCode
categories:
- Programming
---

本次比赛不难，但代码实现起来不易。不容易一次写到bug-free。考察的是用编程语言处理复杂的逻辑，和各种意外情况。比如 第3题，当前一个dp为0时，长度应该更新为2，除此之外，dp+1。第四题，在各种情况下寻找分隔符时，没有找到，应该如何处理。

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (5) |	Q4 (5)|
|--|--|--|--|--|--|--|--|
|388 / 4765|	YoungForest |	24 | 	1:21:20	 | 0:15:54 | 0:30:16 |	0:38:05 |1:21:20 |
大概需要1个小时内做完，才能进入前200。

第4题由于一些边界条件，我调试了不少时间。我分析花这么长时间的原因。还是写代码写的少，对变量更新的边界条件不敏感。比如string::find没有找到的时候，其他各个坐标该如何更新。我就是由于没找到的时候，返回了npos(-1), `current_find_index`此时应该等于`end`，而不是继续在-1上加分隔符的长度。

## 1025. Divisor Game

一道找规律的题目。
Intution:
dp。 Solution(N) = true if any Solution(N's divisor) is false, else false。
时间复杂度: O(N^2),
空间复杂度: O(N).

```cpp
class Solution {
public:
    bool divisorGame(int N) {
        // 1, false
        // 2, 1 true
        // 3, false
        // 4, 1 true
        // 5, 1 false
        // 6. 3, true
        // 7, 1, false
        // 8, 1, true
        // 9, false
        vector<bool> dp(1001, false);
        dp[1] = false;
        for (int i = 2; i <= N; i++) {
            for (int j = 1; j < i; j++) {
                if (i % j == 0 && dp[i - j] == false) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[N];
    }
};
```

把1～9的结果输出之后发现了了不得的规律。试了一下，一行代码就搞定了。
用数学归纳法可以证明: 
前提:
N 为奇数，false;
N 为偶数，true。
1. 如果N为偶数，取x=1，N-1为false。则N为True.
2. 如果N为奇数，它所有的因子也必为奇数，即N-x一定为偶数，true. 则N为False。

时间复杂度: O(1),
空间复杂度: O(1).
```cpp
class Solution {
public:
    bool divisorGame(int N) {
        // 1, false
        // 2, 1 true
        // 3, false
        // 4, 1 true
        // 5, 1 false
        // 6. 3, true
        // 7, 1, false
        // 8, 1, true
        // 9, false
        return N % 2 != 1;
    }
};
```

## 1026. Maximum Difference Between Node and Ancestor

Intution:
递归。由于possible difference可能是`| root->val - 左子树中的最小值 |`或`| root->val - 左子树中的最大值 |`或 减去右子树中的最大最小值，或 左右子树中Maximun Difference中的较大者。
所以递归函数返回3个值，分别是Maximun Different, 树中最小值，树中最大值。

时间复杂度: O(N)，每个节点都会被递归调用一次。
空间复杂度: O(N)，树的高度，平均情况O(log N), 最差O(N)。

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
    // max_different, max, min
    tuple<int, int, int> dfs(TreeNode* root) {
        if (!root) {
            return {0, -1, 100001};
        }
        auto l = dfs(root->left);
        auto r = dfs(root->right);
        return {
            max({get<0>(l), get<0>(r), get<1>(l) == -1 ? -1 : abs(root->val - get<1>(l)), get<1>(r) == -1 ? -1 : abs(root->val - get<1>(r)), get<2>(l) == 100001 ? -1 : abs(root->val - get<2>(l)), get<2>(r) == 100001 ? -1 : abs(root->val - get<2>(r))}), 
            max({root->val, get<1>(l), get<1>(r)}), 
            min({root->val, get<2>(l), get<2>(r)})
        };
    }
public:
    int maxAncestorDiff(TreeNode* root) {
        auto ret = dfs(root);
        return get<0>(ret);
    }
};
```

## 1027. Longest Arithmetic Sequence
Intution:
DP.
最优子结构，其中dp[a][b]表示，以坐标a结尾，且差值为b的子序列的长度。
dp[i][A[i] - A[j]] = dp[j][A[i] - A[j]] == 0 ? 2 : dp[j][A[i] - A[j]] + 1。

时间复杂度: O(N ^ 2 log N), 用unordered_map的话可以进一步降为O(N^2).
空间复杂度: O(N ^ 2). 最差情况下，两两差值均不同。

```cpp
class Solution {
public:
    int longestArithSeqLength(vector<int>& A) {
        // n^2
        int ret = 0;
        vector<map<int, int>> dp(A.size()); // diff, length
        for (int i = 0; i < A.size(); ++i) {
            for (int j = 0; j < i; ++j) {
                dp[i][A[i] - A[j]] = dp[j][A[i] - A[j]] == 0 ? 2 : dp[j][A[i] - A[j]] + 1;
                ret = max(ret, dp[i][A[i] - A[j]]);
            }
        }
        
        return ret;
    }
};
```

## 1028. Recover a Tree From Preorder Traversal

Intution:
递归构造Tree。难点在于字符串的处理，如何迅速并bug-free地实现。

时间复杂度：O(N * M), 每个节点最多遍历一次字符串；
空间复杂度：O(N), 需要存储最后的树，递归深度最多为N，递归函数本身内存消耗O(1).

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
    // [Begin, end)
    TreeNode* dfs(string& S, int begin, int end, int depth) {
        // cout << begin << " " << end << " " << depth << endl;
        string delimiter(depth + 1, '-');
        int first_dash = S.find('-', begin);
        int val_end_index = min(end, first_dash == string::npos ? numeric_limits<int>::max() : first_dash);
        TreeNode* ret = new TreeNode(stoi(S.substr(begin, val_end_index - begin)));
        // 找到左右子树的分界点
        int left_begin = S.find(delimiter, begin);
        if (left_begin == string::npos || left_begin >= end) {
            return ret;
        }
        int current_find_index = left_begin + delimiter.size();
        // cout << "   " << current_find_index << endl;
        int left_end = S.find(delimiter, current_find_index);
        // cout << "   " << left_end << endl;
        current_find_index = (left_end == string::npos) ? end : left_end + delimiter.size();
        // cout << "   " << current_find_index << endl;
        while (left_end != string::npos && left_end < end && S[current_find_index] == '-') {
            while (S[current_find_index] == '-') ++current_find_index;
            // cout << "   " << current_find_index << endl;
            left_end = S.find(delimiter, current_find_index);
            // cout << "   " << left_end << endl;
            current_find_index = (left_end == string::npos) ? end : left_end + delimiter.size();
            // cout << "   " << current_find_index << endl;
        }
        ret->left = dfs(S, left_begin + delimiter.size(), left_end < end && left_end != string::npos ? left_end : end, depth + 1);
        int right_begin = current_find_index;
        if (right_begin < end)
            ret->right = dfs(S, right_begin, end, depth + 1);
        
        return ret;
    }
public:
    TreeNode* recoverFromPreorder(string S) {
        return dfs(S, 0, S.size(), 0);
    }
};
```

由于自己的实现虽然想法简单，但实现不易，而且容易写错。我自己就调试了很长时间。
于是去评论区找到了更 优的方案，Iterative Stack.

时间复杂度: O(M), one pass.
空间复杂度: O(N).

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* recoverFromPreorder(string S) {
        stack<TreeNode*> s;
        int i = 0;
        while (i < S.size()) {
            int value = 0, level = 0;
            while (i < S.size() && S[i] == '-') {
                ++level;
                ++i;
            }
            while (i < S.size() && S[i] != '-') {
                value = value * 10 + S[i] - '0';
                ++i;
            }
            while (s.size() > level) {
                s.pop();
            }
            auto node = new TreeNode(value);
            if (!s.empty() && !s.top()->left) {
                s.top()->left = node;
            } else if (!s.empty()) {
                s.top()->right = node;
            }
            s.push(node);
        }
        TreeNode* ret;
        while (!s.empty()) {
            ret = s.top();
            s.pop();
        }
        return ret;
    }
};
```

## 后记

每周在这里总结一下最近生活的进展吧。
1. Google summer of code 的申请放弃了。理由是看了一些感兴趣的organization，发现proposal的要求很高。自己很多都达不到。另一方面，自己开源项目的经历确实不够。能拿出手的仅仅是去年在Apache/HAWQ上的一次Contribution。今年可以多参加一些开源活动，丰富简历。
2. 微软的summer intern的笔试的后续结果还没有。Action Center的最新的更新还处于3月31号。

最近在读Lippman的《Essential C++》，侯捷老师在翻译的序里有这么一段话，送给大家。
>有些人的学习，自练一身铜筋铁骨，可以在热带丛林中披襟斩棘，在莽莽草原中追奔逐北。有些人的学习，既未习惯大部头书，也未习惯严谨格调，更未习惯自修勤学，是温室里的一朵花，没有自强自立的本钱。

不知道大家怎么样。我反思自己学习的过程，常常“趋利避害”，喜欢简单的皮毛，面对需要花费大量时间钻研的技术即浅尝辄止。而我也知道，作为一名“程序员”，真正拉开与别人距离的都是需要沉下心去钻研的。放眼其他领域，其实也是这样。由于大家都是理智的人，拥有惰性的人，简单的好事一定是趋之若鹜的，做的人多了，供需平衡一打破，门槛一定也日渐提高。
侯老师的话让我醍醐灌顶，自己也需每天反思自己的学习状态，即使纠正错误的思想和方法。这样才能走的更远，飞的更高。
<!-- 3. 交换项目准备的材料还差成绩单，而研究生的成绩单开具需要导师的签字。一直没找到老板。
4. 商汤的实习一如既往的忙碌。学到的东西不少，但都是皮毛，没有深入的，不可替代的技术。还是自己的钻研程度不够吧。 -->