---
title: LeetCode weekly contest 128
date: 2019-03-17 15:50:49
tags:
- LeetCode
categories:
- Programming
---

前3道题比较顺利，30min内解决。最后一道hard题目，思路比较混乱，1个小时愣是没做出来。
Contest给我的感觉是，还是拼的熟练度。
因为第2、3题之前做过类似的，所以很快就做出来了。第2题甚至只用了2分钟!!!

| Rank |	Name |	Score |	Finish Time | 	Q1 (2) |	Q2 (4) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
|348 / 5164|	YoungForest |	19|	1:24:03|	0:11:33(1)|	0:13:42(1)|	0:27:37	|None|

## 1012. Complement of Base 10 Integer

```cpp
class Solution {
public:
    int bitwiseComplement(int N) {
        if (N == 0) return 1;
        int ret = 0;
        for (int i = 0; i < 32; i++) {
            if ((1 << i) > N) break;
            ret += ((N & (1 << i)) == 0) ? (1 << i) : 0;
        }
        
        return ret;
    }
};
```

时间复杂度: O(log N)，与数字的长度成正比。
空间复杂度: O(1).

由于没有注意corner case, `if (N == 0) return 1;`。wrong answer了一次。
我的方法是straight forward的，没有任何技巧和trick。因为是签到题嘛，而且时间复杂度足够了。
也有一些其他的思路：
比如找到最大的`X = 1111..11`使得`X >= N`, `return X - N`或`return X^N`即可。

## 1013. Pairs of Songs With Total Durations Divisible by 60


```cpp
class Solution {
public:
    int numPairsDivisibleBy60(vector<int>& time) {
        vector<int> hashmap(60, 0);
        int ret = 0;
        for (const int & t : time) {
            ret += hashmap[(60 - t + 60000) % 60];
            hashmap[t % 60]++;
        }
        return ret;
    }
};
```

与著名的`two sum`思路一样，考察`hashmap`的使用。
为了将所有的值，包括负数，映射到60以内，我使用了`(60 - t + 60000) % 60`，其实更好的做法是`(60 - t % 60) % 60`。

时间复杂度: O(N),
空间复杂度: O(N).

## 1014. Capacity To Ship Packages Within D Days

一道典型的二分题，周末帮二师兄做头条笔试题的时候也遇到了。思路很清晰，写起来也很熟练。

```cpp
class Solution {
    bool possible(vector<int>& weights, int capacity, int D) {
        int day_count = 0;
        int weight_index = 0;
        for (; day_count < D; day_count++) {
            int hasLoadedWeight = 0;
            for (; weight_index < weights.size() && hasLoadedWeight + weights[weight_index] <= capacity; weight_index++) {
                hasLoadedWeight += weights[weight_index];
            }
        }
        return weight_index == weights.size();
    }
public:
    int shipWithinDays(vector<int>& weights, int D) {
        // binary search，time complexity: 50000 * log(50000 * 500), Space: O(1)
        int hi = 50000 * 500;
        int lo = 0;
        while (lo < hi) {
            // loop invariant: possible(hi) == true
            int mid = lo + (hi - lo) / 2;
            if (possible(weights, mid, D))
                hi = mid;
            else
                lo = mid + 1;
        }
        
        return hi;
    }
};
```

Time complexity: 50000 * log(50000 * 500)，
Space: O(1)

## 1015. Numbers With 1 Repeated Digit

花了一个小时，仍没有做出来。回头反思，正确的思路有：计算没有重复位的数的个数，将数集分为0、1～digit-1、digit。错误的想法有，没有使用permutation简化计算。对数字的模式分析的不够透彻，事实上只需要分为2类0~digit-1, digit即可。由于这些错误，虽然笔算可以算出数目，但代码实现过于复杂，长度也过长，很难直接写对。最后不得不放弃。

参考了[lee215](https://leetcode.com/problems/numbers-with-1-repeated-digit/discuss/256725/JavaPython-Count-the-Number-Without-Repeated-Digit)和[heqingy](https://leetcode.com/problems/numbers-with-1-repeated-digit/discuss/256866/Python-O(logN)-solution-with-clear-explanation)的解答。

```cpp
class Solution {
    int permutation(int n, int m) {
        int ret = 1;
        for (int i = 0; i < n; i++) {
            ret *= m - i;
        }
        
        return ret;
    }
public:
    int numDupDigitsAtMostN(int N) {
        vector<int> digits;
        // transform N + 1 to list. Attention: have to be N + 1, not N
        int tmp = N + 1;
        while (tmp > 0) {
            digits.push_back(tmp % 10);
            tmp /= 10;
        }
        reverse(digits.begin(), digits.end());
        int len = digits.size();
        int ret = 0;
        // the first digit is 0
        // take 3452 as an example
        // len = 4
        // compute ***, **, *
        for (int i = 1; i < len; i++) {
            ret += 9 * permutation(len - i - 1, 9);
        }
        // the first digits is not 0
        set<int> seen;
        for (int i = 0; i < len; i++) {
            // if i == 2
            // compute 34**
            for (int j = ((i == 0) ? 1 : 0); j < digits[i]; j++) {
                // if j == 2
                // compute 342*
                if (seen.find(j) == seen.end()) {
                    ret += permutation(len - 1 - i, 10 - (i + 1));
                }
            }
            // break if 344...
            if (seen.find(digits[i]) != seen.end()) break;
            seen.insert(digits[i]);
        }
        
        return N - ret;
    }
};
```

时间复杂度：O(log n)，数字的长度。
空间复杂度: O(1).


## 后记

现在刷了279道题了，但愿刷到后来可以达到，遇到题目就有思路，有思路就能默写下来，bug-free的境界吧。这种境界需要多少题目呢？600？900？
无论需要多少道题，都要做下去。
之前刷题一直有个误区，速度不够，每天腾出来专心做题的时间不多。只有速度快才能称之为刷不是。
再次明确自己的目标，用1年时间来准备面试需要的技能。数据结构与算法是其基础，剩下的语言、计算机组成、操作系统、设计模式、编译器、网络，也要慢慢补上来。明年这个时候就是真刀真枪地上战场的时候了。

加油，Forest!