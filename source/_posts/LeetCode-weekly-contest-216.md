---
title: LeetCode weekly contest 216
date: 2020-11-22 17:32:56
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 862 / 9573 | YoungForest | 18 | 0:58:34 | 0:12:47	 | 0:23:33 | 0:33:14 | 0:58:34 |

之前连续5周免残酷群打卡，着实爽了一个月。上周虽然在前500，但只做出3题。本周虽然做出了4题，但出了前500. 又要打一周卡了。残酷群排名也降到了38名，不再15名的巅峰时光了。
自从秋招结束后，再加上实习/大论文特别忙，就没时间刷题了。甚至之前交大论文形式审查最忙的时候，一道题都不刷。11月份以来，恢复了刷国服/美服每日一题的习惯。主要是这2题一般比较简单，花的时间少。另外是想打卡赚积分，争取毕业前可以换2套衣服。
3道打卡题的难度基本上是 `残酷 > 国服 >= 美服`。

## 1662. Check If Two String Arrays are Equivalent

签到题。把列表字符串拼接起来然后再比较即可。

```cpp
class Solution {
    string concat(vector<string>& w) {
        string ans;
        for (auto& s : w) {
            ans += move(s);
        }
        return ans;
    }
public:
    bool arrayStringsAreEqual(vector<string>& word1, vector<string>& word2) {
        return concat(word1) == concat(word2);
    }
};
```

时间复杂度: O(sum(word1[i].length) + sum(word2[i].length)),
空间复杂度: O(sum(word1[i].length) + sum(word2[i].length)).


## 1663. Smallest String With A Given Numeric Value

贪心。每次都尽量增加最后一位数。

```cpp
class Solution {
public:
    string getSmallestString(int n, int k) {
        string ans(n, 'a');
        k -= n;
        for (int i = n - 1; i >= 0 && k > 0; --i) {
            const int thisDigit = min(k, 25);
            ans[i] += thisDigit;
            k -= thisDigit;
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).


## 1664. Ways to Make a Fair Array

使用类似 前缀和数组 的 前缀偶数和 和 前缀奇数和，同样 后缀偶数和 和 后缀奇数和。
然后就可以快速计算删掉某个位置后的 奇数下标元素的和与偶数下标元素的和。

```cpp
class Solution {
public:
    int waysToMakeFair(vector<int>& nums) {
        const int n = nums.size();
        int ans = 0;
        vector<int> leftOdd(n, 0);
        vector<int> leftEven(n, 0);
        vector<int> rightOdd(n, 0);
        vector<int> rightEven(n, 0);
        leftEven[0] = nums[0];
        for (int i = 1; i < nums.size(); ++i) {
            if (i % 2 == 1) {
                leftOdd[i] = leftOdd[i - 1] + nums[i];
                leftEven[i] = leftEven[i - 1];
            } else {
                leftEven[i] = leftEven[i - 1] + nums[i];
                leftOdd[i] = leftOdd[i - 1];
            }
        }
        if ((n - 1) % 2 == 0) {
            rightEven[n-1] = nums[n-1];
        } else {
            rightOdd[n-1] = nums[n-1];
        }
        for (int i = n - 2; i >= 0; --i) {
            if (i % 2 == 1) {
                rightOdd[i] = rightOdd[i + 1] + nums[i];
                rightEven[i] = rightEven[i + 1];
            } else {
                rightEven[i] = rightEven[i + 1] + nums[i];
                rightOdd[i] = rightOdd[i + 1];
            }
        }
        for (int i = 0; i < nums.size(); ++i) {
            int odd = 0, even = 0;
            odd += i > 0 ? leftOdd[i - 1] : 0;
            even += i > 0 ? leftEven[i - 1] : 0;
            odd += i < n - 1 ? rightEven[i + 1] : 0;
            even += i < n - 1 ? rightOdd[i + 1] : 0;
            if (odd == even) ++ans;
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

## 1665. Minimum Initial Energy to Finish Tasks

参见[零神的帖子](https://leetcode-cn.com/problems/minimum-initial-energy-to-finish-tasks/solution/wan-cheng-suo-you-ren-wu-de-zui-shao-chu-shi-neng-/)。
本题我在比赛时用了不正确地贪心也过了。即找到最小的差值`|minimum_i - actual_i|`，作为剩下的值；比较这个值和最大的`minimum_i`。
正确的解法对于6分题实在是太难了，应该7/8分。很多人即使猜对了，也不会证明正确性。

```cpp

class Solution {
public:
    int minimumEffort(vector<vector<int>>& tasks) {
        sort(tasks.begin(), tasks.end(), [](const auto& u, const auto& v) {
            return u[0] - u[1] < v[0] - v[1];
        });
        int p = 0;
        int suma = 0;
        for (const auto& task: tasks) {
            p = max(p, suma + task[1]);
            suma += task[0];
        }
        return p;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(1).