---
title: LeetCode weekly contest 249
date: 2021-07-11 17:54:25
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (6) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 74 / 12832 | YoungForest | 19 | 1:06:48 | 0:02:44 | 0:07:11 | 0:37:44 | 1:01:48 🐞1 |

周赛博客更新一不小心就鸽了3周。因为最近毕业+入职，确实比较忙。中间因为毕业旅行，甚至罕见地鸽了一次周赛和双周赛。
本周算是入职亚马逊之后的第一周，全球排名也惊喜地达到了74名。仔细算算，自己上次周赛进前100名还是243场，也就是大概一个半月前的时间了。
本周后2题都是hard，确实容易拉开距离。

因为我国服rating达到了2460，我担心掉分，因此最近基本都在美服玩耍。美服是个2330的“小号”，基本很难掉分。

## 1929. Concatenation of Array

签到题。Straight forward。Python竟然可以一行`return nums + nums`。

```cpp
class Solution {
public:
    vector<int> getConcatenation(vector<int>& nums) {
        const int n = nums.size();
        vector<int> ans(2 * n);
        for (int i = 0; i < n; ++i) {
            ans[i] = ans[i+n] = nums[i];
        }
        return ans;
    }
};
```

时间复杂度: O(n),
空间复杂度: O(n).

## 1930. Unique Length-3 Palindromic Subsequences

因为回文串的长度比较短，只有3. 因此，最多有26*26种回文串。可以用中间和两侧的字符表示这个回文串。
因为是subsequence，需要用`cntLeft`和`cntRight`维护两侧字符是否满足要求。

```cpp
class Solution {
public:
    int countPalindromicSubsequence(string s) {
        vector<vector<bool>> seen(26, vector<bool>(26, false));
        int ans = 0;
        vector<int> cntRight(26, 0);
        for (char c : s) {
            ++cntRight[c - 'a'];
        }
        vector<int> cntLeft(26, 0);
        for (char c : s) {
            --cntRight[c - 'a'];
            for (char i = 'a'; i <= 'z'; ++i) {
                if (cntRight[i - 'a'] > 0 && cntLeft[i - 'a'] > 0) {
                    if (!seen[c - 'a'][i - 'a']) {
                        ++ans;
                        seen[c - 'a'][i - 'a'] = true;
                    }
                }
            }
            ++cntLeft[c - 'a'];
        }
        return ans;
    }
};
```

时间复杂度: O(26*s.length),
空间复杂度: O(26 * 26).

## 1931. Painting a Grid With Three Different Colors

