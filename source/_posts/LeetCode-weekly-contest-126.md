---
title: LeetCode weekly contest 126
date: 2019-03-03 11:55:17
tags:
- Competitive Programming
categories:
- LeetCode
---

今天试着边做题边录视频，由于场地的限制，无法用麦克风进行讲解，效果差强人意。虽然可以用文字注释进行一些弥补，但丧失了视频传播的最大优势。以后还是以博客为主，传播自己的思想吧。
尤其是本次只做出2道题目，后2道题目都有尝试，但均失败了。视频效果太差。本身大家如果在B站上看视频的话，都是为了看up主秀的。这次没秀起来，遭遇了滑铁卢，甚是尴尬。不过最后我还是打算把视频放上去。就是这么脸皮厚，不怕丢人，不怕以后被翻黑历史。

排名也直接飞到1500名开外，这周的ranking怕不是要跌。

结果：

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (6) |	Q4 (9)|
|--|--|--|--|--|--|--|--|
| 1684 / 4564	| YoungForest | 	8 |	0:38:19 |	0:16:17 |	0:33:19  WA(1) | |	 |

## 1002. Find Common Characters

因为录视频的时候把思路都写在开始部分了。就只分析一下复杂度吧。
Time complexity: O(N), N为A中所有字符串长度之和。
空间复杂度：O(1), 因为字符被限制在26个小写字母里，否则的话，是和字符数成正比的。

```cpp
class Solution {
public:
    vector<string> commonChars(vector<string>& A) {
        // 用一个vector记录出现的字母，因为只有小写，大小为26，还因为要记录出现的最小次数，所以类型为int即可
        vector<int> record(26, numeric_limits<int>::max());
        for (string & s: A) {
            vector<int> record1String(26, 0);
            for (char c : s) {
                record1String[c - 'a']++;
            }
            for (int i = 0; i < 26; ++i) {
                record[i] = min(record[i], record1String[i]);
            }
        }
        
        vector<string> result;
        for (int i = 0; i < 26; i++) {
            result.insert(result.end(), record[i], string(1, char(i + 'a')));
        }
        
        return result;
    }
};
```

## 1003. Check If Word Is Valid After Substitutions

Time complexity: O(N ^ 2), 因为find, 构造 nextS的操作是O(N)的，每次while循环S的长度减3, 需要 长度/3 次循环。
Space complexity: O(N), 因为构造了新的nextS。不过这个是可以消除的，反复利用原来的S的空间就可以。但是要写多余的代码。

```cpp
class Solution {
public:
    bool isValid(string S) {
        // 首先理解valid string的定义:
        // 这个定义的递归的
        // 对于任何valid的string，把"abc"插入任何位置的字符串仍为valid
        // 初始的valid string只有"abc"
        // 所以，判断一个string是否是valid的，我们只需要不断地把"abd"抽掉，如果剩下"abc"，则true，否则false
        // 这个过程也可以递归进行
        
        // 递归解法会stack overflow, 换迭代解法
        while (true) {
            if (S == "abc") return true;
            auto index = S.find("abc");
            if (index == string::npos) { // 没找到"abc"字串
                return false;
            } else {
                string nextS(S.begin(), S.begin() + index);
                nextS.insert(nextS.end(), S.begin() + index + 3, S.end());
                S = nextS;
            }
        }
    }
};
```

## 1004. Max Consecutive Ones III

看了讨论区，才惊觉要用sliding window。其实，如果对此类问题比较熟悉的话，还是很直觉的想法。这道题也一针见血地指出了我知识的盲区。说实话，我对sliding window(或是 2 pointers)的题目还不足够熟悉。看到这道题，一直在尝试用dp和greedy做。花费很多时间，还没做出来，也不奇怪。

