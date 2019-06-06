---
title: LeetCode weekly contest 123
date: 2019-02-10 10:29:44
tags:
- LeetCode
categories:
- Programming
---

本次比赛是春节后的第一次。

989. Add to Array-Form of Integer

思路：模拟笔算过程，一位一位地相加。（Solution中有个很形象的名字：Schoolbook Addition）
时间复杂度：O(max(N, M)), 其中N, M分别表示A，K的长度。
空间复杂度：O(M-N), 即deque所用的空间。

```cpp
class Solution {
public:
    vector<int> addToArrayForm(vector<int>& A, int K) {
        int index = A.size() - 1;
        while (K > 0 && index >= 0) {
            int last_digit = K % 10;
            K /= 10;
            A[index] += last_digit;
            int carry = A[index] / 10;
            K += carry;
            A[index] %= 10;
            index--;
        }
        
        deque<int> result;
        while (K > 0) {
            result.push_front(K % 10);
            K /= 10;
        }
        
        A.insert(A.begin(), result.begin(), result.end());
        
        return A;
    }
};
```

## 990. Satisfiability of Equality Equations

思路：使用并查集存储相等的关系，再遍历所有的不等关系是否在不同的集之间。

时间复杂度：O(N),
空间复杂度：O（N）。

```cpp
class Solution {
    array<char, 26> parents;
    void union_variables(char a, char b) {
        char a_parent = find_root(a);
        char b_parent = find_root(b);
        parents[a_parent - 'a'] = b_parent;
    }
    char find_root(char a) {
        while (parents[a - 'a'] != a)
            a = parents[a - 'a'];
        return a;
    }
public:
    Solution() {
        for (int i = 0; i < 26; i++) {
            parents[i] = 'a' + i;
        }
    }
    bool equationsPossible(vector<string>& equations) {
        for(const string & s : equations) {
            if (s[1] == '=') {
                union_variables(s[0], s[3]);
            }
        }
        
        for(const string & s : equations) {
            if (s[1] == '!') {
                if (find_root(s[0]) == find_root(s[3]))
                    return false;
            }
        }
        
        return true;
    }
};
```

## 991. Broken Calculator

思路：一旦X大于Y，就只能通过减一的操作来达到Y。
如果X小于Y，则可以DOUBLE，也可以Decrement。
这时候如何选择呢？可以发现Double, Decrement, Decrement 和 Decrement, Double得到的结果相同。
这样，我们可以看出，
如果Y是奇数，则必须Double, Decrement才能得到。
如果Y是偶数，则必须Double才能得到(Decrement的操作次数更多)。

时间复杂度：O(log Y);
空间复杂度：O(log Y)，因为递归。

```cpp
class Solution {
public:
    int brokenCalc(int X, int Y) {
        if (X == Y) return 0;
        if (X > Y) return X - Y;
        if (Y % 2 == 1) return brokenCalc(X, Y + 1) + 1;
        else return brokenCalc(X, Y / 2) + 1;
    }
};
```

## 992. Subarrays with K Different Integers

最后留给最后一道题的时间是40min，争取把这道Hard题目解决。

思路：根据问题的时间复杂度O(n ^ 2)（我们至少需要遍历一遍所有的subarray）可知，解法的时间复杂度至少为O(n^2)。
用2层循环遍历所有的subarray, 如何快速地求出每个subarray的distinct number呢。
可以使用动态规划来缩减复杂度。
用每个子数组的distinct number, 我们用hashmap<int, int>存储，key表示distict number, value 表示该数的频数。
设f(i, j)为子数组[i, j]的distinct number对应的hashmap, 
则f(i, j) = 
f(i, j-1).insert(A[j])
or
f(i+1, j).delete(A[i])
new(A[i]), if i == j.
自底而上的构造hashmap的话，外层循环 new, 内层循环 delete。
结果TLE了。

想想有没有O(n log n)的解法。

```cpp
class Solution {
public:
    int subarraysWithKDistinct(vector<int>& A, int K) {
        unordered_set<int> frequency; // 如果没有delete的操作，使用unordered_set也是可以的
        int result = 0;
        for (int i = 0; i < A.size(); i++) {
            for (int j = i; j < A.size(); j++) {
                if (i == j) {
                    frequency.clear();
                }
                frequency.insert(A[j]);
                if (K == frequency.size()) result++;
                if (K < frequency.size()) break;
            }
        }
        
        return  result;
    }
};
```

最后还是没有想到进一步优化的算法。看了[Solution](https://leetcode.com/problems/subarrays-with-k-different-integers/solution/)，惊觉竟然有O(N)的解法。还是自己对subarray distinct number数量的性质的观察不够细致呀。

首先，固定右边界的话，对于2个subarray (i1, j), (i2, j), 其中i1 < i2，则 f(i1, j) <= f(i2, j)。
所以，对于每个右边界j，符合条件的subarray 的左边界在一定范围内，可以写作[left1, left2].

其次，我们增长右边界，如果distinct number的数量超过K了，我们需要增长left1, left2。也即left1, left2是随着右边界单调递增的。

```cpp
class Solution {
    struct Window {
        unordered_map<int, int> hashmap;
        int size = 0;
        void add(int value) {
            hashmap[value]++;
            if (hashmap[value] == 1) {
                size++;
            }
        } 
        void remove(int value) {
            hashmap[value]--;
            if (hashmap[value] == 0) {
                size--;
            }
        }
    };
public:
    int subarraysWithKDistinct(vector<int>& A, int K) {
        Window w1, w2;
        int left1 = 0, left2 = 0, right = 0;
        int result = 0;
        while (right < A.size()) {
            int value = A[right];
            
            w1.add(value);
            w2.add(value);
            
            while (w1.size > K) {
                w1.remove(A[left1++]);
            }
            while (w2.size >= K) {
                w2.remove(A[left2++]);
            }
            
            
            result += left2 - left1;
            right++;
        }
        
        return result;
    }
};
```

## 后记

今天是在家里呆的最后3天，果然寒假回家都虚度光阴了。还是呆在北京学校里，和志同道合的同学在一起，学习的劲头更高。竞争的压力也更大，怪不得大家都向往更好的环境，更优秀的朋友。
<!-- 下学期开始，就要去商汤实习了。好好把握这样的机会吧。 -->
加油，Forest！