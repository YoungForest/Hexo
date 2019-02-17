---
title: LeetCode weekly contest 124
date: 2019-02-17 15:11:48
tags:
- LeetCode
categories:
- Programming
---

今天是开工后第一次参加LeetCode weekly contest，共作出3道题目，排名为772 / 4174。看着每次排名从200+落到了700+，心情蛮失落的。我认为排名掉落的原因有：1. 排名为200是状态和运气都比较好的情况，之前大多数时候也是700左右。2. 第3题虽然为Hard，最后提交TLE了。但我认为如果再多给半个小时就可以AC了。之所以后面时间不够了，与第2、4题花了比较多时间调试直接相关。还是很多实现不够熟悉，比如bfs, backtracking，不能灵活地默写出来。甚至在做第4题的时候，还需要现场查C++的API，对语言的熟悉程度也不够。

## 993. Cousins in Binary Tree

在一棵二叉树上找表兄弟。所谓“表兄弟”的定义为，2个节点在同一层，但父节点不同。

Intuition: 递归地找节点的父亲和层数，比较2个节点的父亲和层数是否相同。也即，dfs遍历2遍二叉树。

时间复杂度：O(N),
空间复杂度: 平均O(Log N)，最差O(N), 因为需要递归栈。

由于春节假期期间看了LeetCode上的递归专题[Introduction to Algorithms - Recursion I](https://leetcode.com/explore/learn/card/recursion-i/)。10min搞定该签到题。

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
    // parent, depth
    pair<int, int> findNode(TreeNode* root, int value, int parent, int depth) {
        if (!root) return {0, depth + 1};
        if (root->val == value) return {parent, depth + 1};
        auto left = findNode(root->left, value, root->val, depth + 1);
        auto right = findNode(root->right, value, root->val, depth + 1);
        if (left.first != 0) return left;
        if (right.first != 0) return right;
        return {0, depth + 1};
    }
public:
    bool isCousins(TreeNode* root, int x, int y) {
        auto xNode = findNode(root, x, 0, 0);
        auto yNode = findNode(root, y, 0, 0);
        if (xNode.first != yNode.first && xNode.second == yNode.second)
            return true;
        return false;
    }
};
```

## 994. Rotting Oranges

给定一个网格，每个格子有3种状态
- 什么也没有
- 好橘子
- 坏橘子
每天坏橘子会将临近的好橘子变成坏橘子，求所有橘子变坏的天数。如果无穷大的话，返回-1.

Intuition：
1. 从每个坏橘子开始做bfs，一次感染好橘子，并更新好橘子坏掉的天数。因为要计算好橘子距离坏橘子的最短距离，所以一定要用bfs。
2. 检查所有好橘子坏掉的天数，如果有无穷大的橘子，返回-1.

```cpp
class Solution {
    void bfs(int i, int j, vector<vector<int>>& grid, vector<vector<bool>>& visited, vector<vector<int>> &minDays, int depth) {
        vector<int> di = {1, 0, -1, 0};
        vector<int> dj = {0, 1, 0, -1};
        
        queue<tuple<int, int, int>> q;
        q.push({i ,j, depth});
        
        while (!q.empty()) {
            tuple<int, int, int> current = q.front();
            q.pop();
            
            i = get<0>(current);
            j = get<1>(current);
            depth = get<2>(current);
            
            visited[i][j] = true;
            minDays[i][j] = min(minDays[i][j], depth);
            
            for (int k = 0; k < di.size(); k++) {
                int new_i = i + di[k];
                int new_j = j + dj[k];
                if (new_i < grid.size() && new_i >= 0 && new_j < grid[0].size() && new_j >= 0 && grid[new_i][new_j] == 1 && visited[new_i][new_j] == false)
                    q.push({new_i, new_j, depth + 1});
            }
        }
        
    }
public:
    int orangesRotting(vector<vector<int>>& grid) {
        vector<vector<int>> minDays(grid.size(), vector<int> (grid[0].size(), numeric_limits<int>::max()));
        for (int i = 0; i < grid.size(); ++i) {
            for (int j = 0; j < grid[i].size(); ++j) {
                if (grid[i][j] != 1)
                    minDays[i][j] = 0;
            }
        }
        
        for (int i = 0; i < grid.size(); ++i) {
            for (int j = 0; j < grid[i].size(); ++j) {
                if (grid[i][j] == 2) {
                    vector<vector<bool>> visited(grid.size(), vector<bool> (grid[0].size(), false));
                    bfs(i, j, grid, visited, minDays, 0);
                }
            }
        }
        
        int result = 0;
        for (int i = 0; i < grid.size(); ++i) {
            for (int j = 0; j < grid[i].size(); ++j) {
                result = max(result, minDays[i][j]);
            }
        }
        
        return result == numeric_limits<int>::max() ? -1 : result;
    }
};
```

Solution中也是使用dfs的，不过trick的一点是，通过记录每个节点的深度，在搜索开始时把所有坏橘子加入队列，使得每个节点只需要遍历一遍。更清晰，时间复杂度也更低。比我写的代码要好。

## 995. Minimum Number of K Consecutive Bit Flips

给定一个数组A，A中值包含0，1这两种状态。给定一个K，提供操作flip，可以将A中长度为K的子数组翻转。
求将A全部翻转为1所需的最小flip次数。
如果无法全部翻转为1，则返回-1.

Intution: 
如果要最后都变为1，如果第一位是0的话，必须对从第一位开始的子数组从事flip操作。
这样想下去，必须从头依次翻转所有为0的子数组，如果最后K位中仍然有0，则无法全部翻转。
这其实是一种贪心(Greedy)的算法。

时间复杂度：O(N * K), 结果超时。
空间复杂度：O(1).

```cpp
class Solution {
public:
    int minKBitFlips(vector<int>& A, int K) {
        int result = 0;
        int i;
        for (i = 0; i < A.size(); i++) {
            if (A[i] == 0) {
                if (i + K > A.size()) {
                    break;
                }
                // cout << "flip A: " << i << endl;
                for (int j = 0; j < K; j++) {
                    if (A[i + j] == 0) {
                        A[i + j] = 1;
                    } else {
                        A[i + j] = 0;
                    }
                }
                result++;
            }
        }
        if (i < A.size())
            return -1;
        return result;
    }
};
```

其实，仔细想想，我们并不需要实际进行翻转操作，只需要记录翻转的次数就可以了。所以时间上*K 其实不是必须的。
但是，不实际进行翻转的话，怎么确定一个位置上是0需要翻转，还是1需要翻转。
我们每次记录翻转的结束位置，在此之前的长度为K的子数组是经过flip的，2个flip操作还可以直接抵消。

```cpp
class Solution {
public:
    int minKBitFlips(vector<int>& A, int K) {
        int result = 0;
        vector<int> flip(A.size(), 0);
        int i;
        int zero = 0;   // 初始情况，0该翻转
        for (i = 0; i < A.size(); i++) {
            zero ^= flip[i];    // 走出结束位置，回退翻转（相当于再次翻转）
            if (A[i] == zero) {
                if (i + K > A.size()) {
                    break;
                }
                result++;
                zero ^= 1;  // 进入开始位置，进行翻转
                if (i + K < A.size())
                    flip[i + K] ^= 1;   // 标定结束位置
            }
        }
        if (i < A.size())
            return -1;
        return result;
    }
};
```

## 996. Number of Squareful Arrays

如果一个数组任意相邻的2个数的和是某个数的平方，则称这个数组为Squareful Array.
给定一个数组A，求出A的全排列数组中有多少Squareful Arrays。

Intution:
使用backtracking，剪枝的条件是最后相邻的2个数之和不是Perfect Square。

```cpp
class Solution {
    int count = 0;
    
