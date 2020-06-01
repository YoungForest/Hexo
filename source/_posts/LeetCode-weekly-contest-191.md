---
title: LeetCode weekly contest 191
date: 2020-05-31 17:40:09
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 765 / 13283 |	YoungForest | 12 | 0:27:19 | 0:02:16 | 0:12:53 | 0:27:19 |  null |

本周最后一题着实比较难，涉及概率和组合数学等知识。恰好触及到我的知识盲区，所以没有做出来。对于数学好的同学应该会好很多。

## 1464. Maximum Product of Two Elements in an Array

签到题。由于`nums.size()`比较小，所以暴力即可。

时间复杂度: O(N^2),
空间复杂度: O(1).

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
public:
    int maxProduct(vector<int>& nums) {
        int ans = -INF;
        for (int i = 0; i < nums.size(); ++i) {
            for (int j = i+1; j < nums.size(); ++j) {
                ans = max(ans, (nums[i] - 1) * (nums[j] - 1));
            }
        }
        return ans;
    }
};
```

## 1465. Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts

分别找出最大的horizontal和vertical间隔，相乘即可。需要注意，把边界也当作cut处理。
数据类型最好使用`long long`，因为会有`int32`的溢出问题。

时间复杂度: O(horizontalCuts.size() * log + verticalCuts.size() * log),
空间复杂度: O(1).

```cpp
class Solution {
    using ll = long long;
    const ll MOD = 1e9 + 7;
public:
    int maxArea(int h, int w, vector<int>& horizontalCuts, vector<int>& verticalCuts) {
        horizontalCuts.insert(horizontalCuts.begin(), 0);
        horizontalCuts.push_back(h);
        verticalCuts.insert(verticalCuts.begin(), 0);
        verticalCuts.push_back(w);
        sort (begin(horizontalCuts), end(horizontalCuts));
        sort (begin(verticalCuts), end(verticalCuts));
        int maxH = 0, maxW = 0;
        for (int i = 1; i < horizontalCuts.size(); ++i) {
            maxH = max(maxH, horizontalCuts[i] - horizontalCuts[i-1]);
        }
        for (int j = 1; j < verticalCuts.size(); ++j) {
            maxW = max(maxW, verticalCuts[j] - verticalCuts[j-1]);
        }
        ll mxh = maxH;
        ll mxw = maxW;
        return (mxh * mxw) % MOD;
    }
};
```

## 1466. Reorder Routes to Make All Paths Lead to the City Zero

由于无向图本身是一棵树，每个节点通向0的路径有且仅有一条。所以用dfs从0搜索一遍，把反向的边调整过来即可。

时间复杂度: O(N),
空间复杂度: O(N) -> 通过记录父节点，可以不用seen，将空间降到O(1).

```cpp
class Solution {
public:
    int minReorder(int n, vector<vector<int>>& connections) {
        int ans = 0;
        unordered_map<int, vector<int>> in, out;
        vector<bool> seen(n, false);
        for (const auto& v : connections) {
            in[v[1]].push_back(v[0]);
            out[v[0]].push_back(v[1]);
        }
        function<void(int)> dfs = [&](int root) -> void {
            if (seen[root]) return;
            seen[root] = true;
            for (int neighbor : in[root]) {
                dfs(neighbor);
            }
            for (int neighbor : out[root]) {
                if (!seen[neighbor]) {
                    ++ans;
                    dfs(neighbor);
                }
            }
        };
        dfs(0);
        return ans;
    }
};
```

## 1467. Probability of a Two Boxes Having The Same Number of Distinct Balls

概率问题。由于数据范围比较小，可以用回溯法枚举每个颜色的球在2个盒子里的数目。终点时，需要判断合法的permutation的数目，即 2个盒子中的球的数目相等。然后，如果颜色数量相等，也需要记录。
这里需要些组合数学的知识，x个球，然后每种颜色的数目为A_i.
则permutation的数目为: 

$$ x! / \sum{A_i} $$

时间复杂度: O(balls[i]^balls.size() * balls.size() * sum_balls) = O(6 ^ 8 * 8 * 48) = O(644972544).
空间复杂度: O(balls.size()).

```python
class Solution:
    def getProbability(self, balls: List[int]) -> float:
        self.all = 0
        self.good = 0
        self.firstHalf = defaultdict(int)
        self.secondHalf = defaultdict(int)
        def validKeys(m):
            ans = 0
            for i in m:
                if m[i] > 0: ans += 1
            return ans
        def permutationUnder(count):
            under = 1
            for k in count.values():
                under *= math.factorial(k)
            return under
        def dfs(i):
            if i == len(balls):
                s1 = sum(self.firstHalf.values())
                s2 = sum(self.secondHalf.values())
                if s1 != s2: return
                add = math.factorial(s1) * math.factorial(s2) / (permutationUnder(self.firstHalf) * permutationUnder(self.secondHalf))
                self.all += add
                if validKeys(self.firstHalf) == validKeys(self.secondHalf): self.good += add
            else:
                for x in range(0, balls[i] + 1):
                    self.firstHalf[i] = x
                    self.secondHalf[i] = balls[i] - x
                    dfs(i+1)
        dfs(0)
        return self.good / self.all
```