算是[1411. Number of Ways to Paint N × 3 Grid](https://leetcode.com/problems/number-of-ways-to-paint-n-3-grid/)的升级版。
行数从3变成了1-5，但思想不变，仍然是 3进制的bit_mask + dp。

用3进制bit_mask表示每一列的颜色状态，从上一列的颜色排列数量得到新的一列的数量。

```cpp
class Solution {
    const int MOD = 1e9 + 7;
public:
    int colorTheGrid(int m, int n) {
        int pow3m = 1;
        for (int x = 0; x < m; ++x) {
            pow3m *= 3;
        }
        auto ok = [&](int i, int j) -> bool {
            for (int x = 0; x < m; ++x) {
                if ((i % 3) == (j % 3)) return false;
                i /= 3;
                j /= 3;
            }
            return true;
        };
        auto isLegal = [&](int i) -> bool {
            int last = -1;
            for (int x = 0; x < m; ++x) {
                if (i % 3 == last) return false;
                last = i % 3;
                i /= 3;
            }
            return true;
        };
        
        vector<vector<int>> match(pow3m);
        vector<bool> legal(pow3m);
         for (int i = 0; i < (pow3m); ++i) {
              legal[i] = isLegal(i);
         }
         for (int i = 0; i < (pow3m); ++i) {
              // cout << legal[i] << " " << endl;
              if (!legal[i]) continue;
              for (int j = 0; j < (pow3m); ++j) {
                  // cout << i << " " << j << "....";
                  if (!legal[j]) continue;
                  // cout << i << " " << j << "****";
                  if (ok(i, j)) {
                      match[i].push_back(j);
                      // cout << i << " " << j << ";";
                  }
              }
         }
        vector<vector<int>> dp(pow3m, vector<int> (n, 0));
        for (int mask = 0; mask < (pow3m); ++mask) {
            if (legal[mask])
                dp[mask][0] = 1;
            // cout << dp[mask][0] << " ";
        }
        // cout << endl;
        for (int i = 1; i < n; ++i) {
            for (int mask = 0; mask < (pow3m); ++mask) {
                if (!legal[mask]) continue;
                for (int left : match[mask]) {
                    dp[mask][i] = (dp[mask][i] + dp[left][i-1]) % MOD;
                }
                // cout << dp[mask][i] << " ";
            }
            // cout << endl;
        }
        int ans = 0;
        for (int mask = 0; mask < (pow3m); ++mask) {
            if (legal[mask])
                ans = (ans + dp[mask][n-1]) % MOD;
        }
        return ans % MOD;
    }
};
```

时间复杂度: O(3^m^2 + n*3^m),
空间复杂度: O(n * 3^m).

## 1932. Merge BSTs to Create Single BST

算法不难，但是实现起来比较复杂，corner case也容易fail。
根据题目描述，找到每个根和叶子的对应，进行合并操作。
最后还得检查是否是BST。

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
    tuple<bool, int, int> solve(TreeNode* root) {
        // is BST, max value, min value
        if (!root) return {true, 0, 0};
        tuple<bool, int, int> ret = {true, root->val, root->val};
        if (root->left) {
            auto l = solve(root->left);
            get<0>(ret) = get<0>(ret) && get<0>(l) && root->val > get<1>(l);
            get<2>(ret) = min(get<2>(ret), get<2>(l));
        }
        if (root->right) {
            auto r = solve(root->right);
            get<0>(ret) = get<0>(ret) && get<0>(r) && root->val < get<2>(r);
            get<1>(ret) = max(get<1>(ret), get<1>(r));
        }
        return ret;
    }
    bool isValidBST(TreeNode* root) {
        return get<0>(solve(root));
    }
    int count(TreeNode* root) {
        if (!root) return 0;
        return count(root->left) + count(root->right) + 1;
    }
public:
    TreeNode* canMerge(vector<TreeNode*>& trees) {
        const int n = trees.size();
        unordered_map<TreeNode*, TreeNode*> leaves;
        unordered_map<int, TreeNode*> value2leaf;
        vector<TreeNode*> equalLeaves;
        bool bad = false;
        unordered_set<int> seen;
        function<void(TreeNode*, TreeNode*)> dfs = [&](TreeNode* root, TreeNode* parent) -> void {
            seen.insert(root->val);
            if (parent) {
                if (value2leaf.find(root->val) != value2leaf.end()) {
                    bad = true;
                    return;
                }
                leaves[root] = parent;
                value2leaf[root->val] = root;
            }
            if (root->left) {
                dfs(root->left, root);
            }
            if (root->right) {
                dfs(root->right, root);
            }
        };
        for (auto root : trees) {
            dfs(root, nullptr);
            if (bad) return nullptr;
        }
        TreeNode* ans = nullptr;
        for (auto root : trees) {
            auto it = value2leaf.find(root->val);
            if (it == value2leaf.end()) {
                if (ans != nullptr) return nullptr;
                ans = root;
            } else {
                auto leaf = it->second;
                auto parent = leaves[leaf];
                if (parent->left && parent->left->val == root->val) {
                    parent->left = root;
                } else if (parent->right && parent->right->val == root->val) {
                    parent->right = root;
                }
                
            }
        }
        if (ans) {
            if (!isValidBST(ans)) return nullptr;
            if (count(ans) != seen.size()) return nullptr;
        }
        return ans;
    }
};
```

时间复杂度: O(trees.length),
空间复杂度: O(trees.length).


