---
title: LeetCode weekly contest 145
date: 2019-07-15 15:08:44
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (5) |	Q2 (5) |	Q3 (8) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 451 / 4931 |	YoungForest | 16 | 1:24:26 | 0:09:37 | 0:17:39 | 1:14:26 2 | null |

## 1122. Relative Sort Array

定制排序规则。

时间复杂度: O(N long N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<int> relativeSortArray(vector<int>& arr1, vector<int>& arr2) {
        unordered_map<int, int> location;
        for (int i = 0; i < arr2.size(); ++i) {
            location[arr2[i]] = i;
        }
        sort(arr1.begin(), arr1.end(), [location](int lhs, int rhs) -> bool {
            if (location.find(lhs) != location.end() && location.find(rhs) != location.end()) {
                return location.at(lhs) < location.at(rhs);
            } else if (location.find(lhs) == location.end() && location.find(rhs) != location.end()) {
                return false;
            } else if (location.find(lhs) != location.end() && location.find(rhs) == location.end()) {
                return true;
            } else {
                return lhs < rhs;
            }
        });
        return arr1;
    }
};
```

## 1123. Lowest Common Ancestor of Deepest Leaves
树的问题递归解决。关注需要返回给父节点的信息和传递给子节点的信息。

时间复杂度: O(N). 每个节点遍历一次。
空间复杂度: O(N). 树的最深深度，即递归的深度。

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
    pair<int, TreeNode*> recurse(TreeNode* root, int depth) {
        if (root == nullptr) {
            return {depth, nullptr};
        }
        auto l = recurse(root->left, depth + 1);
        auto r = recurse(root->right, depth + 1);
        if (l.first > r.first) {
            return l;
        } else if (l.first == r.first) {
            return {l.first, root};
        } else {
            return r;
        }
    }
public:
    TreeNode* lcaDeepestLeaves(TreeNode* root) {
        auto ans = recurse(root, 0);
        return ans.second;
    }
};
```

## 1124. Longest Well-Performing Interval

我们只关心元素的大小是否大于8，而不关心其绝对值。所以把大于8的元素变为1，小于等于8的元素变为0，可以将问题转化为，寻找1的个数大于0的最大子数组。
为了快速求解子数组中1比0多的数目，我们可以通过前缀和得出。
如：
   [9,9,6,0,6,6,9] ->
   [1,1,0,0,0,0,1] -> 前缀和
 [0,1,2,1,0,-1,-2,-3]
子数组[i, j]的1比0多的数目即为`prefix[j] - prefix[i - 1]`, 数组长度为`j - i + 1`.
即 对于每个j, 我们想找到比`prefix[j]`小的最靠前的`prefix[i-1]`. 因为prefix是连续变化的，所以找恰好比prefix[j-1]小的，就更靠前。对于prefix[j] > 0的，找0即可。
另一种找*比`prefix[j]`小的最靠前的`prefix[i-1]`*的方法是，维护一个递减栈，记录`prefix[i], i`, 找的时候通过二分查找，寻找合适的`prefix[i-1]`.

很棒的题解: [tiankonguse](https://leetcode.com/problems/longest-well-performing-interval/discuss/334897/ChineseC%2B%2B-1124.-O(n))

[花花的视频讲解](https://www.bilibili.com/video/av59225187)

```cpp
class Solution {
public:
    int longestWPI(vector<int>& hours) {
        unordered_map<int, int> memo; // sum, index
        int s = 0;
        memo[0] = -1;
        int ret = 0;
        for (int i = 0; i < hours.size(); ++i) {
            if (hours[i] > 8) {
                ++s;
            } else {
                --s;
            }
            if (memo.find(s) == memo.end()) {
                memo[s] = i;
            }
            if (s - 1 <= 0 && memo.find(s - 1) != memo.end()) {
                ret = max(ret, i - memo[s - 1]);
            }
            if (s - 1 > 0) {
                ret = max(ret, i - memo[0]);
            }
        }
        return ret;
    }
};
```

## 1125. Smallest Sufficient Team

[dp + bitmast](https://leetcode.com/problems/smallest-sufficient-team/discuss/334832/c%2B%2B-dp-bitmask-solution-with-algorithm)
由于本题是NP问题。
时间复杂度: O(2^(req_skills.size()) * people.size() * people[i].size())
空间复杂度: O(2^(req_skills.size()))

```cpp
class Solution {
public:
    vector<int> smallestSufficientTeam(vector<string>& req_skills, vector<vector<string>>& people) {
        const int n = req_skills.size();
        unordered_map<string, int> skill2bit;
        for (int i = 0; i < req_skills.size(); ++i) {
            skill2bit[req_skills[i]] = 1 << i;
        }
        map<int, vector<int>> res;
        res[0] = {};
        for (int i = 0; i < people.size(); ++i) {
            const auto& p = people[i];
            int p_skill = 0;
            for (const auto& skill : p) {
                p_skill |= skill2bit[skill];
            }
            for (auto it = res.begin(); it != res.end(); ++it) {
                int combine = p_skill | it->first;
                auto comb_it = res.find(combine);
                if (comb_it == res.end() || it->second.size() + 1 < comb_it->second.size()) {
                    res[combine] = it->second;
                    res[combine].push_back(i);
                }
            }
        }
        return res[(1 << n) - 1];
    }
};
```