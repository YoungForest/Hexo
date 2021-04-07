---
title: LeetCode weekly contest 140
date: 2019-06-09 13:11:58
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 313 / 4046 |	YoungForest | 16 | 1:03:21 | 0:21:32 (1) | 0:36:08 | 0:53:21 (1) | null |

本次比赛难度适中，由于[评测程序的问题](https://leetcode.com/problems/insufficient-nodes-in-root-to-leaf-paths/discuss/308196/A-leaf-is-a-node-with-no-children.)，很多人被第三题坑了。赛后test case修改正确了。这已经不是LeetCode第一次出现事故了。

## 5083. Occurrences After Bigram

思路：
签到题，直接做。用一个状态机来记录当前的状态。

时间复杂度: O(text.size()),
空间复杂度: O(1). 我的实现中，为了方便将token存在一个vector中，其实是没必要的。

```cpp
class Solution {
    enum class State {
        other,
        first,
        second
    };
public:
    vector<string> findOcurrences(string text, string first, string second) {
        vector<string> ret;
        istringstream iss(text);
        vector<string> tokens{istream_iterator<string>{iss}, {}};
        State state = State::other;
        for (const auto & token : tokens) {
            if (state == State::second) {
                ret.push_back(token);
                state = State::other;
            }
            if (token == first) {
                state = State::first;
            } else if (token == second && state == State::first) {
                state = State::second;
            } else {
                state = State::other;
            }
        }
        return ret;
    }
};
```

## 5087. Letter Tile Possibilities
由于数据规模比较小，`tiles.length <= 7`, 所以直接暴力枚举所有的可能即可。
时间复杂度: O(N!),
空间复杂度: O(N!).

```cpp
class Solution {
    set<string> ret;
    void backtracking(map<char, int>& count, int size, int step, string& current) {
        if (step == size) {
            ret.insert(current);
            return;
        }
        for (auto& p : count) {
            char c = p.first;
            if (count[c] > 0) {
                --count[c];
                current.push_back(c);
                backtracking(count, size, step + 1, current);
                current.pop_back();
                ++count[c];
            }
        } 
    }
public:
    int numTilePossibilities(string tiles) {
        map<char, int> count;
        for (char tile : tiles) {
            ++count[tile];
        }
        int s = tiles.size();
        for (int len = 1; len <= s; ++len) {
            string current;
            backtracking(count, len, 0, current);
        }
        // for (auto& s : ret) {
        //     cout << s << " ";
        // }
        return ret.size();
    }
};
```

## 5084. Insufficient Nodes in Root to Leaf Paths

典型的递归题目。根据题目描述删除结点即可，如果对树的递归比较熟悉的话，写起来很快。
需要注意的是，叶子结点的定义是左右子树均为null，而不是左子树或又子树。

时间复杂度: O(N), 树中每个结点要调用一次递归函数。
空间复杂度: O(N), 树的深度。

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
    int limit = 0;
    // return: 是否删除，子树从根到叶子最大的sum
    // current: 从根到父节点的sum
    pair<TreeNode*, int> recurse(TreeNode* root, int current) {
      if (root == nullptr) {
            return {nullptr, 0};
        }
        auto l = recurse(root->left, current + root->val);
        auto r = recurse(root->right, current + root->val);
        TreeNode* ret_ptr = nullptr;
        int ret_int;
        if (root->left != nullptr && root->right != nullptr)
            ret_int = max(l.second, r.second);
        else if (root->left != nullptr)
            ret_int = l.second;
        else if (root->right)
            ret_int = r.second;
        else    // 叶子结点
            ret_int = 0;
        root->left = l.first;
        root->right = r.first;
        // cout << root->val << " : " << ret_int << endl;
        if (ret_int + root->val + current >= limit) {
            return {root, ret_int + root->val};
        } else {
            return {nullptr, ret_int + root->val};
        }
    }
public:
    TreeNode* sufficientSubset(TreeNode* root, int limit) {
        this->limit = limit;
        auto ret = recurse(root, 0);
        return ret.first;
    }
};
```

## 5086. Smallest Subsequence of Distinct Characters

这道题目在赛中没有做出来。我尝试用贪心的解法，每次添加一个字符。但这种贪心其实是错误的，无法处理形如
"ddeeeccdce"
这样的输入。
当处理最后一个d时，"ecd"无法比"dec"大。

```cpp
// 错误的贪心思路
// 时间复杂度: O(N^2)
// 空间复杂度: O(N)
class Solution {
public:
    string smallestSubsequence(string text) {
        string current;
        for (int i = 0; i < text.size(); ++i) {
            char c = text.at(i);
            auto index = current.find(c);
            if (index == string::npos) {
                current.push_back(c);
            } else {
                string new_current = current.substr(0, index) + current.substr(index + 1);
                new_current.push_back(c);
                if (new_current < current) {
                    current = std::move(new_current);
                }
            }
        }
        return current;
    }
};
```

正确的思路:
完全相同的题目 [LeetCode 316](https://leetcode.com/problems/remove-duplicate-letters).
此题中的discuss中有很多高质量的回答。

对于输入的字符串，我们尝试单调递增的结果字符串。如果输入字符小于结果字符串的最后一个，并且最后的这个字符之后还会出现，则 我们从结果字符串中移除掉这个字符。
这其实也是贪心的思路。每次操作都会让字符串变得更小。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    string smallestSubsequence(string text) {
        unordered_map<char, int> used, count;
        for (char c : text) {
            ++count[c];
        }
        string ret;
        for (char c : text) {
            --count[c];
            if (used[c]++ > 0) {
                continue;
            }
            while (!ret.empty() && ret.back() > c && count[ret.back()] > 0) {
                used[ret.back()] = 0;
                ret.pop_back();
            }
            ret.push_back(c);
        }
        return ret;
    }
};
```