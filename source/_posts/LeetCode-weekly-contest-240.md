---
title: LeetCode weekly contest 240
date: 2021-05-09 17:18:34
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 272 / 11577 | YoungForest | 18 | 1:15:29 | 0:04:46 | 0:14:19 | 0:47:06 | 1:10:29  1 |

这周五一假期+大论文查重。心情被大论文折麽的十分焦虑，再坚持2周，挺过答辩就好了。
等过了答辩，让我干啥都行。

前几周因为国服自己的rating太高，不敢打了，怕掉分。转战了美服，现在把美服也打到2350了。rating也过高了。之后打算再次转战国服，因为最近新一年的招聘迫近，国服赞助商礼物比较丰厚。虽然去年只有几次排名足够靠前，拿到奖品，但好歹有个奖励，有比较小的期望。

## 1854. Maximum Population Year

签到题。暴力枚举每个可能的年份。

```cpp
class Solution {
public:
    int maximumPopulation(vector<vector<int>>& logs) {
        map<int, int> cnt;
        for (const auto& v : logs) {
            for (int i = v[0]; i < v[1]; ++i) {
                ++cnt[i];
            }
        }
        int maxValue = 0;
        int maxYear = -1;
        for (const auto& p : cnt) {
            if (p.second > maxValue) {
                maxYear = p.first;
                maxValue = p.second;
            }
        }
        return maxYear;
    }
};
```

时间复杂度: O(logs.length * MAX(death_i - birth_i)) = O(100 * 100),
空间复杂度: O(MAX(death_i - birth_i)).

## 1855. Maximum Distance Between a Pair of Values

```cpp
class Solution {
public:
    int maxDistance(vector<int>& nums1, vector<int>& nums2) {
        int ans = 0;
        for (int i = 0; i < nums1.size(); ++i) {
            auto it = upper_bound(nums2.begin() + i, nums2.end(), nums1[i], greater<>());
            ans = max(ans, static_cast<int>(distance(nums2.begin() + i, prev(it))));
        }
        return ans;
    }
};
```

时间复杂度: O(nums1.length * log nums2.length),
空间复杂度: O(1).

本题也可以用双指针做，i 指向nums1的位置，j 指向nums2的位置。
向右遍历 i，更新j。不变量是 j >= i && nums[j] < nums[i].
时间复杂度是 O(nums1.length + nums2.length).
代码如下：

```cpp
class Solution {
public:
    int maxDistance(vector<int>& nums1, vector<int>& nums2) {
        int ans = 0;
        for (int i = 0, j = 0; i < nums1.size(); ++i) {
            while (j < nums2.size() && (j < i || nums2[j] >= nums1[i])) ++j;
            ans = max(ans, j - 1 - i);
        }
        return ans;
    }
};
```

## 1856. Maximum Subarray Min-Product

类似BFS，从数值大的元素开始遍历，尝试合并左右区间。
具体实现需要 维护区间左右边界、最小值、区间和。可以采用类似并查集的思路。

```cpp
class Solution {
    using ll = long long;
    const ll MOD = 1e9 + 7;
    const int INF = 0x3f3f3f3f;
public:
    int maxSumMinProduct(vector<int>& nums) {
        const int n = nums.size();
        // iterate from max to min
        vector<ll> s(n, 0);
        vector<int> right(n, 0);
        vector<int> left(n, 0);
        vector<int> minV(n, INF);
        multimap<int, int, greater<>> index;
        for (int i = 0; i < n; ++i) {
            index.insert({nums[i], i});
            minV[i] = nums[i];
            left[i] = i;
            right[i] = i;
            s[i] = nums[i];
        }
        ll ans = 0;
        for (const auto& p : index) {
            const int i = p.second;
            const ll minValue = p.first;
            if (i > 0 && minV[i-1] >= minValue) {
                left[i] = left[i-1];
                s[i] += s[i-1];
            }
            if (i + 1 < n && minV[i+1] > minValue) {
                right[i] = right[i+1];
                s[i] += s[i+1];
            }
            minV[right[i]] = minValue;
            minV[left[i]] = minValue;
            right[left[i]] = right[i];
            left[right[i]] = left[i];
            s[left[i]] = s[i];
            s[right[i]] = s[i];
            ans = max(ans, s[i] * minValue);
        }
        return ans % MOD;
    }
};
```

时间复杂度: O(n),
空间复杂度: O(n).

赛后经残酷群友讨论，
类似的题目有：
[LC 84. Largest Rectangle in Histogram](https://leetcode-cn.com/problems/largest-rectangle-in-histogram/). 区别在于 84 是 最小值\*子数组长度。本题是 最小值\*子数组和。


## 1857. Largest Color Value in a Directed Graph

拓扑排序。同时 遍历到每一个节点时，更新能到它的路径中每种颜色最大的。

```python
class Solution:
    def largestPathValue(self, colors: str, edges: List[List[int]]) -> int:
        n = len(colors)
        m = len(edges)
        indegree = [0] * n
        graph = defaultdict(list)
        for e in edges:
            indegree[e[1]] += 1
            graph[e[0]].append(e[1])
            
        # topo sort
        def dfs(root):
            ans = [0] * 26
            ans[ord(colors[root]) - ord('a')] += 1
            for n in graph[root]:
                if n in path: return None
                x = dfs(n, path)
                if x is None: return None
                for i in range(26):
                    ans[i] += x[i]
            return ans
        ans = -1
        q = collections.deque()
        seen = 0
        cnt = [[0] * 26 for i in range (n)]
        for i in range(n):
            if indegree[i] == 0:
                cnt[i][ord(colors[i]) - ord('a')] += 1
                q.append(i)
                seen += 1
                ans = max(ans, max(cnt[i]))
                
        while q:
            front = q.popleft()
            for i in graph[front]:
                for x in range(26):
                    cnt[i][x] = max(cnt[i][x], cnt[front][x])
                indegree[i] -= 1
                if indegree[i] == 0:
                    q.append(i)
                    cnt[i][ord(colors[i]) - ord('a')] += 1
                    ans = max(ans, max(cnt[i]))
                    seen += 1
                
        if seen == n: return ans
        else: return -1
```

时间复杂度: O(n + m),
空间复杂度: O(n + m).