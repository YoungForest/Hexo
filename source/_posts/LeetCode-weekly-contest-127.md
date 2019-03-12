---
title: LeetCode weekly contest 127
date: 2019-03-10 10:32:00
tags:
- LeetCode
categories:
- Programming
---

本周4道题目分数分别为4 4 5 6, 应该不是很难的，加油， Forest！

因为题目太简单，即使提前15min做完了，排名还是912 / 4712。这次比赛真的是简单，完全比拼的是写码的速度和熟练度。是否可以一次bug-free很重要。因为如果某个corner case错了，再去调试是很花时间的。我1，2题都是错了一次，耽误了很多时间。

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
|931 / 4059|	YoungForest |	19|	1:24:03|	0:24:49(1)|	0:44:58(1)|	1:05:12	|1:14:03|

## 1005. Maximize Sum Of Array After K Negations

常规签到题。

Intution:
有负数，先flip最小的负数;
没负数，有0。 flip 0;
只有正数，K为奇数，flip最小的正数;
..., K为偶数，不flip.

时间复杂度: O(N log N), 因为排序。
空间复杂度: O(1).

```cpp
class Solution {
public:
    int largestSumAfterKNegations(vector<int>& A, int K) {
        sort(A.begin(), A.end(), less<int>());
        int i;
        for (i = 0; i < A.size() && K > 0 && A[i] < 0; ++i) {
            A[i] = -A[i];
            K--;
        }
        if (K > 0 && K % 2 == 1) {
            if (i > 0 && A[i-1] < A[i]) A[i-1] = -A[i-1];
            else A[i] = -A[i];
        }
        return accumulate(A.begin(), A.end(), 0, plus<int>());
    }
};
```

我Wrong Answer了一次，因为flip最小的正数时，没有考虑原来是负数的更小的正数，也就是需要有`if (i > 0 && A[i-1] < A[i]) A[i-1] = -A[i-1];`这行代码。

即使是签到题，在Discuss区果然还是发现了一些牛逼的代码。比如，O(N)的解法。
```cpp
class Solution {
    int partition(vector<int>& A, int low, int high) {
        int pivot = A[high];
        int placement = low;
        for (int i = low; i < high; ++i) {
            if (A[i] < pivot) {
                swap(A[i], A[placement]);
                placement++;
            }
        }
        swap(A[high], A[placement]);
        
        return placement;
    }
public:
    int largestSumAfterKNegations(vector<int>& A, int K) {
        int low = 0, high = A.size() - 1;
        int index;
        while (true) {
            index = partition(A, low, high);
            if (index < K - 1)  // why not K? Think the case A.size() == K
                low = index + 1;
            else if (index > K - 1)
                high = index - 1;
            else
                break;
        }
    
        for (int i = 0; i < index; i++) {
            if (A[i] < 0) {
                A[i] = -A[i];
                K--;
            }
        }
        
        return accumulate(A.begin(), A.end(), 0) - ((K%2) == 1 ? 2 * *min_element(A.begin(), A.end()) : 0);
    }
};
```

Time complexity: O(N) in average.
Space complexity: O(1).

如果想要worst case也是O(N)的话，可以用随机的partition.

## 1006. Clumsy Factorial

第一次提交由于考虑错了优先级，把‘-’的优先级降低了，写了一个智障的递归解法，结果负负得正显然不对。
Intution:
直接根据"Clumsy Factorial"的定义进行计算。

```cpp
class Solution {
public:
    int clumsy(int N) {
        if (N == 4) {
            return 4*3 / 2 + 1;
        } else if (N == 3) {
            return 3*2 / 1;
        } else if (N == 2) {
            return 2 * 1;
        } else if (N == 1) {
            return 1;
        } else {
            unsigned int result = N * (N - 1) / (N - 2) + (N - 3);
            int i;
            for (i = 4; i + 4 <= N; i+=4) {
                result += - (N - i) * (N - i - 1) / (N - i - 2) + (N - i - 3);
            }
            if (N - i == 3) result += -3*2/1;
            else if (N - i == 2) result += -2*1;
            else if (N - i == 1) result += -1;
            else;
            return result;
        }
    }
};
```

