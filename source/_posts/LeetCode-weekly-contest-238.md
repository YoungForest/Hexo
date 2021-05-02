---
title: LeetCode weekly contest 238
date: 2021-04-25 17:58:13
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 383 / 11635 | YoungForest | 18 | 1:53:50 | 0:01:05 | 0:13:02 |  0:20:59 | 1:28:50 5 |

<!-- more -->

## 1837. Sum of Digits in Base K

签到题。10进制转6进制。

```python
class Solution:
    def sumBase(self, n: int, k: int) -> int:
        ans = 0
        while n > 0:
            ans += n % k
            n //= k
        return ans
```

时间复杂度: O(log_k n),
空间复杂度: O(1).

## 1838. Frequency of the Most Frequent Element

本周周赛Q2 Q3都是滑动窗口题。事实上，从零宝大数据来看，Q2难度还是比Q3大的。

首先想出暴力解法，尝试每个元素，试图把比它小的元素增至它，看最多有多少个。
时间复杂度: O(N ^ 2), 估计会TLE。
Q2 通常情况下还是可以暴力解的，虽然本题不可以。

在暴力解的基础上，尝试优化。观察到，“试图把比它小的元素增至它”这个操作或许可以在O(1)的情况下完成，而不需要暴力尝试每个比它小的元素。因为那些元素已经被升至上一个尝试元素了。

先排序。然后，从小到大尝试把所有值都增至`nums[r]`。
窗口`[l:r]`维护这些被增至目标值`nums[r]`的元素。
当`r`右移时，把窗口里的元素都从上个值更新到`nums[r]`。
如果用了过多的增操作，则增加`l`，释放增操作。
取窗口最宽值作为答案。

```python
class Solution:
    def maxFrequency(self, nums: List[int], k: int) -> int:
        # brute force: N ^ 2
        # for each element, try to make it most frequency
        # sliding window
        nums.sort()
        ans = 0
        l = 0
        for r in range(len(nums)):
            if r > 0:
                # make all increment to nums[r]
                k -= (nums[r] - nums[r-1]) * (r - l)
            while k < 0:
                k += nums[r] - nums[l]
                l += 1
            ans = max(r - l + 1, ans)
            
        return ans
```

时间复杂度: O(n log n + n),
空间复杂度: O(1).

## 1839. Longest Substring Of All Vowels in Order

相比上题，本题更是明显的滑动窗口题。
窗口`[l:r]`的不变量是字串递增。

```python
class Solution:
    def longestBeautifulSubstring(self, word: str) -> int:
        # brute force: N^3, enumerate all substring * check each substring
        # sliding window: N
        # at least once, incresing
        l = 0
        r = 0
        n = len(word)
        cnt = [0] * 26
        def check():
            for i in 'aeiou':
                if cnt[ord(i) - ord('a')] <= 0:
                    return False
            return True
        ans = 0
        while r < n:
            cnt[ord(word[r]) - ord('a')] += 1
            if r > 0 and word[r] < word[r-1]:
                while l < r:
                    cnt[ord(word[l]) - ord('a')] -= 1
                    l += 1
            if check():
                ans = max(ans, r - l + 1)
            r += 1
        return ans
```

时间复杂度: O(word.length),
空间复杂度: O(1).

## 1840. Maximum Building Height

还是挺难的一道Hard题。
相邻差值为1. 一开始想到用BFS，从高度限制小的开始遍历，更新周围的高度。也算是经典算法。
然后TLE后，才注意到`n <= 10^9`这个限制。O(N)的算法也肯定超时。
注意`restrictions.length <= 10^5`这一限制，大概率是要从这里下手的。
因此，BFS时只更新被限制的块，块中间再用二分搜索找最高点（其实可以用O(1)的数学解法的，比赛时没好想法就二分暴力了）。

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
public:
    int maxBuilding(int n, vector<vector<int>>& restrictions) {
        map<int, int> rtxMap;
        unordered_map<int, bool> seen;
        seen.reserve(restrictions.size() + 2);
        rtxMap[0] = 0;
        rtxMap[n-1] = INF;
        seen[0] = false;
        seen[n-1] = false;
        // bfs: O(N), TLE
        using pii = pair<int, int>;
        priority_queue<pii, vector<pii>, greater<>> pq;
        pq.push({0, 0});
        for (const auto& v : restrictions) {
            pq.push({v[1], v[0] - 1});
            rtxMap[v[0] - 1] = v[1];
            seen[v[0] - 1] = false;
        }
        int ans = 0;
        while (!pq.empty()) {
            auto [height, idx] = pq.top();
            // cout << height << ", " << idx << endl;
            pq.pop();
            if (seen[idx]) continue;
            ans = max(ans, height);
            seen[idx] = true;
            for (const int j : {-1, 1}) {
                const int next = idx + j;
                if (next >= n || next < 0 || seen[next]) continue;
                if (j == 1) {
                    auto it = rtxMap.lower_bound(next);
                    if (it != rtxMap.end()) {
                        const int x = it->first;
                        it->second = min(it->second, height + x - idx);
                        pq.push({it->second, x});
                    }
                } else {
                    auto it = rtxMap.lower_bound(idx);
                    // 2 5
                    // next = 4
                    if (it != rtxMap.begin()) {
                        --it;
                        const int x = it->first;
                        it->second = min(it->second, height + idx - x);
                        pq.push({it->second, x});
                    }
                }
            }
        }
        
        for (auto it = rtxMap.begin(); next(it) != rtxMap.end(); ++it) {
            const int leftIdx = it->first, leftHeight = it->second;
            const int rightIdx = next(it)->first, rightHeight = next(it)->second;
            if (leftIdx + 1 == rightIdx) continue;
            // cout << leftIdx << ", " << leftHeight << ", " << rightIdx << ", " << rightHeight << endl;
            int lo = min(leftHeight, rightHeight), hi = min(leftHeight + rightIdx - leftIdx, rightHeight + rightIdx - leftIdx);
            while (lo < hi) {
                const int mid = lo + (hi - lo) / 2;
                bool deter = false;
                if (mid - leftHeight < rightIdx - leftIdx and mid - rightHeight < rightIdx - leftIdx and mid - leftHeight + mid - rightHeight - 1 < rightIdx - leftIdx) deter = true;
                if (deter) {
                    lo = mid + 1;
                } else {
                    hi = mid;
                }
                // t, t, t, f, f
            }
            ans = max(ans, lo - 1);
        }
        return ans;
    }
};
```

`m = restrictions.length`
时间复杂度: O(m log m),
空间复杂度: O(m).

[零神题解](https://leetcode-cn.com/problems/maximum-building-height/solution/zui-gao-jian-zhu-gao-du-by-leetcode-solu-axbb/910208)里有2次扫描的算法。虽然时间复杂度是一样的，但实现比较简单，常数上会更好些。