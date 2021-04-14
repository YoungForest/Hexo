---
title: 力扣2021春季赛 - 个人赛
date: 2021-04-05 19:27:19
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (2) |	Q2 (4) |	Q3 (6) |	Q4 (8)| Q5 (10)
|--|--|--|--|--|--|--|--|--|
| 171 / 2750 | YoungForest | 12 | 0:56:51 | 0:06:21 | 0:49:14 | 0:56:55 | null | null |

[比赛链接](https://leetcode-cn.com/contest/season/2021-spring/ranking/solo/)

## LCP 28. 采购方案

签到题。可以看到总共2750名选手签到。

二分搜索。

```cpp
class Solution {
    const int MOD = 1e9 + 7;
public:
    int purchasePlans(vector<int>& nums, int target) {
        sort(nums.begin(), nums.end());
        // 1 2 4 5 6/
        // target = 5
        // 2
        int ans = 0;
        for (int i = 0; i < nums.size(); ++i) {
            const int x = nums[i];
            auto it = upper_bound(nums.begin(), nums.begin() + i, target - x);
            ans = (ans + distance(nums.begin(), it)) % MOD;
        }
        return ans;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(1).

## LCP 29. 乐团站位

一开始很简单想到模拟填数，时间复杂度为 O（N^2), 因为n 最大 `10^9`. 显然已经超时了，我们需要考虑更优的解法。

观察发现，数字填写的规律十分明显。我们其实只需要计算其离起点的位置即可。通过计算目标点距离四周的距离，我们可以得到外侧总共有多少层，再通过等差数列求和，可以快速计算出外侧有多少数。然后，问题简化为目标点一定再最外圈的情况。分4种情况（上边，右边，下边，左边）分别计算目标点与左上角的距离。

虽然想出这样O(1)的解法不难，但由于过程中设计数列求和，4边情况等细节，实现起来还是有些挑战，而且一不小心还挺容易出错的。我比赛过程中也是，自己写了覆盖所有情况的test case，解决了一些bug，才一次提交通过的。

```cpp
class Solution {
    using ll = long long;
public:
    int helper(int n, int x, int y) {
        // Sn=n*a1+n(n-1)d/2
        const ll left = y, right = n - 1 - y, up = x, down = n - 1 - x;
        const ll shell = min({left, right, up, down});
        const ll a1 = n - 1;
        const ll d = -2;
        ll shellAmount = 0;
        if (shell > 0) {
            shellAmount = 4 * (shell * a1 + shell * (shell - 1) * d / 2);
        }
        const ll startX = shell, startY = shell, len = n - 2 * shell;
        const ll start = (shellAmount) % 9;
        // cout << shell << " " << start << " " << startX << " " << startY << endl;
        if (shell == up) {
            return (y - startY + start) % 9;
        } else if (shell == right) {
            return (x - startX + start + len - 1) % 9;
        } else if (shell == down) {
            return (len - 1 - (y - startY) + start + 2 * (len - 1)) % 9;
        } else { // shell == left
            return (len - 1 - (x - startX) + start + 3 * (len - 1)) % 9;
        }
    }
    int orchestraLayout(int n, int x, int y) {
        return helper(n, x, y) + 1;
    }
};
```

时间复杂度: O(1),
空间复杂度: O(1).

## LCP 30. 魔塔游戏

贪心。
先遍历一遍判断和是否大于等于0，以决定最终的胜利与否。
当血量少于1时，把之前减血最多的怪物放到最后。
用一个优先队列维护怪物的减血量，方便快速找到最大的。

```cpp
class Solution {
    using ll = long long;
public:
    int magicTower(vector<int>& nums) {
        ll total = 0;
        for (int x : nums) {
            total += x;
        }
        if (total < 0) return -1;
        ll current = 1;
        priority_queue<int> pq;
        int ans = 0;
        for (int x : nums) {
            current += x;
            if (x < 0)
                pq.push(-x);
            if (current <= 0) {
                current += pq.top();
                pq.pop();
                ++ans;
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(N).

## LCP 31. 变换的迷宫

比赛时只想出了暴力的 DFS + DP 解法。
时间复杂度: O(times * rows * cols * 2 * rows * cols * 5) = 100 * 50 * 50 * 2 * 50 * 50 * 5 = 6,250,000,000. 果不其然，TLE了。
虽然如此，也在此给出自己TLE版本的代码。因为我认为这是一个针对类似路径问题不错的一个解法，可以针对大多数medium的题目。

```python
class Solution:
    def escapeMaze(self, maze: List[List[str]]) -> bool:
        maxT = len(maze)
        rows = len(maze[0])
        cols = len(maze[0][0])
        nextStep = [(1, 0), (0, 1), (-1, 0), (0, -1), (0, 0)]
        @lru_cache(None)
        def dfs(t, i, j, temp, forever):
            if t >= maxT: return False
            if i == rows - 1 and j == cols - 1: return True
            maxTry = rows - 1 - i + cols - 1 - j
            if maxTry > maxT - t - 1: return False
            for di, dj in nextStep:
                ni = i + di
                nj = j + dj
                if ni >= 0 and ni < rows and nj >= 0 and nj < cols and t + 1 < maxT:
                    if maze[t + 1][ni][nj] == '.':
                        if (dfs(t + 1, ni, nj, temp, forever)):
                            return True
                    else: # '#'
                        if forever == (ni, nj):
                            if (dfs(t + 1, ni, nj, temp, forever)):
                                return True
                        else:
                            if forever == (0, 0):
                                if (dfs(t + 1, ni, nj, temp, (ni, nj))):
                                    return True
                            if temp:
                                if (dfs(t + 1, ni, nj, False, forever)):
                                    return True
            return False
        
        ans = dfs(0, 0, 0, True, (0, 0))
        dfs.cache_clear()
        return ans;
```

赛后，还是要学习一下大佬们的解法。事实上，比赛中只有100名选手通过。

[这个题解](https://leetcode-cn.com/problems/Db3wC1/solution/ji-yi-hua-sou-suo-si-lu-xiang-jie-by-hal-mmnj/) 是我看了所有高赞（其实也都是个位数）回答发现最有说服力，也是最好的解法。也可以辅助[另外一个题解看](https://leetcode-cn.com/problems/Db3wC1/solution/dong-tai-gui-hua-he-xin-yao-dian-you-hua-gnas/), 思路类似。
问题的核心在于:
>如果将一个位置的陷阱 “永久” 消除，那么我们可以多次经过这一位置。但是，这等同于我们在这个位置上停留了一段时间。比如，行进的路径为 a→b→a→c→a，那么这等效于一直待在 a 不动。

因此，可以把时间复杂度中用于枚举永久消失术位置的因子去掉，也就少了`50*50`，缩减到了`5,000,000`.

## LCP 32. 批量处理任务

真正的难题，比赛时只有31人通过。题解都少了不少。
看了不少使用高级算法做的ACM大佬，我连代码都没看懂。
找到这个[贪心解法的题解](https://leetcode-cn.com/problems/t3fKg1/solution/c-tan-xin-by-zqy1018-03bd/)，分享给大家。