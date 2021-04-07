---
title: LeetCode weekly contest 139
date: 2019-06-03 18:53:23
tags:
- Competitive Programming
categories:
- LeetCode
---


| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 855 / 3985 |	YoungForest | 10 | 1:03:50 | 0:53:00 | 1:03:50 | 赛后做出来  | null |

周日起来的时候已经11点多了，算是迟到40min才参加的比赛。顺利作出了前2题，第3题开始走了些弯路，赛后才做出来。如果时间够的话，第3题作出应该没意思。

## 1071. Greatest Common Divisor of Strings

Intuition:
此题相当于是找2个数的最大公约数。
`Greatest Common Divisor`的长度一定等于最大公约数或0.
简单的证明如下：
设答案的长度为x, str1由x组成，所以x一定是str1.length的约数. 同样，也是str2.length。
假设x不是最大公约数，可以组成str1和str2。那么最大公约数也一定可以组成str1和str2。

时间复杂度: `O(log N)`
空间复杂度: `O(N)`

```cpp
class Solution {
    int gcd(int a, int b) {
        if (b > a) {
            swap(a, b);
        }
        while (b > 0) {
            auto temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
public:
    string gcdOfStrings(string str1, string str2) {
        int len1 = str1.size();
        int len2 = str2.size();
        auto common_len = gcd(len1, len2);
        auto t1 = str1.substr(0, common_len);
        auto t2 = str2.substr(0, common_len);
        return t1 == t2 ? t1 : "";
    }
};
```

## 1072. Flip Columns For Maximum Number of Equal Rows
Intuition:
寻找互补的行 的最大数量。

时间复杂度: `O(matrix.length * matrix[0].length)`
空间复杂度: `O(matrix.length * matrix[0].length)`

```cpp
class Solution {
public:
    int maxEqualRowsAfterFlips(vector<vector<int>>& matrix) {
        unordered_map<string, int> count;
        int ret = 0;
        for (const auto& row : matrix) {
            string right, complete;
            for (int item : row) {
                right.push_back(item + '0');
                complete.push_back(((~item) & 1) + '0');
            }
            ++count[right];
            ++count[complete];
            ret = max({ret, count[right], count[complete]});
        }
        return ret;
    }
};
```

## 1073. Adding Two Negabinary Numbers

Intuition: 
模仿2进制。不同之处在于进位可能是-1，1，0。

时间复杂度: `O(max(arr.size(), arr.size()))`
共建复杂度: `O(max(arr.size(), arr.size()))`

```cpp
class Solution {
    void update(int& digit, int& carry) {
        if (digit == -1) {
            digit = 1;
            carry = 1;
        } else if (digit == 2) {
            carry = -1;
            digit = 0;
        } else if (digit == 3) {
            carry = -1;
            digit = 1;
        } else {
            carry = 0;
        }
    }
public:
    vector<int> addNegabinary(vector<int>& arr1, vector<int>& arr2) {
        int carry = 0;
        vector<int> ret;
        int i, j;
        for (i = arr1.size() - 1, j = arr2.size() - 1; i >= 0 && j >= 0; --i, --j) {
            int digit = arr1[i] + arr2[j] + carry;
            update(digit, carry);
            ret.push_back(digit);
        }
        for (; i >= 0; --i) {
            int digit = arr1[i] + carry;
            update(digit, carry);
            ret.push_back(digit);
        }
        for (; j >= 0; --j) {
            int digit = arr2[j] + carry;
            update(digit, carry);
            ret.push_back(digit);
        }
        if (carry == 1)
            ret.push_back(1);
        else if (carry == -1) {
            ret.push_back(1);
            ret.push_back(1);
        }
        while(ret.size() > 1 && ret.back() == 0)
            ret.pop_back();
        reverse(ret.begin(), ret.end());
        
        return ret;
    }
};
```

## 1074. Number of Submatrices That Sum to Target
