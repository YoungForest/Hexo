---
title: LeetCode weekly contest 241
date: 2021-05-16 18:42:19
tags:
- Competitive Programming
categories:
- LeetCode
---

本周周赛和双周赛都翻车了，开始残酷打卡之旅。

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 717 / 11572 | YoungForest | 12 | 	0:23:51 | 0:05:35 | 0:17:33 | 0:23:51 | null |

<!-- more -->

## 1863. Sum of All Subset XOR Totals

签到题。暴力回溯，枚举所有的子集。

```cpp
class Solution {
public:
    int subsetXORSum(vector<int>& nums) {
        int ans = 0;
        function<void(const int, const int)> backtracking = [&](const int i, const int current) -> void {
            if (i == nums.size()) {
                ans += current;
                return;
            } else {
                // use this
                backtracking(i + 1, current ^ nums[i]);
                // not use this
                backtracking(i + 1, current);
            }
        };
        backtracking(0, 0);
        return ans;
    }
};
```

时间复杂度: O(2^n),
空间复杂度: O(n).

## 1864. Minimum Number of Swaps to Make the Binary String Alternating

首先统计'0/1'的数目，看是否可以形成交替。
再尝试2种交替方式，1在前/0在前。
重点在于只需要关心不符合的数量即可，不需要考虑具体怎么交换。

```cpp
class Solution {
public:
    int minSwaps(string s) {
        int ans = s.size();
        vector<int> cnt(2, 0);
        for (char c : s) {
            ++cnt[c - '0'];
        }
        if (abs(cnt[0] - cnt[1]) > 1) return -1;
        for (char first : "01"s) {
            int current = 0;
            if (cnt.at(first - '0') + 1 == cnt.at('1' - first)) continue;
            for (int i = 0; i < s.size(); i += 2) {
                if (s[i] != first) {
                    ++current;
                }
            }
            ans = min(ans, current);
        }
        return ans;
    }
};
```

时间复杂度: O(s.length),
空间复杂度: O(1).

需要注意的是, 
```cpp
for (char first : "01"s)
```
一定不能写成。
```cpp
for (char first : "01")
```
因为前者是 字符串常量（string literal），后者是C语言里的静态字符串，会有`\n`结尾的。


## 1865. Finding Pairs With a Certain Sum

首先观察数据规模，发现`nums1.length`小，但`nums2.length`大。考虑对小的做遍历，大的`hash`优化。
使用一个反向hashtable记录`nums2` 值->index 的映射。

时间复杂度:
- 构造: O(nums2.length),
- add: O(1),
- count: O(nums1.length).
空间复杂度: O(nums2.length).


```cpp
class FindSumPairs {
    vector<int> nums1, nums2;
    unordered_map<int, unordered_set<int>> m;
public:
    FindSumPairs(vector<int>& _nums1, vector<int>& _nums2): nums1(move(_nums1)), nums2(move(_nums2)) {
        for (int i = 0; i < nums2.size(); ++i) {
            m[nums2[i]].insert(i);
        }
    }
    
    void add(int index, int val) {
        // O(1)
        m[nums2[index]].erase(index);
        nums2[index] += val;
        m[nums2[index]].insert(index);
    }
    
    int count(int tot) {
        // O(nums1.length)
        int ans = 0;
        for (int i : nums1) {
            auto it = m.find(tot - i);
            if (it != m.end()) {
                ans += it->second.size();
            }
        }
        return ans;
    }
};

/**
 * Your FindSumPairs object will be instantiated and called as such:
 * FindSumPairs* obj = new FindSumPairs(nums1, nums2);
 * obj->add(index,val);
 * int param_2 = obj->count(tot);
 */
```


## 1866. Number of Ways to Rearrange Sticks With K Sticks Visible

本题我只想到了N^3的解法。
使用动态规划，状态转移方程为
```python
ans = 0
for j in range(k - 1, i):
    ans = (ans + dp(j, k - 1) * f2(i-1, j)) % MOD
return ans
```
即从高向低考虑，因为最高的一定可以被看见。枚举第i个木棍放的位置，剩下i-1个木棍需要抽一些放在i之后，之后的是一个枚举数。
从时间复杂度上一定会超时，事实上果然如此，尽管我试图尽力从常数上优化。
下面给出我最后超时的代码。

```python
MOD = 10**9 + 7
@cache
def f(i):
    if i <= 1: return 1
    else: return (i * f(i - 1)) % MOD
@cache
def f2(a, b):
    if a == b: return 1
    else: return (a * f2(a - 1, b)) % MOD
@cache
def dp(i: int, k: int) -> int:
    # [1:i], see k woods
    # print(i, k)
    if i < k: return 0
    elif i == k: return 1
    elif k == 1:
        # put i first and other after
        return f(i - 1)
    else:
        ans = 0
        for j in range(k - 1, i):
            # put i first and [j+1, i-1] after
            # pick num woods before
            # num = i - 1 - (j + 1) + 1
            # C_i^num * num!
            # C(n,m)=n!/((n-m)!*m!)（m≤n）
            # print('add', dp(j, k - 1), (factorial(i) // factorial(i - num)))
            ans = (ans + dp(j, k - 1) * f2(i-1, j)) % MOD
        return ans
class Solution:
    def rearrangeSticks(self, n: int, k: int) -> int:
        return dp(n, k)
```

我参考了一些题解，确实是递推公式有问题。
其实从不同的角度都可以得到这个公式。
- [能不能看到最后一根木棍](https://leetcode-cn.com/problems/number-of-ways-to-rearrange-sticks-with-k-sticks-visible/solution/qia-you-k-gen-mu-gun-ke-yi-kan-dao-de-pa-0c3g/)
- [第一类斯特林数](https://leetcode-cn.com/problems/number-of-ways-to-rearrange-sticks-with-k-sticks-visible/solution/zhuan-huan-cheng-di-yi-lei-si-te-lin-shu-2y1k/)

小修我TLE的代码就OK了。
```python
class Solution:
    def rearrangeSticks(self, n: int, k: int) -> int:
        MOD = 10**9 + 7
        @cache
        def dp(i: int, k: int) -> int:
            # [1:i], see k woods
            if i < k: return 0
            elif i == k: return 1
            elif k == 0: return 0
            else:
                # last wood can be seen, it must be `i`. dp(i-1, k - 1)
                # last wood can not be seen, (i - 1) * dp(i - 1, k)
                return (dp(i-1, k - 1) + (i - 1) * dp(i - 1, k)) % MOD

        return dp(n, k)
```