    bool isPerfectSquare(long double x) 
    {   
      // Find floating point value of  
      // square root of x. 
      long double sr = sqrt(x); 

      // If square root is an integer 
      return ((sr - floor(sr)) == 0); 
    } 
    
    void backtracking(vector<int>& current, multiset<int>& condidates) {
        int n = current.size();
        if (condidates.size() == 0) {
            count++;
            return;
        }
        for (auto i = condidates.begin(); i != condidates.end();) {
            int c = *i;
            int sum_;
            if (n > 0) {
                sum_ = current[n - 1] + c;
                // cout << sum_ << " " << isPerfectSquare((long double) sum_) << endl;
                if (isPerfectSquare((long double) sum_)) {
                    current.push_back(c);
                    auto it = condidates.find(c);
                    condidates.erase(it);
                    backtracking(current, condidates);
                    current.pop_back();
                    condidates.insert(c);
                }
            } else {
                current.push_back(c);
                auto it = condidates.find(c);
                condidates.erase(it);
                backtracking(current, condidates);
                current.pop_back();
                condidates.insert(c);
            }
            i = condidates.upper_bound(c);
        }

    }
public:
    int numSquarefulPerms(vector<int>& A) {
        // backtracking
        // 剪枝条件：相邻的pair和不是平方数
        vector<int> current;
        multiset<int> condidates;
        condidates.insert(A.begin(), A.end());
        backtracking(current, condidates);
        
        return count;
    }
};
```


## 后记

本周是在商汤实习的第一周。在商汤实习的强度很大，一天下来眼睛都疼的不行。以后需要注意调整节奏，注意劳逸结合。综合几段实习体验来讲，商汤的是最累的了，不过预期的收获也会比较大。商汤实习的好处有：
1. 北航的同学和学长多，技术交流氛围很融洽。很多次我遇到困难的时候，他们都跑来我的工位上帮我一起解决。我是一个脸皮比较薄的人，平时生怕被人看轻。但在这里，我渐渐学会了遇到问题就找同事，不要自己一个人死磕。这样工作和成长效率都会更高。
2. 离北航很近，在清华科技园。之前快手的同方科技园也很近，我可以每天骑车往返，遇到紧急情况还可以随时回学校。不过现在快手搬到西二旗了，要不然再去快手二进宫也是极好的。
3. 除了开发，还有一定的研究工作。这样实验室的研究可以与之结合，减轻负担。目前的研究方向在于 量化模型，我刚刚入门，以后可以投入更多的精力在上面。

我还没有重新进入学习状态，保持学习的习惯。重新进入一种上进的状态是很难的，我要学会珍惜再珍惜，一定不要再次回到安逸的状态。因为我知道，安逸的状态不好，重新进入上进的状态更难。
每天要有规律地学习和运动，完成新年目标和最初的梦想。