```cpp
class Solution {
public:
    int longestOnes(vector<int>& A, int K) {
        // 知道用sliding window了，题目就很简单了。用指针left, right表示窗口的范围。如果right指向1的话，继续扩充，指向0的话，如果K还有剩余，则扩充。不能扩充的时候，收缩left。
        int left = 0, right = 0;
        int remain = K;
        int result = 0;
        while (right < A.size()) {
            if (A[right] == 1) right++;
            else if (A[right] == 0 && remain > 0) {
                right++;
                remain--;
            } else if (A[left] == 0) {
                left++;
                remain++;
            } else if (A[left] == 1) {
                left++;
            } else {
                assert(false);
            }
            result = max(result, right - left);
        }
        
        return result;
    }
};
```

时间复杂度: O(n), 这也是sliding window的特点，只需要左右指针各走一遍就可以了。
空间复杂度: O(1).

同样是sliding window, 讨论区的lee215大佬的代码是这样的。
```cpp
    int longestOnes(vector<int>& A, int K) {
        int i = 0, j;
        for (j = 0; j < A.size(); ++j) {
            if (A[j] == 0) K--;
            if (K < 0 && A[i++] == 0) K++;
        }
        return j - i;
    }
```

因为我们要找最大的window，所以收缩窗口是没有必要的。所以大佬的代码如此简洁。

## 1000. Minimum Cost to Merge Stones

LeetCode的第1k道题，果然好难。看别人的Discuss看了有1个小时才理解。
说实话，DP也是我的一个知识盲区，运气好能做出来，运气不好，就做不出来。就像 花花酱 所说，DP是那种你刷100道，遇到新的还是可能解不出来的类型。
因为Discuss太难理解了。所以我想自己理解后，博文也要写的尽可能详细才行。

DP问题有2个关键：
1. 最优解结构
2. 重叠子问题

设dp[i][j] 表示merge stone[i] ~ stone[j] 所需的最小cost。
这里的merge表示，把这些堆石头合并到小于K为止，此时即使想要继续merge也无能为力。可以确定的是，一旦`i`和`j`固定，merge完剩余的石头堆数是确定的，即为`(j - i + 1) % (k - 1)`。

此时，最优解结构为 $dp[i][j] = min(dp[i][mid] + dp[mid+1][j]) + (\sum_k^{i<=k<=j} stone[i] if (j - i) % (k - 1) == 0), for mid in range(i, j, k-1)$。
`(j - i) % (k - 1) == 0`表示[i, j]的石头堆可以被merge成1，所以一定会执行合并操作，而且合并的花费为所有的石头数。而`mid`的步长为什么是`k`呢？因为只有这样dp[i][mid]剩余的石头堆数为1。

找到最优解结构后，下一步是确定如何bottom-to-top地计算dp[0][n-1]。
初始化，dp[i][i] = 0, 一堆石头是永远不需要merge的。
根据最优解结构，我们可以得到计算的顺序下图所示:
![](/images/leetcode1000 merge stone dp bottom to top computing order.png)

其中红线表示最外层循环，绿线表示内层循环，黄线表示最优解结构。·

```cpp
class Solution {
public:
    int mergeStones(vector<int>& stones, int K) {
        int N = stones.size();
        if ((N - 1) % (K - 1) != 0) return -1;
        vector<int> prefix(N);
        prefix[0] = stones[0];
        for (int i = 1; i != N; ++i) {
            prefix[i] = prefix[i-1] + stones[i];
        }

        vector<vector<int>> dp(N, vector<int>(N, 0));
        for (int m = K; m <= N; m++) {
            for (int i = 0; i + m <= N; i++) {
                int j = i + m - 1;
                dp[i][j] = numeric_limits<int>::max();
                for (int mid = i; mid < j; mid += K - 1) {
                    dp[i][j] = min(dp[i][j], dp[i][mid] + dp[mid+1][j]);
                }
                if ((j - i) % (K - 1) == 0)
                    dp[i][j] += prefix[j] - (i == 0 ? 0 : prefix[i-1]);
            }
        }
        
        return dp[0][N-1];
    }
};
```

时间复杂度: O(N^3 / K),
空间复杂度: O(N^2).

与该题相似的题目还有：[312. Burst Balloons](https://leetcode.com/problems/burst-balloons/description/)