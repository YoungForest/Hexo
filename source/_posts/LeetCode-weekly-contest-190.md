---
title: LeetCode weekly contest 190
date: 2020-05-24 12:43:24
tags:
- LeetCode
categories:
- Programming
---

昨晚老爸帮我掏耳朵，一不小心掏出了血。今天一大早就去地区医院检查，还好并无大碍，只损伤了外耳道，休息一周，自然痊愈就好了。只要不感染，就没问题。开了些阿姆西林吃了。
所以鸽了周赛，赛后补题。

## 1455. Check If a Word Occurs As a Prefix of Any Word in a Sentence

C++没有自带的切割字符串的方法，不过可以用自己的模版。通过stringstream实现分割，O(N)的复杂度.

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
    vector<string> splitSentence(const string& text) {
        string tmp;
        vector<string> stk;
        stringstream ss(text);
        while(getline(ss,tmp,' ')) {
            stk.push_back(tmp);
        }
        return stk;
    }
public:
    int isPrefixOfWord(string sentence, string searchWord) {
        auto words = splitSentence(sentence);
        for (int i = 0; i < words.size(); ++i) {
            if (words[i].find(searchWord) == 0) return i + 1;
        }
        return -1;
    }
};
```

## 1456. Maximum Number of Vowels in a Substring of Given Length

滑动窗口。窗口大小为k，统计窗口内的vowels。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int maxVowels(string s, int k) {
        int count = 0;
        unordered_set<int> vowels = {
            'a', 'e', 'i', 'o', 'u'
        };
        for (int i = 0; i < k; ++i) {
            if (vowels.find(s[i]) != vowels.end()) {
                ++count;
            }
        }
        int ans = count;
        for (int i = k; i < s.size(); ++i) {
            if (vowels.find(s[i]) != vowels.end()) {
                ++count;
            }
            if (vowels.find(s[i-k]) != vowels.end()) {
                --count;
            }
            ans = max(ans, count);
        }
        return ans;
    }
};
```

## 1457. Pseudo-Palindromic Paths in a Binary Tree

根据字母出现频数为奇数的字母个数是否 <= 判断是否回文。
采用dfs搜索路径。

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
    bool isPalindromicPath(const unordered_map<int, int>& count) {
        int odd = 0;
        for (const auto& p : count) {
            if (p.second % 2 == 1) {
                ++odd;
            }
        }
        return odd <= 1;
    }
public:
    int pseudoPalindromicPaths (TreeNode* root) {
        unordered_map<int, int> path;
        int ans = 0;
        function<void(TreeNode*)> dfs = [&](TreeNode* root) -> void {
            if (root) {
                ++path[root->val];
                if (!root->left && !root->right) { // leaf
                    if (isPalindromicPath(path)) {
                        ++ans;
                    }
                }
                dfs(root->left);
                dfs(root->right);
                --path[root->val];
            }
        };
        dfs(root);
        return ans;
    }
};
```

## 1458. Max Dot Product of Two Subsequences

DP。dp[i][j] 表示nums1[:i+1], nums2[:j+1]的max dot product.

`dp[i][j] = max({dp[i-1][j], dp[i][j-1], dp[i-1][j-1] + nums1[i]*nums2[j], nums1[i]*nums2[j]});`

需要注意的是，并不允许空的subsequence。

时间复杂度: O(nums1.size() * nums2.size()),
空间复杂度: O(nums1.size() * nums2.size()).

```cpp
class Solution {
public:
    int maxDotProduct(vector<int>& nums1, vector<int>& nums2) {
        const int m = nums1.size();
        const int n = nums2.size();
        vector<vector<int>> dp(m, vector<int>(n, 0));
        // nums[i], nums[j], max dot product
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (i > 0 && j > 0) {
                    dp[i][j] = max({dp[i-1][j], dp[i][j-1], dp[i-1][j-1] + nums1[i]*nums2[j], nums1[i]*nums2[j]});
                } else if (i == 0 && j == 0) {
                    dp[i][j] = nums1[i]*nums2[j];
                } else if (i == 0) {
                    dp[i][j] = max({dp[i][j-1], nums1[i]*nums2[j]});
                } else {
                    dp[i][j] = max({dp[i-1][j], nums1[i]*nums2[j]});
                }
            }
        }
        return dp[m-1][n-1];
    }
};
```