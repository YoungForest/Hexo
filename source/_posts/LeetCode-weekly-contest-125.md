---
title: LeetCode weeekly contest 125
date: 2019-02-24 11:11:14
tags:
- LeetCode
categories:
- Programming
---

本周末真是忙炸，为自己的拖延和懒惰付出了代价。事情都堆在了一起，周日的deadline超级多。早上10点和老板开会，商量 怎么出本科计算机组成原理补考试题 的事儿。开完会回到实验室，contest已经开始了。在短暂犹豫是否按计划参加contest，还是先完成出补考题的任务后，我开始了本周的weekly contest。也算是自己这2个月来坚持的为数不多的事情，继续坚持下去对我来说不仅是提高算法能力的事情了，更是对掌控自己生活的信心的一种极大鼓舞。

<!-- more -->

本周的weekly contest相对还说比较简单，虽然迟到了10min，但仍然提前30min完成4道题目。尤其是第4题，虽然值8分，难度是hard，但也很快解出来了。我认为难度最多Medium。

结果：
| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (4) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 284 / 4238	| YoungForest | 	22 |	1:08:40 |	0:18:40 |	0:31:07  WA(1) |	0:39:39 |	1:03:40 |

## 997. Find the Town Judge

使用2个hashmap，分别记录每个person trust的人数和被多少人trust。

```cpp
class Solution {
public:
    int findJudge(int N, vector<vector<int>>& trust) {
        unordered_map<int, int> vote;
        unordered_map<int, int> untrust;
        for (vector<int> & p : trust) {
            vote[p[1]]++;
            untrust[p[0]]++;
        }
        
        for (int i = 1; i <= N; i++) {
            if (vote[i] == N - 1 && untrust[i] == 0) return i;
        }
        
        return -1;
    }
};
```

## 999. Available Captures for Rook

完全符合Easy的难度，直接模拟rook(行为应该类似中国象棋里的 车)向4个方向一步一步走就可以了。
用discuss中的一个道友的话来说，就是 search and capture.

```cpp
class Solution {
public:
    int numRookCaptures(vector<vector<char>>& board) {
        int rock_i, rock_j;
        for (int i = 0; i < board.size(); i++) {
            for (int j = 0; j < board[0].size(); j++) {
                if (board[i][j] == 'R') {
                    rock_i = i;
                    rock_j = j;
                    break;
                }
            }
        }
        vector<int> di = {0, 1, 0, -1};
        vector<int> dj = {1, 0, -1, 0};
        int result = 0;
        for (int k = 0; k < di.size(); k++) {
            for (int i = rock_i, j = rock_j; i >= 0 && i < board.size() && j >= 0 && j < board[0].size(); i += di[k], j += dj[k]) {
                char current = board[i][j];
                if (current == 'R') continue;
                else if (current == '.') continue;
                else if (current == 'p') {
                    result++;
                    break;
                }
                else if (current == 'B') {
                    break;
                }
                else return -1; 
            }
        }
        
        return result;
    }
};
```

## 998. Maximum Binary Tree II

本题的关键是**理解所谓的Maximum Binary Tree是什么意思**。
它本身的定义就是递归定义的，给定一个数组A，A中最大值为根节点，最大值左侧的子数组为左子树，右侧的子数组为右子树。

本题给定一个Maximun Binary Tree, 但不告诉你原数组是什么，再给一个数，求将此数追加到元素组后构造而成的Maximum Binary Tree。

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
    TreeNode* insertIntoMaxTree(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);
        if (val > root->val) {
            TreeNode *append = new TreeNode(val);
            append->left = root;
            return append;
        } else {
            root->right = insertIntoMaxTree(root->right, val);
            return root;
        }
    }
};
```

## 1001. Grid Illumination

哇！LeetCode的题号超过1000啦。虽然总的题目数还不足1k，但超过也是指日可待的事情。
算法题现在有949道，我只做了210道。加油啊，Forest!

本题的想法很直接，了解题意之后，直接搜索即可。问题的关键在于搜索的效率。
通过题目的数据规模:
>1 <= N <= 10^9
>
>0 <= lamps.length <= 20000
>
>0 <= queries.length <= 20000
>
>lamps[i].length == queries[i].length == 2

可知，搜索最好是用hashtable来实现，效率最高。然而，C++ 默认的pair不是hashable的，虽然可以通过自己实现hashable pair还进一步实现效率优化。但在这里我偷了个懒，直接用了`set`，而不是`unordered_set`。仍然AC啦。好开心，提前30min完成比赛，排名也再次进入前300了。再接再厉，保持排名在300以内。

```cpp
class Solution {
public:
    vector<int> gridIllumination(int N, vector<vector<int>>& lamps, vector<vector<int>>& queries) {
        set<pair<int, int>> lamps_on;
        unordered_map<int, int> lamps_x; // x, count
        unordered_map<int, int> lamps_y; // y, count
        unordered_map<int, int> lamps_x_sub_y; // x - y, count
        unordered_map<int, int> lamps_x_add_y; // x + y, count
        for (vector<int>& lamp : lamps) {
            lamps_on.insert({lamp[0], lamp[1]});
            lamps_x[lamp[0]]++;
            lamps_y[lamp[1]]++;
            lamps_x_sub_y[lamp[0] - lamp[1]]++;
            lamps_x_add_y[lamp[0] + lamp[1]]++;
        }
        
        vector<int> result;
        vector<int> di = {-1, 0, 1};
        vector<int> dj = {-1, 0, 1};
        for (vector<int>& q : queries) {
            if (lamps_x[q[0]] > 0 || lamps_y[q[1]] > 0 || lamps_x_sub_y[q[0] - q[1]] > 0 || lamps_x_add_y[q[0] + q[1]] > 0)
                result.push_back(1);
            else
                result.push_back(0);
            
            for (int i : di) {
                for (int j : dj) {
                    int x = q[0] + i;
                    int y = q[1] + j;
                    if (lamps_on.find({x, y}) != lamps_on.end()) {
                        lamps_on.erase({x, y});
                        lamps_x[x]--;
                        lamps_y[y]--;
                        lamps_x_sub_y[x - y]--;
                        lamps_x_add_y[x + y]--;
                    }
                }
            }
        }
        
        return result;
    }
};
```

时间复杂度：O(max(M log N, N log N)), N = lamps.size(), M = queries.size(). 如果使用hashable pair的话，复杂度可进一步降为O(max(N, M)).
空间复杂度：O(N)