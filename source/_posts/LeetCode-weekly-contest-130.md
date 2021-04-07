---
title: LeetCode weekly contest 130
date: 2019-03-31 12:43:43
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (5) |	Q4 (5)|
|--|--|--|--|--|--|--|--|
|258 / 5236|	YoungForest |	19|	0:57:19 |	0:06:23 |	0:25:41 |	0:36:25	|0:52:19(1) |

本次contest比较简单，都是常规题。没有hard来区分水平，就看谁的实现的速度快了。50min内才能前200名。
第二题耽误了些时间，最后一题刚开始思路秀逗了，走了些弯路。

## 1029. Binary Prefix Divisible By 5

Intution:
Stright forward. 循环移位，判断除5的余数。需要注意current要取模，因为A的长度会很大。
时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<bool> prefixesDivBy5(vector<int>& A) {
        vector<bool> ret(A.size(), false);
        uint32_t current = 0;
        for (int i = 0; i < A.size(); i++) {
            current = (current << 1) % 10;
            current += A[i];
            if (current == 0 || current == 5)
                ret[i] = true;
        }
        
        return ret;
    }
};
```

## 1028. Convert to Base -2

Intution:
类比2进制的解法。不断整除2.

```cpp
class Solution {
public:
    string baseNeg2(int N) {
        if (N == 0) return "0";
        string ret_reverse;
        bool flag = true; // 正
        while (N > 0) {
            if (N % 2 == 1) {
                ret_reverse.push_back('1');
                if (flag)
                    N /= 2;
                else
                    N = (N + 1) / 2;    // 此处要加一，因为最后一位的权重此时是-1. N下一步的迭代要把其补上
            } else {
                ret_reverse.push_back('0');
                N /= 2;
            }
            flag = !flag;
        }
        
        reverse(ret_reverse.begin(), ret_reverse.end());
        return ret_reverse;
    }
};
```

## 1030. Next Greater Node In Linked List

Intution:
单调栈。
时间复杂度: O(N),
空间复杂度: O(N).

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    vector<int> nextLargerNodes(ListNode* head) {
        // 单调栈
        vector<int> ret;
        stack<pair<int, int>> s; // index, value
        int index = 0;
        while (head) {
            while (!s.empty() && head->val > s.top().second) {
                auto current = s.top();
                s.pop();
                ret[current.first] = head->val;
            }
            ret.push_back(0);
            s.push({index, head->val});
            index++;
            head = head->next;
        }
        
        return ret;
    }
};
```

## 1031. Number of Enclaves

Intution: 
DFS, 从边缘开始进行搜索。
时间复杂度: O(N^2),
空间复杂度: O(N^2).

```cpp
class Solution {
    void dfs(vector<vector<int>>& A, int i, int j) {
        if (A[i][j] == 0 || A[i][j] == 2) return;
        A[i][j] = 2;
        vector<int> di {0, 1, 0, -1};
        vector<int> dj {1, 0, -1, 0};
        for (int k = 0; k < 4; k++) {
            int new_i = di[k] + i;
            int new_j = dj[k] + j;
            if (new_i >= 0 && new_j >= 0 && new_i < A.size() && new_j < A[0].size()) {
                dfs(A, new_i, new_j);
            }
        }
    }
public:
    int numEnclaves(vector<vector<int>>& A) {
        for (int j = 0; j < A[0].size() - 1; j++) {
            dfs(A, 0, j);
        }
        for (int i = 0; i < A.size() - 1; i++) {
            dfs(A, i, A[0].size() - 1);
        }
        for (int j = A[0].size() - 1; j > 0; j--) {
            dfs(A, A.size() - 1, j);
        }
        for (int i = A.size() - 1; i > 0; i--) {
            dfs(A, i, 0);
        }
        
        int ret = 0;
        for (int i = 0; i < A.size(); i++) {
            for (int j = 0; j < A[0].size(); j++) {
                if (A[i][j] == 1)
                    ret++;
            }
        }
        return ret;
    }
};
```


## 后记

在LeetCode上刷了有319 / 969题了，算是到达一定瓶颈了。我目前是按照通过率刷的，正常情况下，也代表着从易到难。容易的题已经做完了，之后的题目会越来越难。刚开始10min能写一道题，看到题就知道怎么做，现在需要半个小时，每道题还需要思考一段时间。
但这是好现象，只有做这种有一定难度，但又不超出自己能力范畴的题目，才能快速提高。

加油，Forest！