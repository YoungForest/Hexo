---
title: LeetCode weekly contest 129
date: 2019-03-31 10:24:51
tags:
- LeetCode
categories:
- Programming
---

上周末由于准备 Google的kick start round A，放弃了一次LeetCode weekly contest。但当天晚上还是把LeetCode的题补完了。4题不简单，但经过思考还是独立做出来了。算是给被kick start难到自闭的我一个安慰吧。

## 1020. Partition Array Into Three Parts With Equal Sum

Intution:
One pass. Find the pivots which is 1/3 and 2/3.

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    bool canThreePartsEqualSum(vector<int>& A) {
        int sum_all = accumulate(A.begin(), A.end(), 0);
        if (sum_all %3 != 0) return false;
        int sum_3 = sum_all / 3;
        int sum_prefix = 0;
        for (int i = 0; i < A.size(); i++) {
            if (sum_prefix == sum_3 && sum_3 != sum_all)
                sum_3 += sum_all / 3;
            sum_prefix += A[i];
        }
        return sum_3 == sum_all;
    }
};
```

## 1022. Smallest Integer Divisible by K

Intution:
模拟笔算过程。
如果个位数不为1， 3， 7，9的话，直接范围-1. 代表找不到符合条件的N。
之后用笔算的方法，一直凑最后一位为1，知道前面所有的位数也均为1.
因为一定有解，所以循环一定会结束。

时间复杂度: O(result.length),
空间复杂度: O(1).

```cpp
class Solution {
    bool all11(int i) {
        while (i > 0) {
            if (i % 10 != 1) return false;
            i /= 10;
        }
        return true;
    }
public:
    int smallestRepunitDivByK(int K) {
        if (K % 10 != 1 && K % 10 != 3 && K % 10 != 7 && K % 10 != 9) return -1;
        vector<int> dictionary(10);
        vector<int> gewei(10);
        for (int i = 0; i < dictionary.size(); i++) {
            dictionary[i] = K * i;
            gewei[K * i % 10] = i;
        }
        int ret = 0;
        int remain = K;
        while (!all11(remain)) {
            int last = remain % 10;
            int new_value = 0;
            new_value = gewei[(11 - last) % 10] * K;
            ret++;
            remain = (new_value + remain) / 10;
        }
        while (remain > 0) {
            if (remain % 10 != 1) return -1;
            remain /= 10;
            ret++;
        }
        
        return ret;
    }
};
```

## 1021. Best Sightseeing Pair

Intution:
动态规划。最有子结构为：
以第i个元素结尾的pair的最大分数 为 max(i与i-1组成pair, i与 i-1的pair 组成pair)。

时间复杂度: O(N), one pass.
空间复杂度: O(1). 虽然我下面代码的实现为O(N)，但因为dp过程只用到dp[i-1]，所以可以进一步优化到O(1).

```cpp
class Solution {
public:
    int maxScoreSightseeingPair(vector<int>& A) {
        int n = A.size();
        vector<int> dp(n, 0);
        int ret = 0;
        for (int i = 1; i < n; i++) {
            dp[i] = max(A[i] + A[i - 1] - 1, dp[i - 1] - A[i - 1] + A[i] - 1);
            ret = max(ret, dp[i]);
        }
        
        return ret;
    }
};
```

## 1023. Binary String With Substrings Representing 1 To N

Intution:
先打表，再查表。

时间复杂度: O(max(S.length, N)),
空间复杂度: O(N).

```cpp
class Solution {
public:
    bool queryString(string S, int N) {
        vector<bool> contain(N + 1);
        for (size_t i = 0; i < S.size(); i++) {
            int value = S[i] - '0';
            contain[value] = true;
            for (size_t j = 1; j < 31 && i + j < S.size(); j++) {
                value = (value << 1) + S[i + j] - '0';
                if (value <= N) contain[value] = true;
            }
        }
        
        for (int i = 1; i <= N; i++) {
            if (!contain[i]) return false;
        }
        return true;
    }
};
```

## 后记

Google kick start round A的题目还没有整理。3个小时的比赛事实上对于我来说只有2个小时。我做出了签到题，第二题的small test。最后一个小时实在是毫无头绪，自知再给我多少时间也不会有突破了，便直接放弃了。排名600. 好像是比赛系统的bug, 最后25min无法提交，否则我的排名还会掉。因为很多人会在比赛结束前夕提交一波代码的。

Kick start是1月一次的，我想下次round B也继续参加，继续受虐。据 唐老师 说，中国Google校招的话，只看round D E。自己还差的远呢！仍需继续刷题，另外补充竞赛的知识，CS的知识。即使最后进不了Google，找工作的结果也不会差。
加油，Forest！