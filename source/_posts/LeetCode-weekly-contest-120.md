---
title: LeetCode weekly contest 120
date: 2019-01-20 11:51:13
tags:
- LeetCode
categories:
---

本周和好友“女声男”同时参加weekly contest。有同学共同竞争还是挺有压力的。因为我练习算法题已经有半年时间了，他还是新手，如若最后还败北了，岂不丢人。不过结果还好，没有丢自己的人。我在离比赛结束还有10min时全部AC，而且所有题目都是一遍过，略胜一筹。不得不说，这次的题比往届简单不少，之前我的水平一直维持在只做出2道题目，ranking 800左右，而本次ranking 为 356 / 3870。从排名上看有所进步。

下面我分享一下四道题目的思路。

## 977. Squares of a Sorted Array

给定一个数组，返回各个元素的平方数组，该数组是排好序的。直接brute force即可。

```cpp
class Solution {
public:
    vector<int> sortedSquares(vector<int>& A) {
        vector<int> square;
        
        for (auto a: A) {
            square.push_back(a * a);
        }
        
        sort(square.begin(), square.end());
        
        return square;
    }
};
```

时间复杂度：O(n log n)，因为有个排序。
空间复杂度：O(n)，因为要返回一个新的数组，除此之外，不实用额外空间。当然，你也可以使用传进来的数组所占的空间，更trick，但没有多大意义。

看过Solution后，惊奇地发现竟然还有种O(n)的解法。仔细一看，原来是自己没有注意到数组A本身是排好序的。问题可以转化为合并2个排好序的数组。

```cpp
class Solution {
public:
    vector<int> sortedSquares(vector<int>& A) {
        vector<int> square;
        
        int j = 0;
        for (; j < A.size() && A[j] < 0; j++) ;
        
        int i = j - 1;
        while (i >= 0 && j < A.size()) {
            if (A[i]*A[i] < A[j]*A[j]) {
                square.push_back(A[i]*A[i]);
                i--;
            }
            else {
                square.push_back(A[j]*A[j]);
                j++;
            }
        }

        while (i >= 0) {
            square.push_back(A[i]*A[i]);
            i--;
        }
        
        while (j < A.size()) {
            square.push_back(A[j]*A[j]);
            j++;
        }
        
        return square;
    }
};
```

## 978. Longest Turbulent Subarray

给定一个数组，返回“升降子数组”的最大长度。所谓“升降子数组”，即 相邻2个元素对大小变化的符号相反，比如[1, 2, 1, 2, 1]。画在坐标图上就是波浪状。

思路：遍历一遍数组，如果新的元素对变化符号与前一个元素对变化符号相反，则 `当前升降子数组长度 += 1`; 否则，重置`当前升降子数组长度`为 2。遍历的同时根据 `当前升降子数组长度` 更新 `最长升降子数组长度`。

```cpp
class Solution {
public:
    int maxTurbulenceSize(vector<int>& A) {
        int max_length = 1;
        // 1 down, -1 up
        int last_state = 0;
        int current_length = 2;
        
        for (int i = 0; i < A.size() - 1; i++) {
            int state = 0;
            if (A[i] > A[i + 1]) {
                state = 1;
            } else if (A[i] < A[i + 1]) {
                state = -1;
            } else {
                state = 0;
            }
            if (state == -last_state && state != 0) {
                current_length++;
            } else {
                current_length = 2;
            }
            max_length = max(max_length, current_length);
            
            last_state = state;
        }
        
        return max_length;
    }
};
```
时间复杂度: O(n)，只需要遍历数组一遍；
空间复杂度: O(1), 只使用常数的额外空间。



## 979. Distribute Coins in Binary Tree

Intution: 遇到树的题目，最先先到的就是递归，dfs。无脑写dfs最难的地方在于确定参数和返回值，也就是明确子树与root之间的关系。在本题中，子树与root之间的关系就是，存在硬币的转移，从子树到root，或是从root到子树。所以只需要一个返回值，表示这一转移即可。

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
private:
    int move = 0;
    // 把多余的给parent，问parent要不够的, positive: surplus, negative: demand
    int recurse(TreeNode* root) {
        if (!root) return 0;
        int surplus = 0;
        
        int left = recurse(root->left);
        int right = recurse(root->right);
        
        surplus = left + right + root->val - 1;
        
        move += abs(surplus);
        
        return surplus;
    }
public:
    int distributeCoins(TreeNode* root) {
        recurse(root);
        
        return move;
    }
};
```

时间复杂度: O(n), n为node的数目。因为每个node都要没调用一次。
空间复杂度: 平均 O(log n), 即 树的深度。

## 980. Unique Paths III

Intution: 寻找路径数目，最直接的brute force是直接dfs进行backtrack。由于题目规模比较小，`1 <= grid.length * grid[0].length <= 20`，所以还是可以AC的。激动人心的是在比赛结束前10min，AC掉这最后一道题目。

```cpp
class Solution {
private:
    int path = 0;
    void dfs(vector<vector<int>>& grid, vector<vector<bool>> &visit, int i, int j) {
        // cout << "dfs: " << i << "," << j << endl;
        if (grid[i][j] == 2) {
            int true_all = true;
            for (int xi = 0; xi < grid.size(); xi++) {
                for (int xj = 0; xj < grid[xi].size(); xj++) {
                    if (grid[xi][xj] == 0 && visit[xi][xj] == false) {
                        true_all = false;
                        goto end_of_outer_loop;
                    }
                }
            }
            end_of_outer_loop:
            if (true_all) {
                // cout << "find a path!" << endl;
                path++;   
            }
            return;
        }
        visit[i][j] = true;
        if (i > 0) {
            int new_i = i - 1;
            int new_j = j;
            if (visit[new_i][new_j] == false && (grid[new_i][new_j] == 0 || grid[new_i][new_j] == 2))
                dfs(grid, visit, new_i, new_j);
        }
        if (j > 0) {
            int new_i = i;
            int new_j = j - 1;
            if (visit[new_i][new_j] == false && (grid[new_i][new_j] == 0 || grid[new_i][new_j] == 2))
                dfs(grid, visit, new_i, new_j);
        }
        if (i < grid.size() - 1) {
            int new_i = i + 1;
            int new_j = j;
            if (visit[new_i][new_j] == false && (grid[new_i][new_j] == 0 || grid[new_i][new_j] == 2))
                dfs(grid, visit, new_i, new_j);
        }
        if (j < grid[0].size() - 1) {
            int new_i = i;
            int new_j = j + 1;
            if (visit[new_i][new_j] == false && (grid[new_i][new_j] == 0 || grid[new_i][new_j] == 2))
                dfs(grid, visit, new_i, new_j);
        }
        visit[i][j] = false;
    }
public:
    int uniquePathsIII(vector<vector<int>>& grid) {
        vector<vector<bool>> visit(grid.size(), vector<bool> (grid[0].size(), false));
        
        int i, j;
        for (i = 0; i < grid.size(); i++) {
            for (j = 0; j < grid[0].size(); j++) {
                if (grid[i][j] == 1) {
                    goto find_begin_square;
                }
            }
        }
        find_begin_square:
        
        
        // cout << "begin : " << i << "," << j << endl;
        dfs(grid, visit, i, j);
        
        return path;
    }
};
```

时间复杂度: O(4^n)，n为网格数，因为每次要向4个方向走，而且回溯必然是指数级的。
空间复杂度: O(n)，dfs的最深递归调用层数。