时间复杂度：O(N),
空间复杂度：O(1).

Discuss区惊现数学优化的O(1)解法，不得不把[原地址](https://leetcode.com/problems/clumsy-factorial/discuss/252279/You-never-think-of-this-amazing-O(1)-solution!!!)发出来。真的是太6了。


## 1007. Minimum Domino Rotations For Equal Row
Intution: 
想让A或B整行相同，最后可能有12种情况，即 A 1，A 2， A 3, A 4, ..., B 6。
过一遍dominoes，就能获得达到这12种情况需要的flip数目，用-1表示无法达到。

```cpp
class Solution {
public:
    int minDominoRotations(vector<int>& A, vector<int>& B) {
        if (A.size() != B.size()) return -1;
        vector<int> states(12, 0);
        
        for (int i = 0; i < A.size(); i++) {
            int count = 0;
            for (int j = 0; j < 6; j++) {
                if (j + 1 == A[i] && states[j] >= 0)
                    states[j] = states[j];
                else if (j + 1 == B[i] && states[j] >= 0)
                    states[j] ++;
                else {
                    states[j] = -1;
                    count++;
                }
            }
            for (int j = 0; j < 6; j++) {
                if (j + 1 == B[i] && states[j + 6] >= 0)
                    states[j + 6] = states[j + 6];
                else if (j + 1 == A[i] && states[j + 6] >= 0)
                    states[j + 6] ++;
                else {
                    states[j + 6] = -1;
                    count++;
                }
            }
            
            if (count == 12) return -1;
        }
        
        int result = -1;
        for (int i = 0; i < 12; i++) {
            if (states[i] >= 0)
                result = result >= 0 ? min(result, states[i]) : states[i];
        }
        return result;
    }
};
```

## 1008. Construct Binary Search Tree from Preorder Traversal

Intution:
树的问题一般通过递归解决。此题的关键在于理解**Binary Search Tree**和**Preorder Traversal**。

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
    TreeNode* dfs(vector<int>& preorder, int begin, int end) {
        if (begin > end) return nullptr;
        if (begin == end) return new TreeNode(preorder[begin]);
        TreeNode* root = new TreeNode(preorder[begin]);
        int mid;
        for (mid = begin + 1; mid <= end && preorder[mid] < root->val; mid++);
        root->left = dfs(preorder, begin + 1, mid - 1);
        root->right = dfs(preorder, mid, end);
        return root;
    }
public:
    TreeNode* bstFromPreorder(vector<int>& preorder) {
        return dfs(preorder, 0, preorder.size() - 1);
    }
};
```

实际上，是存在O(N)解法的，即，我们并不需要找到左右子树的分界点, 只需要不断地扩展树就可以了。
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
    int i = 0;
    TreeNode* dfs(vector<int>& preorder, int bound) {
        if (i == preorder.size() || preorder[i] > bound) return nullptr;
        TreeNode* root = new TreeNode(preorder[i++]);
        root->left = dfs(preorder, root->val);
        root->right = dfs(preorder, bound);
        return root;
    }
public:
    TreeNode* bstFromPreorder(vector<int>& preorder) {
        return dfs(preorder, numeric_limits<int>::max());
    }
};
```

## 后记

最近因为同时忙水科院的项目和商汤的实习，在刷题方面有所放松。我需要检讨自己，重新认识一下现在的情况。如果去外企的话，真的, 刷题只是基本功。套用武侠小说的概念，“数据结构和算法是一个程序员的内功“。如果连这么简单的事情也坚持不了的话，人生大概率也就一事无成了。

计划：虽然每天晚上回来累成狗，还是要花出1个小时在刷题和计算机基础上，花出半个小时在跑步上，半个小时在英语上。我会在豆瓣上每天签到，希望各位监督。