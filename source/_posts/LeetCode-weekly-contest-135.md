---
title: LeetCode weekly contest 135
date: 2019-05-05 12:47:02
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (5) |	Q4 (5)|
|--|--|--|--|--|--|--|--|
|70 / 3635	|	YoungForest |	15 | 1:34:07 | 0:07:28 | 0:16:45 |	null | 1:29:07  (1) |

本周日是国内的工作日，参加LeetCode weekly contest的人直接少了1千，可见国内参与此比赛的热情。而且国人的实力一般也是排在世界前列的。所以我此次排名为70，首次进入前200，除了争分夺秒在结束前AC掉最后一题的功劳外，还有参赛大佬减少的原因。

## 5051. Valid Boomerang

Intuition:
分为判断distinct和not in a straight line两部分。
3点共线可以用斜率直接判断。
时间复杂度: O(1)
空间复杂度: O(1)

```cpp
class Solution {
    bool isSame(vector<int>& x, vector<int>& y) {
        return x[0] == y[0] && x[1] == y[1];
    }
public:
    bool isBoomerang(vector<vector<int>>& points) {
        return !isSame(points[0], points[1]) && !isSame(points[1], points[2]) && !isSame(points[2], points[0]) && static_cast<double>(points[2][1] - points[1][1]) / static_cast<double>(points[2][0] - points[1][0]) != static_cast<double>(points[1][1] - points[0][1]) / static_cast<double>(points[1][0] - points[0][0]);
    }
};
```

discuss内发现的技巧：
1. 可以直接用面积是否为0同时判断 distinct和贡献，面积的公式用叉乘计算。
2. 判断斜率时，把除法转换成乘法会更好。此时也不需要提前判断distinct。

我的解法会有除0的问题，
但仍然能通过`[[1,2],[1,1],[2,1]]`这样的测试用例。
仔细想想C++的浮点数除法，根据IEEE 754 标准，结果为+infinite。自然有不相等的结果。

## 1038. Binary Search Tree to Greater Sum Tree

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
    int current = 0;
    void recurse(TreeNode* root) {
        if (!root) return;
        recurse(root->right);
        current += root->val;
        root->val = current;
        recurse(root->left);
    }
public:
    TreeNode* bstToGst(TreeNode* root) {
        recurse(root);
        return root;
    }
};
```

## 1039. Minimum Score Triangulation of Polygon
[参考](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/discuss/286705/JavaC++Python-DP)

Intuition:
DP.
对于一个n边形，可以有一条直线，将其分为k, n - k 边形。
这条直线肯定是三角形的一条边。
再枚举另一个点的位置，更新最小值。

时间复杂度：O(n ^ 3),
空间复杂度：O(n ^ 2)

```cpp
class Solution {
public:
    int minScoreTriangulation(vector<int>& A) {
        const int n = A.size();
        vector<vector<int>> dp (n, vector<int> (n));
        for (int d = 2; d < n; ++d) { // i, j 之间的距离
            for (int i = 0; i + d< n; ++i) {   // 直线的一端
                int j = i + d;  // 直线的另一端
                dp[i][j] = numeric_limits<int>::max();
                for (int k = i + 1; k < j; ++k) { // 三角形的另一个顶点
                    dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j] + A[i] * A[k] * A[j]);
                }
            }
        }
        
        return dp[0][n-1];
    }
};
```

## 1040. Moving Stones Until Consecutive II

时间复杂度: O(n long n), 因为有个排序。
空间复杂度: O(1)

```cpp
class Solution {
public:
    vector<int> numMovesStonesII(vector<int>& stones) {
        // 贪心策略
        // 最小：尽可能地收缩，答案一定小于size，连续的size内有多少石头，答案即为size-这个数目
        // 特殊情况：这个区间涉及到头或尾，且补位的位置也是头尾，即 1 11这种情况，此时答案为2，而不是1
        // 最大：先排个序，最小的跳到最大的左面，或 最大的额跳到最小的右面，剩下的每次收缩1
        sort(stones.begin(), stones.end());
        int size = stones.size();
        int left = 0;
        int minimum_moves = 0;
        for(int i = 0; i < size; ++i) {
            if (stones[i] >= stones[left] + size) {
                while (stones[i] >= stones[left] + size)
                    ++left;
            }
            minimum_moves = max(minimum_moves, i - left + 1);
        }
        if (minimum_moves == size - 1 && (stones[1] - stones[0] != 2 && stones[size - 1] - stones[size - 2] != 2)) {
            minimum_moves = 2;
        } else {
            minimum_moves = size - minimum_moves;
        }
        
        int maximum_moves = 0;
        maximum_moves = max(stones[size - 2] - stones[0], stones[size - 1] - stones[1]) + 1 - size + 1;
        
        return {minimum_moves, maximum_moves};
    }
};
```