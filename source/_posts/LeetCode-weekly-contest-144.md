---
title: LeetCode weekly contest 144
date: 2019-07-07 19:18:15
tags:
- Competitive Programming
categories:
- LeetCode
---

今早由于参加托福考试，无法像往常一样参加周赛。赛后补题。


## 1108. Defanging an IP Address
One pass. 直接替换即可。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    string defangIPaddr(string address) {
        string ret;
        for (char c : address) {
            if (c == '.') {
                ret.push_back('[');
                ret.push_back('.');
                ret.push_back(']');
            } else {
                ret.push_back(c);
            }
        }
        return ret;
    }
};
```

## 1109. Corporate Flight Bookings

Brute force. TLE.
时间复杂度: O(N * bookings.length);
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {
        vector<int> ret(n, 0);
        for (const auto& booking : bookings) {
            for (int i = booking.at(0); i <= booking.at(1); ++i) {
                ret[i - 1] += booking.at(2);
            }
        }
        return ret;
    }
};
```

One pass. 前些天刚做过类似的题目。站点上下车的问题。
时间复杂度: O(max(booking.length, N)).
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {
        vector<int> stops(n + 1, 0);
        vector<int> ret(n, 0);
        for (const auto& booking : bookings) {
            stops[booking[0] - 1] += booking[2];    // begin
            stops[booking[1]] -= booking[2];    // end
        }
        int total = 0;
        for (int i = 0; i < n; ++i) {
            total += stops[i];
            ret[i] = total;
        }
        return ret;
    }
};
```

## 1110. Delete Nodes And Return Forest

二叉树的通用解法：递归删除。

时间复杂度: O(N), 每个结点被递归调用一次。
空间复杂度: O(N). 最差情况下，返回的子树个数。

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
    vector<TreeNode*> ret;
    TreeNode* recurse(TreeNode* root, const unordered_set<int>& to_delete) {
        if (root == nullptr)
            return nullptr;
        TreeNode* ret = nullptr;
        root->left = recurse(root->left, to_delete);
        root->right = recurse(root->right, to_delete);
        if (to_delete.find(root->val) == to_delete.end()) {
            ret = root;
        } else {    // delete
            if (root->left) {
                this->ret.push_back(root->left);
            }
            if (root->right) {
                this->ret.push_back(root->right);
            }
        }
        return ret;
    }
public:
    vector<TreeNode*> delNodes(TreeNode* root, vector<int>& to_delete) {
        unordered_set<int> td(to_delete.begin(), to_delete.end());
        auto r = recurse(root, td);
        if (r) {
            ret.push_back(r);
        }
        return ret;
    }
};
```

## 1111. Maximum Nesting Depth of Two Valid Parentheses Strings

理解题意时，需要注意A, B是seq的subsequence而不是subarray.
首先尝试贪心的思路。在遇到左括号时，分配给深度较小的序列。遇到右括号时，分配给深度较大的序列。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<int> maxDepthAfterSplit(string seq) {
        int a = 0, b = 0;
        vector<int> ret;
        for (char c : seq) {
            if (c == '(') {
                if (a <= b) {
                    ++a;
                    ret.push_back(0);
                } else {
                    ++b;
                    ret.push_back(1);
                }
            } else {
                if (a >= b) {
                    --a;
                    ret.push_back(0);
                } else {
                    --b;
                    ret.push_back(1);
                }
            }
        }
        return ret;
    }
};
```