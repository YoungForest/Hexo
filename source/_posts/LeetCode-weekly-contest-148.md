---
title: LeetCode weekly contest 148
date: 2019-08-04 12:03:11
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 77 / 5319 |	YoungForest | 23	 | 		0:56:45 | 0:09:51  | 0:24:02 | 0:41:20 | 0:56:45 |

本次比赛是我时隔3个月再次进入前100名，也是连续2次进入前200名，还是有些小开心的。算是一扫上周kick start 翻车的阴郁。
事实上，由于[评测机的问题](https://leetcode.com/problems/longest-chunked-palindrome-decomposition/discuss/350633/Wrong-problem-constraints-rejudge-all-wrong-submissions)，我比赛刚结束时看到的排名是56名。后来官方有重新评测了最后一题，有些人的提交就可以过了，也没有罚时了。
本次比赛也是质量蛮高，题目不是很难，但考察的知识点很全面，难度分布也比较合理。

## 1144. Decrease Elements To Make Array Zigzag

因为只能减1嘛，所以是到Easy题目。如果题目改成加1或减1，会难的多。
只需要比较2种情况，选择小的即可。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
public:
    int movesToMakeZigzag(vector<int>& nums) {
        int ans1 = 0;
        for (int i = 0; i < nums.size(); i += 2) {
            int neighbor = INF;
            if (i > 0) {
                neighbor = min(neighbor, nums[i - 1]);
            }
            if (i < nums.size() - 1) {
                neighbor = min(neighbor, nums[i + 1]);
            }
            if (neighbor != INF && neighbor <= nums[i]) {
                ans1 += nums[i] - neighbor + 1;
            }
        }
        int ans2 = 0;
        for (int i = 1; i < nums.size(); i += 2) {
            int neighbor = INF;
            if (i > 0) {
                neighbor = min(neighbor, nums[i - 1]);
            }
            if (i < nums.size() - 1) {
                neighbor = min(neighbor, nums[i + 1]);
            }
            if (neighbor != INF && neighbor <= nums[i]) {
                ans2 += nums[i] - neighbor + 1;
            }
        }
        return min(ans1, ans2);
    }
};
```

## 1145. Binary Tree Coloring Game

本题的难点在于理解题意。思路倒是十分直观，尽量选择最大的分支。如果大分支的数量大于一半，则必胜。
树的问题用递归，模版还是一个DFS。

时间复杂度: O(N), 遍历每个节点1次；
空间复杂度: O(N). 树的深度，最差为N。

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
    int l, r;
    // return the number of node in subtree
    int dfs(TreeNode* root, int x) {
        if (root == nullptr)
            return 0;
        int left = dfs(root->left, x);
        int right = dfs(root->right, x);
        if (root->val == x) {
            l = left;
            r = right;
        }
        return left + right + 1;
    }
public:
    bool btreeGameWinningMove(TreeNode* root, int n, int x) {
        dfs(root, x);
        if (n == l + r + 1) {
            return l != r;
        } else {
            int parent = n - l - r - 1;
            return parent - 1 > l + r || l - 1 > r + parent || r - 1 > l + parent;
        }
    }
};
```

## 1146. Snapshot Array

比较暴力的思路是每次snap，保存一次所有状态。`snap`函数的时间，空间上会比较大。
另一个比较巧妙，但也不是很难想出来的思路是，每次保存变化的内容。我采用的是这种解法。

时间复杂度:
- SnapshotArray: O(N)
- set: O(1)
- snap:  O(1)
- get: O(log N)

```cpp
class SnapshotArray {
    vector<vector<pair<int, int>>> data;
    int current_snap_id = 0;
    const int INF = numeric_limits<int>::max();
public:
    SnapshotArray(int length) {
        data.resize(length, vector<pair<int, int>>(1, {0, 0}));
    }
    
    void set(int index, int val) {
        data[index].push_back({current_snap_id, val});
    }
    
    int snap() {
        return current_snap_id++;
    }
    
    int get(int index, int snap_id) {
        auto& target = data[index];
        auto it = lower_bound(target.begin(), target.end(), make_pair(snap_id, INF));
        --it;
        return it->second;
    }
};

/**
 * Your SnapshotArray object will be instantiated and called as such:
 * SnapshotArray* obj = new SnapshotArray(length);
 * obj->set(index,val);
 * int param_2 = obj->snap();
 * int param_3 = obj->get(index,snap_id);
 */
```

## 1147. Longest Chunked Palindrome Decomposition

Greedy。每次贪心的寻找相等的头和尾。
时间复杂度：O(n ^ 2),
空间复杂度: O(N).

```cpp
class Solution {
    bool equal(const string& text, int begin1, int end1, int begin2, int end2) {
        if (end1 - begin1 != end2 - begin2) {
            return false;
        }
        for (int i = 0; i < end1 - begin1; ++i) {
            if (text[begin1 + i] != text[begin2 + i]) 
                return false;
        }
        return true;
    }
    int recurse(const string& text, int begin, int end) {
        if (begin == end)
            return 0;
        for (int i = 1; begin + i <= end - i; ++i) {
            if (equal(text, begin, begin + i, end - i, end)) {
                return recurse(text, begin + i, end - i) + 2;
            }
        }
        return 1;
    }
public:
    int longestDecomposition(string text) {
        return recurse(text, 0, text.size());
    }
};
```