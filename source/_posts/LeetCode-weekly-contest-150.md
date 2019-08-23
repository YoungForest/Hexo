---
title: LeetCode weekly contest 150
date: 2019-08-19 09:45:53
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 476 / 5091 |	YoungForest | 	19	 | 	1:31:13 | 0:03:52  | 0:09:23 | 1:16:13  2 |  0:50:16  1 |

本次比赛效果同样不佳，排名在400+。直接原因是第3题的搜索剪枝花费了太长时间，没有一步到位。根本原因是最近2周好不容易放假在家，放松了练习，刷题基本停止了，自然手上的功夫就荒废了。真应了那句“业精于勤荒于嬉”呀。上周的排名同样很差。

## 1160. Find Words That Can Be Formed by Characters

常规的字母计数问题，用hashmap存储即可。需要注意的是，每次判断一个word的时候，需要获得一次拷贝。

时间复杂度: O(chars.size() + words.size() * word.size()),
空间复杂度: O(26)

```cpp
class Solution {
public:
    int countCharacters(vector<string>& words, string chars) {
        int ans = 0;
        vector<int> count(26);
        for (char c : chars) {
            ++count[c - 'a'];
        }
        for (const auto& s : words) {
            auto count_copy = count;
            for (char c : s) {
                --count_copy[c - 'a'];
                if (count_copy[c - 'a'] < 0) {
                    goto next;
                }
            }
            ans += s.size();
            next:
                ;
        }
        return ans;
    }
};
```

## 1161. Maximum Level Sum of a Binary Tree

先获得每一层的和，再取得最大值。

时间复杂度: O(N),
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
    vector<int> sum_of_level;
    void dfs(TreeNode* root, int depth) {
        if (root == nullptr)
            return;
        if (depth > sum_of_level.size()) {
            sum_of_level.push_back(0);
        }
        sum_of_level[depth-1] += root->val;
        dfs(root->left, depth + 1);
        dfs(root->right, depth + 1);
    }
public:
    int maxLevelSum(TreeNode* root) {
        dfs(root, 1);
        int ans = 0;
        for (int i = 1; i < sum_of_level.size(); ++i) {
            if (sum_of_level[i] > sum_of_level[ans]) {
                ans = i;
            }
        }
        return ans + 1;
    }
};
```

## 1162. As Far from Land as Possible

从陆地出发，进行DFS。
剪枝条件比较复杂，需要注意：
`((src_i == i && src_j == j) || (direct_i == di[k]) || (direct_j == dj[k]) || (direct_i == 0 && dj[k] == 0) || (direct_j == 0 && di[k] == 0)) && grid[ni][nj] != 1`。
分别是
- 搜索方向与之前的一直
    - 本次出发点就在原点
    - row方向一致
    - column方向一致
    - 之前没有在row方向走，现在往row方向走
    - 之前没有在column方向走，现在往column方向走
- 不是陆地

时间复杂度: O((row*column) ^ 2),
空间复杂度: O(row*column).

事实上，更好的算法是使用BFS。初始点为所有的陆地。BFS可以保证每个cell只被访问一次。

```cpp
class Solution {
    void dfs(const vector<vector<int>>& grid, vector<vector<int>>& distance, int i, int j, int depth, int src_i, int src_j) {
        if (distance[i][j] != -1 && depth >= distance[i][j]) {
            return;
        }
        distance[i][j] = depth;
        vector<int> di = {1, 0, -1, 0};
        vector<int> dj = {0, 1, 0, -1};
        for (int k = 0; k < 4; ++k) {
            int ni = di[k] + i;
            int nj = dj[k] + j;
            int direct_i = (i - src_i) == 0 ? 0 : (i - src_i) / abs(i - src_i);
            int direct_j = (j - src_j) == 0 ? 0 : (j - src_j) / abs(j - src_j);
            if (ni >= 0 && ni < grid.size() && nj >= 0 && nj < grid[0].size() && ((src_i == i && src_j == j) || (direct_i == di[k]) || (direct_j == dj[k]) || (direct_i == 0 && dj[k] == 0) || (direct_j == 0 && di[k] == 0)) && grid[ni][nj] != 1) {
                dfs(grid, distance, ni, nj, depth + 1, src_i, src_j);
            }
        }
    }
public:
    int maxDistance(vector<vector<int>>& grid) {
        auto distance = grid;
        for (int i = 0; i < distance.size(); ++i) {
            std::fill(distance[i].begin(), distance[i].end(), -1);
        }
        for (int i = 0; i < grid.size(); ++i) {
            for (int j = 0; j < grid[0].size(); ++j) {
                if (grid[i][j] == 1) {
                    dfs(grid, distance, i, j, 0, i, j);
                }
            }
        }
        int ans = -1;
        for (int i = 0; i < distance.size(); ++i) {
            for (int j = 0; j < distance[0].size(); ++j) {
                if (grid[i][j] == 0) {
                    ans = max(ans, distance[i][j]);
                }
            }
        }
        return ans;
    }
};
```

## 1163. Last Substring in Lexicographical Order

答案可能是从某个字母出发，然后到字符串末尾的。
首字母肯定是最大的字母。
每次挑选出来最大的字母，然后再挑选第二个字母，依次向后找，直到剩下一个候选。
有剪枝的情况是'zzzz'这种情况。大家都是最大的字母，此时候选者只有第一个最大字母。

时间复杂度：O(N). 由于有剪枝条件，所以候选者的数量为`N + N / 2 + N / 4 + ... + 1 = 2 * N`.
空间复杂度: O(N).

```cpp
class Solution {
    /**
    find the first maximum char, then compare next char
    */
public:
    string lastSubstring(string s) {
        vector<pair<int, int>> q; // begin index, compare length
        char maximum_char = 'a';
        for(int i = 0; i < s.size(); ++i) {
            if (s[i] > maximum_char) {
                maximum_char = s[i];
            }
        }
        for(int i = 0; i < s.size(); ++i) {
            if (s[i] == maximum_char) {
                q.push_back({i, 1});
            }
        }
        while (q.size() > 1) {
            char mc = 'a';
            vector<pair<int, int>> nq;
            for(const auto& p : q) {
                if (p.first + p.second < s.size() && s[p.first + p.second] > mc) {
                    mc = s[p.first + p.second];
                }
            }
            for(const auto& p : q) {
                if (p.first + p.second < s.size() && s[p.first + p.second] == mc) {
                    if (mc == maximum_char && p.first > 0 && s[p.first  - 1] == mc) {
                        continue;
                    }
                    nq.push_back({p.first, p.second + 1});
                }
            }
            std::swap(q, nq);
        }
        return s.substr(q.back().first);
    }
};
```

## 后记

曾经在知乎上写过一个很用心的答案[大家都是如何刷 LeetCode 的](https://www.zhihu.com/question/280279208/answer/704774024)。这几个月来不断有同学关注我，甚至评论说会进一步关注我的动向。我本不应让他们失望，收拾起慵懒的心情，以一个奋斗逼的心态去迎接新的学期吧！