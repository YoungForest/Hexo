---
title: LeetCode weekly contest 192
date: 2020-06-07 22:36:35
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 374 / 13805 |	YoungForest | 18 | 	0:53:48 | 0:07:19 | 0:07:35 | 0:15:00 | 0:43:48 2 |

本周的题目不算难，3456手速场，最后1k人AK。
前3题自己手速还算快，最后一题花了比较长的时间，还因为实现问题TLE了2发。本来觉得自己做的还不错，后来看到排名才发现，大家都很强。还需继续努力呀。争取rating进入世界前500.

## 1470. Shuffle the Array

使用辅助数组，straight forward.

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<int> shuffle(vector<int>& nums, int n) {
        vector<int> ans(2 * n);
        for (int i = 0; i < n; ++i) {
            ans[i*2] = nums[i];
            ans[i*2 + 1] = nums[n + i];
        }
        return ans;
    }
};
```

## 1471. The k Strongest Values in an Array

把stronger作为排序函数，对整个arr进行排序即可。

时间复杂度: O(N log N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    vector<int> getStrongest(vector<int>& arr, int k) {
        sort(arr.begin(), arr.end());
        const int n = arr.size();
        int m = arr[((n - 1) / 2)];
        sort(arr.begin(), arr.end(), [&](const auto& a, const auto& b) -> bool {
            if (abs(a - m) == abs(b - m)) {
                return a > b;
            } else {
                return abs(a - m) > abs(b - m);
            }
        });
        arr.erase(arr.begin() + k, arr.end());
        return arr;
    }
};
```

## 1472. Design Browser History

模拟整个过程。用一个数组存history，2个下标表示当前位置和最新的位置。

时间复杂度: O(1),
空间复杂度: O(N).

```cpp
class BrowserHistory {
    vector<string> history;
    int index;
    int last;
public:
    BrowserHistory(string homepage) {
        history.resize(5000);
        index = 0;
        last = 0;
        history[0] = move(homepage);
    }
    
    void visit(string url) {
        ++index;
        history[index] = url;
        last = index;
    }
    
    string back(int steps) {
        if (index >= steps) {
            index = index - steps;
        } else {
            index = 0;
        }
        return history[index];
    }
    
    string forward(int steps) {
        if (index + steps <= last) {
            index = index + steps;
        } else {
            index = last;
        }
        return history[index];
    }
};

/**
 * Your BrowserHistory object will be instantiated and called as such:
 * BrowserHistory* obj = new BrowserHistory(homepage);
 * obj->visit(url);
 * string param_2 = obj->back(steps);
 * string param_3 = obj->forward(steps);
 */
```

## 1473. Paint House III

DP.
dp[i][t][lastColor]: paint [1:] 的房子，把他们分成t个group，而且前一个颜色是lastColor（避免同颜色，合并group）所需的最小的cost.

状态转移方程: dp[i][t][lastColor] = min(paint cost [i:j) use color + dp[j][t-1][color]) for j in range(i,m+1) for color in range(1,n+1). 
需要注意一些剪枝和paint函数的有效实现，因为此TLE2发。

时间复杂度: O(m * target * n * m * n),
空间复杂度: O(m * target * n).

```python
class Solution:
    def minCost(self, houses: List[int], cost: List[List[int]], m: int, n: int, target: int) -> int:
        @lru_cache(None)
        def paint(i, j, color):
            if i == j:
                return 0
            else:
                if houses[i] == color:
                    return paint(i+1, j, color)
                elif houses[i] == 0:
                    return paint(i+1, j, color) + cost[i][color-1]
                else:
                    return float('inf')
            
        @lru_cache(None)
        def dp(i: int, t: int, lastColor: int) -> int:
            if t == 1:
                ans = float('inf')
                for color in range(1, n + 1):
                    if color == lastColor: continue
                    pre = paint(i, m, color)
                    ans = min(ans, pre)
                return ans
            else:
                ans = float('inf')
                seenColors = 0
                for j in range(i + 1, m):
                    if houses[j-1] != 0:
                        if seenColors != 0 and seenColors != houses[j-1]:
                            return ans
                        seenColors = houses[j-1]
                    if seenColors == 0:
                        for color in range(1, n + 1):
                            if color == lastColor: continue
                            pre = paint(i, j, color)
                            if pre < ans:
                                ans = min(ans, pre + dp(j, t-1, color))
                    else:
                        color = seenColors
                        if color != lastColor: 
                            pre = paint(i, j, color)
                            if pre < ans:
                                ans = min(ans, pre + dp(j, t-1, color))
                return ans
        
        ans = dp(0, target, -1)
        return ans if ans < float('inf') else -1
```