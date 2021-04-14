---
title: 力扣2021春季赛 - 战队赛
date: 2021-04-11 21:53:03
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (2) |	Q2 (4) |	Q3 (6) |	Q4 (8)| Q5 (9) | Q6(12) |
|--|--|--|--|--|--|--|--|--|--|
| 228 / 781 | 佛系刷题 | 6/41 | 1:00:00 | 0:42:42 | 1:00:00 | null | null | null | null |

[比赛链接](https://leetcode-cn.com/contest/season/2021-spring/ranking/team/)

之前LC-CN举办的春季赛和秋季赛我都没参加，因为实验室之前每周六下午开组会，时间完美冲突。现在老板改为平时开小组会，一月开一次大组会，终于有机会参加2021年的春季赛了。
周一清明节参加了个人赛，[总结博客于此](https://youngforest.github.io/2021/04/05/LCCUP-21-Spring-Solo/).
周六和 **佛系刷题群** 的 老赖 还有 George 组队一起佛系出征，最后的结果果然很佛系，2题结束。我第一题，George第二题（还是我提供思路，帮忙 review + debug). 不得不说，跟2个人组队打比赛还不如我一个人效果好。怪不得ACM比赛的队伍都要磨合好久。


## LCP 33. 蓄水

签到题。虽然是Easy，不过作为竞赛第一题，本题的难度还是相当大的。

观察 + 暴力。

操作共分为 升级 和 蓄水 2种。显然 **蓄水**操作应排在**升级**之后.
一个朴素的暴力方法是，我们先枚举所有可能的蓄水次数，升级次数就因之而定，然后在其中选最小的。枚举蓄水次数也存在剪枝的过程。先试小的，如果已经比全局最小总次数大了，就直接结束了。

```cpp
class Solution {
public:
    int storeWater(vector<int>& bucket, vector<int>& vat) {
        // time: max(buckets[i]) * buckets.size() = 10^4 * 100
        int ans = numeric_limits<int>::max();
        const int n = bucket.size();
        if (accumulate(vat.begin(), vat.end(), 0) == 0) return 0;
        auto check = [&](const int x) -> int {
            int ans = 0;
            for (int i = 0; i < n; ++i) {
                const int need = vat[i] - bucket[i] * x;
                if (need > 0) ans += (need + x - 1) / x;
            }
            return ans;
        };
        for (int x = 1; x <= 1e4; ++x) { // 蓄水次数
            if (x >= ans) break;
            ans = min(ans, x + check(x));
        }
        return ans;
    }
};
```

时间复杂度: O(max(vat[i]) * buckets.length) = O(10^4 * 100),
空间复杂度: O(1).

## LCP 34. 二叉树染色

DFS。需要注意的是，因为蓝色**连接体**节点数目为k，我们需要枚举把当前剩下的蓝色点数分配给左子树和右子树的方式。另外，观察到k的数目其实不大，只有10。更加印证了我的猜想。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def maxValue(self, root: TreeNode, k: int) -> int:
        @cache
        def dfs(root: TreeNode, remain: int) -> int:
            if not root: return 0
            ans = dfs(root.left, k) + dfs(root.right, k)
            for i in range(0, remain):
                ans = max(ans, dfs(root.left, i) + dfs(root.right, remain - 1 - i) + root.val)
            return ans

        return dfs(root, k)
```

时间复杂度: O(结点数 * k)，
空间负载的: O(结点数 * k).

## LCP 35. 电动车游城市

## LCP 36. 最多牌组数

## LCP 37. 最小矩形面积

## LCP 38. 守卫城堡