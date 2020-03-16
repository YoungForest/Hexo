---
title: LeetCode biweekly contest 21
date: 2020-03-08 11:35:48
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 175 / 4729 |	YoungForest | 19 | 	1:05:07 | 0:21:38 |  0:39:43 |  0:50:40 |  1:05:07 |

整体难度不大，尤其是后2题并没有该有的难度。

## 1370. Increasing Decreasing String

直接模拟构造结果字符串的过程即可。这里寻找字符串的过程可以使用二分查找，因为原始字符串需要更新，所以使用二叉查找树这一数据结构较好。

时间复杂度: O(N * log N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    string sortString(string s) {
        string ans;
        multiset<char> container;
        for (char c : s) {
            container.insert(c);
        }
        while (!container.empty()) {
            char smallest = *container.begin();
            container.erase(container.begin());
            ans.push_back(smallest);
            decltype(container.begin()) it;
            while ((it = container.upper_bound(smallest)) != container.end()) {
                ans.push_back(*it);
                smallest = *it;
                container.erase(it);
            }
            if (!container.empty()) {
                char largest = *(prev(container.end()));
                container.erase(prev(container.end()));
                ans.push_back(largest);
                while ((it = container.lower_bound(largest)) != container.begin()) {
                    ans.push_back(*prev(it));
                    largest = *prev(it);
                    container.erase(prev(it));
                }
            }
        }
        return ans;
    }
};
```

## 1371. Find the Longest Substring Containing Vowels in Even Counts

观察有：奇数减奇数等于偶数，偶数减偶数等于偶数。所以问题可以转化为，寻找最左边计数为奇数（或偶数）的位置。因为有5个元音字母，分奇偶，共32种状态。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int findTheLongestSubstring(string s) {
        vector<int> left_state(32, -2);
        left_state[0] = -1;
        auto code = [&](unordered_map<char, int>& m) -> unsigned int {
            const static vector<char> position = {'a', 'e', 'i', 'o', 'u'};
            unsigned  int ans = 0;
            for (unsigned  int i = 0; i < position.size(); ++i) {
                if  (m[position[i]] % 2 == 1) {
                    ans |= (1 << i);
                }
            }
            return ans;
        };
        unordered_map<char, int> m;
        int ans = 0;
        for (int i = 0; i < s.size(); ++i) {
            ++m[s[i]];
            auto c = code(m);
            if (left_state[c] != -2) {
                ans = max(ans, i - left_state[c]);
            } else {
                left_state[c] = i;
            }
        }
        return ans;
    }
};
```

## 1372. Longest ZigZag Path in a Binary Tree

树的问题用递归解。

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
    // left, right
    // return result if root is left/right child
    int ret = 0;
    pair<int, int> recurse(TreeNode* root) {
        if (root) {
            auto l = recurse(root->left);
            auto r = recurse(root->right);
            ret = max({ret, r.second + 1, l.first + 1});
            return {r.second + 1, l.first + 1};
        } else {
            return {-1, -1};
        }
    }
public:
    int longestZigZag(TreeNode* root) {
        auto ans = recurse(root);
        return ret;
    }
};
```

## 1373. Maximum Sum BST in Binary Tree

仍然是 树的问题用递归解决。
返回值依次为：
- 子树中的最小值
- 子树中的最大值
- 是否为BST
- 子树的和

时间复杂度: O(N),
空间复杂度: O(height).

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
    int ret = 0;
    // smallest, largest, BST?, sum
    tuple<int, int, bool, int> recurse(TreeNode* root) {
        if (!root) {
            return {0, 0, true, 0};
        } else {
            auto l = recurse(root->left);
            auto r = recurse(root->right);
            bool isBST = (root->left == nullptr || get<1>(l) < root->val) && (root->right == nullptr || get<0>(r) > root->val) && get<2>(l) && get<2>(r);
            int smallest = root->val, largest = root->val;
            if (root->left) {
                smallest = min(smallest, get<0>(l));
                largest = max(largest, get<1>(l));
            }
            if (root->right) {
                smallest = min(smallest, get<0>(r));
                largest = max(largest, get<1>(r));
            }
                   
            int s = get<3>(l) + get<3>(r) + root->val;
            if (isBST)
                ret = max(s, ret);
            return {smallest, largest, isBST, s};
        }
    }
public:
    int maxSumBST(TreeNode* root) {
        recurse(root);
        return ret;
    }
};
```