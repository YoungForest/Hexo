---
title: LeetCode biweekly contest 52
date: 2021-05-16 19:13:00
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 2217 / 10364 | YoungForest | 12 | 0:51:47 | 0:05:11 | 0:51:47 | 0:29:51 | null |

<!-- more -->

## 1859. Sorting the Sentence

字符串问题用`python`。虽然题目不难，就是分割字符串，按照指定内容排序，但实现起来还是比想象中复杂的。好在Python中有很多方便的API和数据结构可以灵活使用。

```python
class Solution:
    def sortSentence(self, s: str) -> str:
        words = s.split(' ')
        def f(word):
            return (int(word[-1:]), word[0:-1])
        tuples = list(map(f, words))
        tuples.sort()
        def f2(a, t):
            return a + ' ' + t[1] 
        return reduce(f2, tuples, '')[1:]
```

时间复杂度: O(s.length),
空间复杂度: O(s.length).

## 1860. Incremental Memory Leak

本来是想用等差数列求和+解方程，O(1)解决的。但事实上实现和解方程还是太复杂了。到最后也没做出来。做完第3题后，回过来算了一下暴力的时间复杂度: O(sqrt(2^32)) = 65536. 居然如此低，果然第二题还是不能想复杂了，直接暴力怼多好。

暴力模拟题目中描述的内存占用过程。

```cpp
class Solution {
public:
    vector<int> memLeak(int m1, int m2) {
        int t = 1;
        while (m1 >= t || m2 >= t) {
            if (m1 >= m2) {
                m1 -= t;
            } else {
                m2 -= t;
            }
            ++t;
        }
        return {t, m1, m2};
    }
};
```

时间复杂度: O(sqrt(memory1 + memory2)),
空间复杂度: O(1).

## 1861. Rotating the Box

了解了掉落的本质，会发现，只需要统计每个障碍物/地面左面到上个障碍物的石头有多少个即可。

```cpp
class Solution {
public:
    vector<vector<char>> rotateTheBox(vector<vector<char>>& box) {
        const int rows = box.size();
        const int cols = box[0].size();
        vector<vector<char>> ans(cols, vector<char>(rows, '.'));
        for (int i = 0; i < rows; ++i) {
            int stoneCnt = 0;
            for (int j = 0; j < cols; ++j) {
                if (box[i][j] == '#') {
                    ++stoneCnt;
                } else if (box[i][j] == '*') {
                    // fall down
                    ans[j][rows - 1 - i] = '*';
                    for (int k = 1; k <= stoneCnt; ++k) {
                        ans[j - k][rows - 1 - i] = '#';
                    }
                    stoneCnt = 0;
                }
            }
            for (int k = 1; k <= stoneCnt; ++k) {
                ans[cols - k][rows - 1 - i] = '#';
            }
        }
        return ans;
    }
};
```

时间复杂度: O(m * n),
空间复杂度: O(m * n).

## 1862. Sum of Floored Pairs

没啥好想法。首先尝试了暴力解，枚举所有的对：

```python
class Solution:
    def sumOfFlooredPairs(self, nums: List[int]) -> int:
        MOD = 10**9 + 7
        n = len(nums)
        ans = 0
        for i in range(n):
            for j in range(n):
                ans += nums[j] // nums[i]
        return ans % MOD
```

时间复杂度: O(N^2), TLE，
空间复杂度: O(1).

尝试使用二分查找优化，寻找每一个数的倍数范围。

```cpp
class Solution {
    const int MOD = 1e9 + 7;
public:
    int sumOfFlooredPairs(vector<int>& nums) {
        int ans = 0;
        sort(nums.begin(), nums.end());
        const int MAX = nums.back();
        const int n = nums.size();
        int last = 0;
        for (int i = 0; i < n; ++i) {
            if (i > 0 && nums[i] == nums[i-1]) {
                ans = (ans + last) % MOD;
                continue;
            }
            last = 0;
            for (int j = 1; nums[i] * j <= MAX; ++j) {
                auto l = lower_bound(nums.begin() + i, nums.end(), nums[i] * j);
                auto r = lower_bound(l, nums.end(), nums[i] * (j + 1));
                auto x = distance(l, r);
                last = (last + x * j) % MOD;
            }
            ans = (ans + last) % MOD;
        }
        return ans;
    }
};
```

时间复杂度: O(N log N log N), 虽然有2个循环嵌套，但第二个其实是个调和级数。不过仍然TLE了。
空间复杂度: O(1).

还是看零神的题解把：
[前缀和优化](https://leetcode-cn.com/problems/sum-of-floored-pairs/solution/xiang-xia-qu-zheng-shu-dui-he-by-leetcod-u3eg/)。
可以少一个log.