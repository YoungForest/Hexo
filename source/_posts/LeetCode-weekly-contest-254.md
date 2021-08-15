---
title: LeetCode weekly contest 254
date: 2021-08-15 11:40:36
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (6) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 616 / 13755 | YoungForest | 18 | 1:28:25 | 0:03:14 | 0:08:43 | 0:37:17  🐞4 | 1:03:25  🐞1 |

一不小心，周赛博客又鸽了3周。虽然我一直在参加周赛，但赛后经常忘记总结和复盘。平日里对刷题也放松了练习。平时打卡不是让npy刷，就是抄之前的提交。毕竟自己做了1300+的题，经常出的题都是我做过的。
主要还是工作后生活丰富了许多，刷题和周赛的优先级降低不少。多场双周赛我都鸽了，快活的诱惑太大了。

## 1967. Number of Strings That Appear as Substrings in Word

签到题。字符串问题用`Python` So easy。可惜我Q3没有坚持用`Python`，否则这周免打卡也是极有可能的。距500名差10min。

```python
class Solution:
    def numOfStrings(self, patterns: List[str], word: str) -> int:
        ans = 0
        for s in patterns:
            if s in word:
                ans += 1
        return ans
```

时间复杂度: O(sum(patterns[i].length * word.length)),
空间复杂度: O(1).

## 1968. Array With Elements Not Equal to Average of Neighbors

贪心。这道题答案并不唯一，但我看到大多数人的思路和我一样。
即 大 小 间隔插，保证2侧的数都大于/小于中间的数。自然可以保证平均数也大于/小于中间的数。

```cpp
class Solution {
public:
    vector<int> rearrangeArray(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        const int n = nums.size();
        int l = 0, r = n - 1;
        vector<int> ans(n);
        for (int i = 0; l <= r; i += 2) {
            ans[i] = nums[l++];
            if (l <= r)
                ans[i+1] = nums[r--];
        }
        return ans;
    }
};
```

时间复杂度: O(n log n),
空间复杂度: O(n).

## 1969. Minimum Non-Zero Product of the Array Elements

贪心，尽量分成大的数和小的数, 即 1 * (2^p - 2) * 1 * (2^p - 2) * ... * (2^p - 1). 
前面共`(2^p - 2) / 2`组数。

证明见[link](https://leetcode-cn.com/problems/minimum-non-zero-product-of-the-array-elements/solution/tan-xin-ji-qi-shu-xue-zheng-ming-by-endl-uumv/)

WA 3 + Runtime Error 1 发。

WA 1: 计算`2^p`不应加MOD，应直接计算。
WA 2: 不加MOD的pow写错了，因为直接复制的加MOD函数，因此调用的是原函数，忘记更新成新函数。
Runtime Error: 乘法越界。超过long long, 出现在base过大的情况下。（事实上可以先将base取模克服这种情况，无奈比赛时我心态已崩。直接转了python，没有细追究原因和解决方案。
WA 3: 无奈转成Python, 但是因为又是复制原来的代码再改，在整除的地方有个地方忘改了又WA一发。而且python自带 带模的快速幂，其他语言都需要自欺实现。

教训：比赛时复制粘贴再改代码要小心，可能疏漏一些地方没改。如果方便的话，不如重写一边。

```python
class Solution:
    def minNonZeroProduct(self, p: int) -> int:
        MOD = 10**9 + 7;
        x = (2**p)
        return ((x - 1) * pow(x - 2, ((x - 2) // 2), MOD)) % MOD
```

## 1970. Last Day Where You Can Still Cross

并查集。Penetration，Princeton CS226讲Union-Find的练习题。
不同的是，如果正向填水的话，unite的操作要向8个方向尝试。
当然也可以反向扣水，这时连陆地是4个方向。
注意需要采用dummy node连接边缘的层。

另外一种常见的做法是，BFS + Binary search，有些暴力。虽然也能过，但时间复杂度会差很多。
O(log(rows * cols) * rows * cols).

Runtime Error 1发。

居然把行列坐标转换成一维坐标写错了，导致数组越界，debug了好久。
理应是`r*col+c`, 写成了`r*row+c`

```cpp
class Solution {
    class UF {
    public:
        vector<int> fa;
        vector<int> sz;
        int n;
        int comp_cnt;

    public:
        UF(int _n): n(_n), comp_cnt(_n), fa(_n), sz(_n, 1) {
            iota(fa.begin(), fa.end(), 0);
        }

        int findset(int x) {
            return fa[x] == x ? x : fa[x] = findset(fa[x]);
        }

        void unite(int x, int y) {
            x = findset(x);
            y = findset(y);
            if (x != y) {
                if (sz[x] < sz[y]) {
                    swap(x, y);
                }
                fa[y] = x;
                sz[x] += sz[y];
                --comp_cnt;
            }
        }

        bool connected(int x, int y) {
            x = findset(x);
            y = findset(y);
            return x == y;
        }
    };
public:
    int latestDayToCross(const int row, const int col, vector<vector<int>>& cells) {
        vector<vector<int>> nums(row, vector<int>(col, 0));
        UF uf(row * col + 2);
        vector<vector<int>> direcionts = {
            {0, 1}, 
            {1, 0},
            {-1, 0},
            {0, -1},
            {1, 1},
            {1, -1},
            {-1, 1},
            {-1, -1}
        };
        const int L = row * col;
        const int R = row * col + 1;
        for (int i = 0; i < cells.size(); ++i) {
            const int r = cells[i][0] - 1;
            const int c = cells[i][1] - 1;
            // cout << r << ", " << c << endl;
            nums[r][c] = 1;
            // cout << r << ", " << c << endl;
            if (c == 0) {
                uf.unite(r * col + c, L);
            }
            // cout << r << ", " << c << endl;
            if (c == col - 1) {
                uf.unite(r * col + c, R);
            }
            // cout << r << ", " << c << endl;
            
            for (const auto& d : direcionts) {
                const int dr = d[0];
                const int dc = d[1];
                const int nr = dr + r;
                const int nc = dc + c;
                if (nr >= 0 && nr < row && nc >= 0 && nc < col) {
                    // cout << "xx: " << nr << ", " << nc << endl;
                    if (nums[nr][nc] == 1) {
                        uf.unite(r * col + c, nr * col + nc);
                    }
                }
            }
            if (uf.connected(L, R)) return i;
        }
        return -1;
    }
};
```

时间复杂度: O(rows * cols),
空间复杂度: O(rows * cols).