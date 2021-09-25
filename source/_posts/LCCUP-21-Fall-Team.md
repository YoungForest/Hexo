---
title: LCCUP 21 Fall Team
date: 2021-09-25 20:28:48
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (2) |	Q2 (4) |	Q3 (6) |	Q4 (7)| Q5 (8) | Q6(9) |
|--|--|--|--|--|--|--|--|--|--|
| 81 / 1363 | 爸爸去哪儿 | 19/37 | 	1:07:44 | 0:03:40 by 爸 | 0:21:39 by 爸 | 0:53:13 by 宝  | 1:02:44 🐞 1 by 爸 | null | null |

今年秋季赛只参加了团队赛，没有参加个人赛。春季赛和赖叔以及羡慕哥组队，效果不是很理想。秋季赛和宝宝二人组队，效果反而不错。尤其是宝宝不仅没有拖慢我的速度，还给团队做出了重要的贡献。没有她顺利地做出Q3，我们队排名绝对没有现在这么好看。
一个小时做了4题后，后两题只有5人AC。看了半天后并没有任何符合时间复杂度的思路。果断放弃了，后2个小时就节约下来干别的去了。

虽然我现在用[英文博客](https://youngforest.github.io/en/)写周赛总结了。但因为春季赛和秋季赛都是国区力扣的活动，只有中国人能参加和看到，因此考虑到受众，本次比赛总结还是用中文吧。

## [LCP 44. 开幕式焰火](https://leetcode-cn.com/problems/sZ59z6/)

签到题。DFS，用set记录不同color.

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
    int numColor(TreeNode* root) {
        set<int> colors;
        function<void(TreeNode*)> dfs = [&](TreeNode* root) -> void {
            if (root) {
                colors.insert(root->val);
                dfs(root->left);
                dfs(root->right);
            }
        };
        dfs(root);
        return colors.size();
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).
其中，`N`为节点数。

## [LCP 45. 自行车炫技赛场](https://leetcode-cn.com/problems/kplEvH/)

DFS. 因为需要关注高度，因此把高度也当作参数传入。
需要用seen/visit记录访问过的状态。
因为速度变化的机制`h1-h2-o2`，显然速度不可能超过`最大高度+1`，因此状态数也是有限的，大概是`n\*m\*最大高度 = 10^6`.

```python
class Solution:
    def bicycleYard(self, position: List[int], terrain: List[List[int]], obstacle: List[List[int]]) -> List[List[int]]:
        n = len(terrain)
        m = len(terrain[0])
        minSpeed = [[float('inf')] * m for _ in range(n)]
        direction = ((1, 0), (0, 1), (0, -1), (-1, 0))
        seen = set()
        def dfs(i, j, speed):
            if speed <= 0: return
            if (i, j, speed) in seen: return
            seen.add((i, j, speed))
            minSpeed[i][j] = min(minSpeed[i][j], speed)
            for di, dj in direction:
                ni = i + di
                nj = j + dj
                if ni < n and ni >= 0 and nj >= 0 and nj < m:
                    newSpeed = speed + terrain[i][j] - terrain[ni][nj] - obstacle[ni][nj]
                    if (ni, nj, newSpeed) not in seen:
                        dfs(ni, nj, newSpeed)
        
        dfs(position[0], position[1], 1)
        minSpeed[position[0]][position[1]] = float('inf')
        ans = []
        for i in range(n):
            for j in range(m):
                if minSpeed[i][j] == 1:
                    ans.append([i, j])
        return ans
```

时间复杂度: O(m * n * maxTerrain),
空间复杂度: O(m * n * maxTerrain).

## LCP 46. 志愿者调配

本题是宝宝独立想出解法并实现的。虽然实现之前我们有交流过解法，确定没问题她才开始实现的。

列方程。每天每个场馆用(系数,常数)表示。比如最后一天0场馆就是(1, 0), 其他就是(0, 人数).然后往前推，更新场馆人数。到第一天再解方程。

```python
class Solution:
    def volunteerDeployment(self, finalCnt: List[int], totalNum: int, edges: List[List[int]], plans: List[List[int]]) -> List[int]:
        neighbour = collections.defaultdict(list)
        for a,b in edges:
            neighbour[a].append(b)
            neighbour[b].append(a)
        coef = [[1,0]]
        for c in finalCnt:
            coef.append([0,c])
        for i in range(len(plans)-1, -1, -1):
            num, idx = plans[i]
            if num == 1:
                coef[idx] = [coef[idx][0]*2, coef[idx][1]*2]
            elif num == 2:
                for nei in neighbour[idx]:
                    coef[nei] = [coef[nei][0]-coef[idx][0], coef[nei][1]-coef[idx][1]]
            else:
                for nei in neighbour[idx]:
                    coef[nei] = [coef[nei][0]+coef[idx][0], coef[nei][1]+coef[idx][1]]
        divide = 0
        for a,b in coef:
            totalNum -= b
            divide += a
        x = totalNum//divide
        ans = []
        for a,b in coef:
            ans.append(a*x+b)
        return ans
```

时间复杂度: O(m * n * avg(edges)),
空间复杂度: O(edges + n).

## LCP 47. 入场安检

一看到最后答案很大，需要取模。就基本不可能枚举所有的情况了，大概率是用`DP`。
接下来就是像状态转移方程长什么样了。
此题挺像约瑟夫杀人问题的，关注的是使用 栈/队 数字下标的变化。

涉及到自顶向下的DP 和 大数取模运算，`Python`优势明显。
虽然用`@cache`很方便，但经常忘记`dp.cache_clear()`, 导致一次TLE罚时。
以后需要注意。

```python
class Solution:
    def securityCheck(self, capacities: List[int], k: int) -> int:
        MOD = 1000000007
        n = len(capacities)
        @cache
        def dp(i, k):
            # the current first capcities index, k is the number we want to pop first
            # print(i,k)
            if i == n - 1:
                ans = 0
                if k == 0: # queue
                    ans += 1
                if k == capacities[n-1] - 1:
                    ans += 1
                return ans
            else:
                ans = 0
                c = capacities[i]
                if k >= c - 1:
                    ans += dp(i+1, k - (c - 1)) # stack
                
                ans += dp(i+1, k) # queue
                return (ans) % MOD
        
        ans = dp(0, k)
        dp.cache_clear()
        return ans
```

时间复杂度: O(n * k),
空间复杂度: O(n * k).

## LCP 48. 无限棋局

## LCP 49. 环形闯关游戏