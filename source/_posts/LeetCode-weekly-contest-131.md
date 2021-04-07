---
title: LeetCode weekly contest 131
date: 2019-04-07 12:19:41
tags:
- Competitive Programming
categories:
- LeetCode
---

本次比赛的题号吓了我一跳. LeetCode也是任性，直接从5000+开始出题了。看来题量上涨的空间已经超乎我的想象了。

言归正传，本次contest也是以简单题拼速度为主。
| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (5) |	Q4 (5)|
|--|--|--|--|--|--|--|--|
|323 / 4894|	YoungForest |	22 | 	0:59:58	 | 0:10:44 | 0:19:06(2) |	0:30:57 |0:49:58 |
也是大概需要50min内完成，才能进入200名内。

## 1021. Remove Outermost Parentheses

Intution:
括号匹配的问题。利用栈的思维，设置一个flag表示是否是Outermost。利用状态机的思维构造返回的字符串。

时间复杂度: O(N)
空间复杂度: O(1)

```cpp
class Solution {
public:
    string removeOuterParentheses(string S) {
        int flag = 0;
        string ret;
        for (char c : S) {
            if (c == '(') {
                if (flag != 0)
                    ret.push_back(c);
                flag++;
            } else if (c == ')') {
                if (flag != 1)
                    ret.push_back(c);
                flag--;
            }
        }
        
        return ret;
    }
};
```

## 1022. Sum of Root To Leaf Binary Numbers

Intution:
recurse, 二进制表示的值用传值的方式进行传递。

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
    const static int mod = 1e9 + 7;
    int ret = 0;
    void dfs(TreeNode* root, int value) {
        int current_value = (value << 1) % mod + root->val;
        if (root->left) dfs(root->left, current_value);
        if (root->right) dfs(root->right, current_value);
        if (!root->left && !root->right)
            ret = (ret + current_value) % mod;
    }
public:
    int sumRootToLeaf(TreeNode* root) {
        dfs(root, 0);
        return ret;
    }
};
```

需要注意的是取模的地方会有2个
- 计算`current_value`
- 累加`ret`

时间复杂度: O(N)，所有节点都要遍历一次。
空间复杂度: O(N)，树的深度，最差的情况是等于节点数。

## 1023. Camelcase Matching

Intution:
直接比较即可。借鉴状态机的思想，不同条件下，执行的操作不同(`i`, `j`的变化)。

```cpp
class Solution {
    bool answer(const string& query, const string& pattern) {
        int i, j;
        for (i = 0, j = 0; i < pattern.size() && j < query.size();) {
            if (query[j] == pattern[i]) {
                i++;
                j++;
            } else if (islower(query[j])) {
                j++;
            } else {
                return false;
            }
        }
        if (i == pattern.size()) {
            for (; j < query.size(); j++) {
                if (!islower(query[j]))
                    return false;
            }
        } else {
            return false;
        }
        
        return true;
    }
public:
    vector<bool> camelMatch(vector<string>& queries, string pattern) {
        vector<bool> ret;
        for (auto query : queries) {
            ret.push_back(answer(query, pattern));
        }
        return ret;
    }
};
```

时间复杂度: O(N * M), queries的长度，和每个query的长度。
空间复杂度: O(N).

## 1024. Video Stitching

Intution:
贪心。每次添加的clip都使得拼接完的视频最长。

```cpp
class Solution {
public:
    int videoStitching(vector<vector<int>>& clips, int T) {
        // greedy
        int ret = 0;
        int current_interval_right = 0;
        for (;current_interval_right < T;) {
            int max_left = 0;
            for (const auto& clip : clips) {
                if (clip[0] <= current_interval_right)
                    max_left = max(clip[1], max_left);
            }
            if (current_interval_right == max_left) {
                return -1;
            }
            current_interval_right = max_left;
            ret ++;
        }
        return ret;
    }
};
```

时间复杂度: O(N ^ 2).
空间复杂度: O(1).

## 后记

最近参加了微软的summer intern的笔试题，过了签到题，第3题有个case超时了。后来在网上查了后，才知道有种叫做order statistic tree的数据结构，可以实现O(log n)的rank、删除任意节点、删除头节点。
微软和Google的笔试题的难度都上升到ICPC(现在不能叫ACM了，因为ACM已经不赞助了。可能需要叫IBM-ICPC了。哈哈)了，LeetCode相比之下只能算是小弟弟。
暑假抽时间把之前买的 挑战程序设计竞赛 和 算法竞赛入门经典 钻研一下，一定帮助很大。
编程之美(甚至还是邹欣老师的亲笔签名版)到手也3年了，我竟然还没看完。

要说大学期间我最后悔的事情: 一是没有早点想清楚自己毕业要干什么；二是没有抱住tls的大腿入门ACM。

这周还干的一件挺有意义的事情是，报名参加Goolge的summer code。虽然入选的几率不大，但今年可以先试一试，为明年的在此申请做铺垫。
