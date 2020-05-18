---
title: LeetCode biweekly contest 26
date: 2020-05-17 10:15:47
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 115 / 7795 |	YoungForest | 19 | 	0:33:49 |  0:03:55 |   0:08:25 | 0:11:57 |   0:28:49  1 |

上上周是五一假期，去河北正定和，因疫情原因，3个月没有见面的女朋友约会。所以周六晚上就时间不太合适，鸽了一场双周赛。之后还是会尽量参加的。最近比赛越来越顺手了，无论是每次的排名，还是rating，或是残酷群的排名。比之前都有所上升。尤其要感谢残酷群的每日一题和不定时的讲座，让我对DP和很多Hard的题目有了解决的信心。在此，再次安利一下[残酷刷题群](https://wisdompeak.github.io/lc-score-board/).

## 1446. Consecutive Characters

滑动窗口，维持整个窗口的字母相等。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int maxPower(string s) {
        const int n = s.size();
        int l = 0, r = 0;
        int ans = 1;
        for (; r < s.size(); ++r) {
            if (s[r] == s[l]) continue;
            else {
                ans = max(ans, r - l);
                l = r;
            }
        }
        ans = max(ans, n - l);
        return ans;
    }
};
```

## 1447. Simplified Fractions

枚举所有的分母和分子，并判断是否是最简形式。幸运的是，C++17已经内置提供`gcd`函数。

时间复杂度: O(n^2),
空间复杂度: O(n).

```cpp
class Solution {
public:
    vector<string> simplifiedFractions(int n) {
        vector<string> ans;
        for (int down = 2; down <= n; ++down) {
            for (int up = 1; up < down; ++up) {
                if (gcd(up, down) == 1) {
                    ans.push_back(to_string(up) + "/" + to_string(down));
                }
            }
        }
        return ans;
    }
};
```

## 1448. Count Good Nodes in Binary Tree

dfs, 把祖先节点的最大值作为参数传入。

时间复杂度: O(n),
空间复杂度: O(n).

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
    const int INF = 0x3f3f3f3f;
    int recurse(TreeNode* root, int maxValue) {
        if (!root) return 0;
        int ans = 0;
        if (root->val >= maxValue) ans = 1;
        maxValue = max(maxValue, root->val);
        return recurse(root->left, maxValue) + recurse(root->right, maxValue) + ans;
    }
public:
    int goodNodes(TreeNode* root) {
        return recurse(root, -INF);
    }
};
```

## 1449. Form Largest Integer With Digits That Add up to Target

DP. 背包问题，每次尝试加入一个数字。
可以利用Greedy的思路，如果2个数的cost相同，则只有大数有用，进行常数上的优化。

时间复杂度: O(target * target * 9),
空间复杂度: O(target * target).

```python
class Solution:
    def largestNumber(self, cost: List[int], target: int) -> str:
        unique = {}
        seen = set()
        for i in range(len(cost) - 1, -1, -1):
            if cost[i] not in seen:
                seen.add(cost[i])
                unique[i + 1] = cost[i]
        @lru_cache(None)
        def dp(t: int) -> int:
            if t < 0:
                return -1
            if t == 0:
                return 0
            ans = -1
            for i in unique:
                tmp = dp(t - unique[i])
                if tmp >= 0:
                    ans = max(ans,  tmp * 10 + i)
            return ans
        ans = dp(target)
        return str(ans) if ans >= 0 else '0'
```

[Discuss](https://leetcode.com/problems/form-largest-integer-with-digits-that-add-up-to-target/discuss/635267/C%2B%2BJavaPython-Strict-O(Target))中有O(target)的解法，主要思路是，不再以dp存储最大的字符串，而只存数位长度，然后再backward构造出结果。