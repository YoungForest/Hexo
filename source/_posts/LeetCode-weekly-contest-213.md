---
title: LeetCode weekly contest 213
date: 2020-11-01 11:16:44
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 139 / 10630 | YoungForest | 18 | 0:39:13 | 0:06:26 | 0:14:56 |   0:22:59 |  0:39:13 |

周赛已经连续4周表现良好了，开心。群排名也稳定在了15名，终究还是无法进入前10.不过我已经满意了。

## 5554. Check Array Formation Through Concatenation

签到题。需要注意`arr`和`pieces`都是 distinct （互不相同）的。
所以，我们只需要记录pieces的开头元素对应的数组就可以了，直接找，然后匹配。

```cpp
class Solution {
public:
    bool canFormArray(vector<int>& arr, vector<vector<int>>& pieces) {
        unordered_map<int, int> num2indexInPieces;
        for (int i = 0; i < pieces.size(); ++i) {
            const auto& v = pieces[i];
            num2indexInPieces[v[0]] = i;
        }
        for (int i = 0; i < arr.size(); ) {
            auto it = num2indexInPieces.find(arr[i]);
            if (it == num2indexInPieces.end()) return false;
            const int j = it->second;
            const int oldi = i;
            for (; i < arr.size() && i - oldi < pieces[j].size(); ++i) {
                if (arr[i] != pieces[j][i - oldi]) return false;
            }
        }
        return true;
    }
};
```

时间复杂度: O(arr.size() + pieces.size()),
空间复杂度: O(pieces.size()).

## 5555. Count Sorted Vowel Strings

DP. 定义`dp(n, i)`为长度为n，开头是第i大的字母所对应的字符串的数量。
`dp(n, i) = sum(dp(n-1, j) for j in range(i, 0, -1))`.

```python
class Solution:
    def countVowelStrings(self, n: int) -> int:
        @lru_cache(None)
        def dp(n, i):
            if n == 1:
                return i
            else:
                return sum(dp(n-1, j) for j in range(i, 0, -1))
        return dp(n, 5)
```

时间复杂度: O(n * 5 * 5),
空间复杂度: O(n * 5).

当然，评论区里还有[零神的O(1)解法](https://leetcode-cn.com/problems/count-sorted-vowel-strings/solution/tong-ji-zi-dian-xu-yuan-yin-zi-fu-chuan-de-shu-mu-/). tql，反正我是没看懂。


## 5556. Furthest Building You Can Reach

贪心。尽量把梯子用到高度差最大的地方。
这里需要用`priority_queue`来维护之前最大的高度差。

```cpp
class Solution {
public:
    int furthestBuilding(vector<int>& heights, int bricks, int ladders) {
        std::priority_queue<int, std::vector<int>, std::greater<int> > q;
        int lasth = heights[0];
        int i = 1;
        for (; i < heights.size(); ++i) {
            if (heights[i] > lasth) {
                const int diff = heights[i] - lasth;
                q.push(diff);
                if (q.size() > ladders) {
                    int t = q.top();
                    q.pop();
                    bricks -= t;
                    if (bricks < 0) return i - 1;
                }
            }
            lasth = heights[i];
        }
        return heights.size() - 1;
    }
};
```

## 5600. Kth Smallest Instructions

上上周hulu面试刚问了一个找二叉搜索数中第k大的数的算法，而这又是我最早在《算法第4版》中看到的一个实现。在平时解题时，也经常用到需要这种带rank的数据结构。

这道题和求rank的思路十分相似，都是维护一个子树的size，然后根据“左子树（向右走）”的size和rank的相对大小，选择走的决策。不同的是，本题中子树的size是总共可以走的路径的方案数，也就是一个组合数。

本题中用到了零神用杨辉三角求组合数的方法，相比阶乘算法，可以支持取模。也防止了溢出。

```cpp
class Solution {
    using ll = unsigned long long;
    const ll MOD = 1e18 + 7;
    vector<vector<ll>> c;
    ll C(ll m, ll n) {
        return c[m][n];
    }
public:
    string kthSmallestPath(vector<int>& destination, int k) {
        const int rows = destination[0];
        const int cols = destination[1];
        const  int n = rows + cols + 1;
        c.resize(n + 1, vector<ll>(n + 1));
        c[0][0] = 1;
        for (int i = 1; i <= n; ++i) {
            c[i][0] = 1;
            for (int j = 1; j <= i; ++j) {
                c[i][j] = c[i - 1][j - 1] + c[i - 1][j];
                if (c[i][j] >= MOD) {
                    c[i][j] -= MOD;
                }
            }
        }
        string ans;
        using pii = pair<int, int>;
        pii start = {0, 0};
        int r = rows, c = cols;
        while (ans.size() < rows + cols) {
            if (r == 0) {
                ans.push_back('H');
                --c;
            } else if (c == 0) {
                ans.push_back('V');
                --r;
            } else {
                const ll right = C(r + c - 1, c - 1);
                if (right >= k) {
                    ans.push_back('H');
                    --c;
                } else {
                    ans.push_back('V');
                    --r;
                    k -= right;
                }
            }
        }
        return ans;
    }
};
```

时间复杂度：O((rows + cols) * cols),
空间复杂度: O((rows + cols) * cols).