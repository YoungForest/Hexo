---
title: LeetCode weekly contest 174
date: 2020-02-03 20:18:32
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 459 / 6997 |	YoungForest | 	18	 | 	1:04:52 | 0:15:31 | 0:21:58 |  0:41:22  2 | 0:54:52 |

终于回到亲爱的祖国啦。可以周日早上起来打LeetCode的比赛了。不得不承认，4个月没打，手生了很多。从比赛名次上就可以看出。
这次比赛是完全的手速场，而手速是很看状态和熟练度的。因此排名掉了我心服口服。也恰好可以督促自己投入更多的精力准备接下来谷歌的面试。

## 1341. The K Weakest Rows in a Matrix

二分搜索 查找每行的士兵数，排序找到前K个最少的行。

时间复杂度: O(m log m * log n)
空间复杂度: O(m)

```cpp
class Solution {
    bool decide(const vector<int>& row, int x) {
        return row[x] == 1;
    }
    int number(const vector<int>& row) {
        int lo = 0, hi = row.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (decide(row, mid)) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
public:
    vector<int> kWeakestRows(vector<vector<int>>& mat, int k) {
        vector<pair<int, int>> q;
        for (int i = 0; i < mat.size(); ++i) {
            q.push_back({number(mat[i]), i});
        }
        // for (auto a : q) {
        //     cout << a.first << " " << a.second << endl;
        // }
        sort(q.begin(), q.end(), [](auto a, auto b) -> bool {
            if (a.first == b.first) {
                return a.second < b.second;                
            } else {
                return a.first < b.first;
            }
        });
        // for (auto a : q) {
        //     cout << a.first << " " << a.second << endl;
        // }
        vector<int> ans;
        for (int i = 0; i < k; ++i) {
            ans.push_back(q[i].second);
        }
        return ans;
    }
};
```

## 1342. Reduce Array Size to The Half

贪心策略。每次删除出现次数最多的数。

时间复杂度: O(N log N).
空间复杂度: O(N).

```cpp
class Solution {
public:
    int minSetSize(vector<int>& arr) {
        unordered_map<int, int> count;
        for (int i : arr) {
            ++count[i];
        }
        vector<int> v;
        for (auto p : count) {
            v.push_back(p.second);
        }
        sort(v.begin(), v.end(), greater<int>());
        int ans = 0, target = (arr.size() + 1) / 2, accu = 0;
        while (accu < target) {
            accu += v[ans];
            ++ans;
        }
        return ans;
    }
};
```

## 1343. Maximum Product of Splitted Binary Tree

枚举搜索即可。尝试所有的子树组合，寻找乘积最大的。
在这里要注意，`modulo 10^9 + 7`的操作，我在此WA了2此。我使用`unsigned long long`，最后才`mod`。

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
    using ll = unsigned long long;
    const ll mod = 1e9 + 7;
    ll ans = 0;
    ll sumOfSubtree(TreeNode* root, const ll total) {
        if (root == nullptr) {
            return 0;
        } else {
            ll l = sumOfSubtree(root->left, total);
            ll r = sumOfSubtree(root->right, total);
            if (root->left != nullptr) {
                ans = max(ans, l * (total - l));
            }
            if (root->right != nullptr) {
                ans = max(ans, r * (total - r));
            }
            return root->val + l + r;
        }
    }
    ll sum(TreeNode* root) {
        if (root) {
            return root->val + sum(root->left) + sum(root->right);
        } else {
            return 0;
        }
    }
public:
    int maxProduct(TreeNode* root) {
        ll total = sum(root);
        sumOfSubtree(root, total);
        return ans % mod;
    }
};
```

## 1344. Jump Game V

自顶向下的动态规划思想。从每个index尝试向左右跳，直到遇到高度更大的。

时间复杂度: O(N ^ 2).
空间复杂度: O(N).

```cpp
class Solution {
    int dp(const vector<int>& arr, const int d, unordered_map<int, int>& memo, int x) {
        if (x < 0 || x >= arr.size()) {
            return 0;
        } else if (memo.find(x) != memo.end()) {
            return memo[x];
        }
        else {
            int ans = 1;
            for (int i = x + 1; i < arr.size() && i <= x + d && arr[i] < arr[x]; ++i) {
                ans = max(ans, dp(arr, d, memo, i) + 1);
            }
            for (int i = x - 1; i >= 0 && i >= x - d && arr[i] < arr[x]; --i) {
                ans = max(ans, dp(arr, d, memo, i) + 1);
            }
            return memo[x] = ans;
        }
    }
public:
    int maxJumps(vector<int>& arr, int d) {
        int ans = 0;
        unordered_map<int, int> memo;
        for (int i = 0; i < arr.size(); ++i) {
            ans = max(ans, dp(arr, d, memo, i));
        }
        return ans;
    }
};
```