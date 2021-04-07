---
title: LeetCode weekly contest 209
date: 2020-10-07 11:35:47
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 522 / 12138 | YoungForest | 12 | 0:49:07 | 0:05:12 | 0:11:28 | 0:39:07 2 | null |

## 1608. Special Array With X Elements Greater Than or Equal X

签到题。从小到大枚举可能的答案，进行检查。

```cpp
class Solution {
public:
    int specialArray(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        const int n = nums.size();
        auto check = [&](const int i) -> bool {
            auto it = lower_bound(nums.begin(), nums.end(), i);
            const int d = distance(nums.begin(), it);
            const int le = n - d;
            return le == i;
        };
        for (int i = 1; i <= 100; ++i) {
            if (check(i)) {
                return i;
            }
        }
        return -1;
    }
};
```

时间复杂度: O(N * log N),


## 1609. Even Odd Tree

二叉树的层序遍历。使用广度优先搜索（BFS），记录层数和前一个元素即可。

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
public:
    bool isEvenOddTree(TreeNode* root) {
        // bfs
        queue<TreeNode*> q;
        int level = 0;
        if (root) q.push(root);
        while (!q.empty()) {
            const int s = q.size();
            int last;
            if (level % 2 == 0) last = -1;
            else last = 1'000'006;
            for (int i = 0; i < s; ++i) {
                auto current = q.front();
                q.pop();
                if (level % 2 == 0) {
                    if (current->val % 2 == 0) return false;
                    if (current->val <= last) return false;
                } else {
                    if (current->val % 2 == 1) return false;
                    if (current->val >= last) return false;
                }
                last = current->val;
                if (current->left) q.push(current->left);
                if (current->right) q.push(current->right);
            }
            ++level;
        }
        return true;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

## 1610. Maximum Number of Visible Points

滑动窗口。这里有2个技巧：
1. 使用复数及其方法处理几何问题。可以快速计算向量的夹角。
2. 把所有点 + 360度 遍历2次。以处理跨0问题。

还有一个需要注意的点是：当点和观察点重合时需要特殊处理。


```cpp
template <typename T>
ostream& operator <<(ostream& out, const vector<T>& a) {
  out << "["; bool first = true;
  for (auto& v : a) { out << (first ? "" : ", "); out << v; first = 0;} out << "]";
  return out;
}
class Solution {
    using Point = complex<double>;
public:
    int visiblePoints(vector<vector<int>>& points, int a, vector<int>& location) {
        double angle = a;
        const int n = points.size();
        Point me {static_cast<double>(location[0]), static_cast<double>(location[1])};
        vector<double> ps;
        ps.reserve(2 * points.size());
        int same = 0;
        for (const auto & v : points) {
            if (v == location) {
                ++same;
                continue;
            }
            Point x {static_cast<double>(v[0]), static_cast<double>(v[1])};
            ps.push_back(arg(x - me)*(180/M_PI));
        }
        const int s = ps.size();
        for (int i = 0; i < s; ++i) {
            ps.push_back(ps[i] + 360);
        }
        sort(ps.begin(), ps.end());
        // cout << ps << endl;
        const double error = 1e-8;
        int l = 0, r = 0;
        int ans = 0;
        for (; r < ps.size(); ++r) {
            if (ps[r] - ps[l] > angle + error) {
                ++l;
            }
            ans = max(ans, r - l + 1);
            // cout << r << " " << l << endl;
        }
        return min(ans, n) + same;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(N).


## 1611. Minimum One Bit Operations to Make Integers Zero

参考[群主的视频](https://www.youtube.com/watch?v=8MdutrMAwY4)写的代码。比赛时没做出来，赛后看lee215的discuss也是讲的比较简单和跳跃。还是群主的视频好，把你当傻逼一样讲，速度还慢。虽然时长挺长的，但对于这种比较难的题目还是十分有效的。

```cpp
class Solution {
    int largestBit (const int n) {
        int b = 1;
        while (b <= n) {
            b = (b << 1);
        }
        b = (b >> 1);
        return b;
    }
    int helper(const int n, const int b) {
        if (n == 0) return 1;
        // xxxx -> 1000
        if ((n & b) != 0) {
            // 1xxx -> 1000
            return minimumOneBitOperations(n ^ b);
        } else {
            // 0xxx -> 0100 -> 1100 -> 1000
            return helper(n, b >> 1) + 1 + minimumOneBitOperations(b >> 1);
        }
    }
public:
    int minimumOneBitOperations(int n) {
        if (n == 0) return 0;
        else if (n == 1) return 1;
        if (__builtin_popcount(n) == 1) {
            return (n << 1) - 1;
        } else {
            const int b = largestBit(n);
            return helper(b ^ n, b >> 1) + 1 + minimumOneBitOperations(b >> 1);
        }
        
    }
};
```

时间复杂度: O(log N),
空间复杂度: O(log N).