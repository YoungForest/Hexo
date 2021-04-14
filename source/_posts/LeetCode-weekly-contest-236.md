---
title: LeetCode weekly contest 236
date: 2021-04-11 16:00:09
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 1513 / 12115 | YoungForest | 12 | 0:45:18 | 0:02:57 | 0:08:59 | 0:40:18  1 | null |

## 1822. Sign of the Product of an Array

签到题。多少负数，是否有0。

```python
class Solution:
    def arraySign(self, nums: List[int]) -> int:
        x = 1
        for i in nums:
            x *= i
        if x > 0:
            return 1
        elif x == 0:
            return 0
        else:
            return -1
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1823. Find the Winner of the Circular Game

经典的约瑟夫环问题。随便Google了一个: [约瑟夫环——公式法](https://blog.csdn.net/u011500062/article/details/72855826)。

```cpp
class Solution {
    int cir(int n,int m)
    {
        int p=0;
        for(int i=2;i<=n;i++)
        {
            p=(p+m)%i;
        }
        return p+1;
    }
public:
    int findTheWinner(int n, int k) {
        return cir(n, k);
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1824. Minimum Sideway Jumps

动态规划。

dp[i][j] 表示从i的位置，第j个lane 到末尾需要的最小side jumps.
需要注意的是 本题`N <= 5 * 10^5`，Python TOP-BOTTOM的DP会爆栈。
因此比赛时Runtime Error一次，加了
`sys.setrecursionlimit(110000)`仍然不行，遂改成了Bottom-Up 的DP。

```python
class Solution:
    def minSideJumps(self, obstacles: List[int]) -> int:
        n = len(obstacles) - 1
        dp = [[float('inf')] * 4 for i in range(n + 1)]
        dp[n][1] = dp[n][2] = dp[n][3] = 0
        for i in range(n - 1, -1, -1):
            for j in (1, 2, 3):
                if obstacles[i+1] != j:
                    dp[i][j] = min(dp[i][j], dp[i+1][j])
                for nj in (1, 2, 3):
                    if j == nj: continue
                    if obstacles[i] != nj and obstacles[i+1] != nj:
                        dp[i][j] = min(dp[i][j], dp[i+1][nj] + 1)
        return dp[0][2]
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1825. Finding MK Average

