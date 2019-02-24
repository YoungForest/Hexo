---
title: LeetCode weekly contest 122
date: 2019-02-04 18:38:09
tags:
- LeetCode
- Weekly Contest
categories:
- Programming
---

由于宅在家里过节，竟然忘记了每天是星期几，只知道农历腊月几日。今天才发现已经到了周一了，错过了每周一度的weekly contest。在此除夕之夜，和家人一起看春晚之前，Forest携全家人一起祝大家新年快乐！快些刷完这4道比赛题目，好安心吃年夜饭。

由于比赛不能用官方的Notes, 写在blog上还是蛮方便的一种替代品。

## 985. Sum of Even Numbers After Queries

第一题直接模拟即可。每个query有2个动作：
1. add `val` to `A[index]`;
2. sum the even values of A.

模拟的时间复杂度为：
O(K * N)
其中，N为数组长度，K为queries长度。

因为题目中K，N都不大于10000，所以总的规模在10^8 < 10^9, 是可以AC的。

```cpp
class Solution {
public:
    vector<int> sumEvenAfterQueries(vector<int>& A, vector<vector<int>>& queries) {
        vector<int> results;
        for (const vector<int>& query : queries) {
            A[query[1]] += query[0];
            int total = 0;
            for (int a : A) {
                if (a % 2 == 0) total += a;
            }
            results.push_back(total);
        }
        
        return results;
    }
};
```

不过[Solution](https://leetcode.com/problems/sum-of-even-numbers-after-queries/solution/)中给到一种复杂度为O(N+K)的。
思想是：每次计算sum时，我们可以利用上一个query的结果。
如果add后，
A中数值从奇数变为偶数了，sum = last_sum + 新偶数；
if 偶数 -> 奇数，sum = last_sum - 旧偶数;
if 偶数 -> 偶数，sum = last_sum + 新偶数 - 旧偶数;
if 奇数 -> 奇数，sum = last_sum.

```cpp
class Solution {
public:
    vector<int> sumEvenAfterQueries(vector<int>& A, vector<vector<int>>& queries) {
        vector<int> results;
        int total = 0;
        for (int a : A) {
            if (a % 2 == 0) total += a;
        }
        
        for (const vector<int>& query : queries) {
            if (A[query[1]] % 2 == 0) total -= A[query[1]];
            A[query[1]] += query[0];
            if (A[query[1]] % 2 == 0) total += A[query[1]];
            results.push_back(total);
        }
        
        return results;
    }
};
```

## 988. Smallest String Starting From Leaf

寻找二叉树中从叶子到根的最小字符串。
Intuition：递归左右子树，将根结点与更小的结合。

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
public:
    string smallestFromLeaf(TreeNode* root) {
        if (!root) return "";
        string left = smallestFromLeaf(root->left);
        string right = smallestFromLeaf(root->right);
        if (!left.empty() && !right.empty()) {
            if (left < right) {
                left.push_back('a' + root->val);
                return left;
            } else {
                right.push_back('a' + root->val);
                return right;
            }
        } else if (!left.empty()) {
            left.push_back('a' + root->val);
            return left;
        } else {
            right.push_back('a' + root->val);
            return right;
        }
            
    }
};
```

## 986. Interval List Intersections

求2个有序区间列表的并集列表。

Intuition：2个指针遍历2个列表，根据不同重合程度，选择并集和指针移动。

```cpp
/**
 * Definition for an interval.
 * struct Interval {
 *     int start;
 *     int end;
 *     Interval() : start(0), end(0) {}
 *     Interval(int s, int e) : start(s), end(e) {}
 * };
 */
class Solution {
public:
    vector<Interval> intervalIntersection(vector<Interval>& A, vector<Interval>& B) {
        vector<Interval> results;
        
        auto a = A.begin();
        auto b = B.begin();
        
        while (a != A.end() && b != B.end()) {
            if (a->end < b->start) {
                a++;
            } else if (b->end < a->start) {
                b++;
            } else if (a->start < b->start) {
                if (a->end < b->end) {
                    Interval interval(b->start, a->end);
                    results.push_back(interval);
                    a++;
                } else {
                    results.push_back(*b);
                    b++;
                }
            } else if (b->start < a->start) {
                if (b->end < a->end) {
                    Interval interval(a->start, b->end);
                    results.push_back(interval);
                    b++;
                } else {
                    results.push_back(*a);
                    a++;
                }
            } else {
                if (a->end <= b->end) {
                    Interval interval(b->start, a->end);
                    results.push_back(interval);
                    a++;
                } else {
                    Interval interval(a->start, b->end);
                    results.push_back(interval);
                    b++;
                }
                // cout << "(" << a->start << ", " << a->end << "), ";
                // cout << "(" << b->start << ", " << b->end << ")" << endl;
            }
        }
        
        return results;
    }
};
```

## 987. Vertical Order Traversal of a Binary Tree

Intution: 建立一个dequeue<treemap<int>>, 对于每一颗子树，讲root插入当前的treemap中（使用treemap以保证同一X层内的顺序），同时递归调用左右子树，并更新当前的treemap。
最后再转化为vector<vector<int>>。

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
    deque<multiset<pair<int, int>>> results;
    void recurse(TreeNode* root, deque<multiset<pair<int, int>>>::iterator current, int level) {
        if (!root) return;
        if (current == results.end()) {
            multiset<pair<int, int>> s;
            results.push_back(s);
            current = results.end() - 1;
        }
        if (current + 1 == results.begin()) {
            multiset<pair<int, int>> s;
            results.push_front(s);
            current = results.begin();
        }
        current->insert({level, root->val});
        recurse(root->left, current - 1, level + 1);
        recurse(root->right, current + 1, level + 1);
    }
public:
    vector<vector<int>> verticalTraversal(TreeNode* root) {
        recurse(root, results.begin(), 0);
        
        vector<vector<int>> ret;
        for (const multiset<pair<int, int>>& s : results) {
            vector<int> v;
            for (const pair<int, int> num : s) {
                v.push_back(num.second);
            }
            ret.push_back(v);
        }
        
        return ret;
    }
};
```

## 后记

Google的电话面试的结果已经出来了。很遗憾Forest Fail掉了，没有进入下一轮面试。虽然是在情理之中的事情，但还是挺伤心的。比较了同行的实力后，我发现自己还是LeetCode刷的不够多。年初定目标竟然只定了300道，看现在程序员竞争的灿烈程度，300道估计是远远不够的。毕竟自己已经练习了有200道了，实习生的面试都应对不了。经过这次失败，我重新审视了自己的实力，决定将今年的刷题计划提高到900道，或者是把所有的可刷的题目都刷完。因为有Premium才能刷的题目，所以现在不知道能刷的有多少。把该刷的刷完，我也会买个大会员，进一步刷题的。

我告诉快手师兄C++是我的主语言，然后他问了我C++11的新特性“move的语义”是什么？然后我就gg了。自己对C++掌握的只是皮毛而已，还好意思说会C++。春节假期一定要把《C++ Primer》看完，否则节后都不好意思找快手师兄啦！

任重而道远啊！加油，Forest！