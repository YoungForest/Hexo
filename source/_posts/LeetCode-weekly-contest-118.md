---
title: LeetCode weekly contest 118
date: 2019-01-06 10:37:36
tags:
- Competitive Programming
categories:
- LeetCode
---

一周一度的LeetCode weekly contest 开始啦。本周着实比之前有所进步，首先是对C++更加熟悉了，之前都是用Python写的。答题过程也更流畅了，差点做出来3道题目。

<!-- more -->

## 970. Powerful Integers

第一题只有3分，而且无法从算法上就行优化，brute approach即可。
需要注意的是corner case, 当x == 1 or y == 1时，1^n = 1.

```cpp
class Solution {
public:
    vector<int> powerfulIntegers(int x, int y, int bound) {
        unordered_set<int> res;
        
        for (int i = 0; ; ++i) {
            int ans = pow(x, i);
            if (ans > bound) break;
            for (int j = 0; ; ++j) {
                int ans_new = ans + pow(y, j);
                if (ans_new <= bound)
                    res.insert(ans_new);
                else
                    break;
                if (y == 1) break;
            }
            if (x == 1) break;
        }

        vector<int> res_vec;
        for (const auto a: res) {
            res_vec.push_back(a);
        }
        return res_vec;
    }
};
```

## 969. Pancake Sorting

首先想到一种暴力方法，每次把最后一个元素排好序，类似选择排序的算法。
即先找到最后一个元素的位置，将其flip到第一个位置，然后再flip一次，放在最后一个位置。
不变式为，最后一个位置之后的元素都是排好序的。

```cpp
class Solution {
public:
    void flip(vector<int>& A, int begin,int end) {
        for (; begin < end; ++begin, --end) {
            int temp;
            temp = A[begin];
            A[begin] = A[end];
            A[end] = temp;
        }
    }
    
    vector<int> pancakeSort(vector<int>& A) {
        vector<int> res;
        for (int i = A.size(); i > 1; --i) {
            int index = 0;
            for (int j = 0; j < i; ++j) {
                if (A[j] == i) {
                    index = j;
                    break;
                }           
            }
            if (index + 1 != i) {
                res.push_back(index+1);
                flip(A, 0, index);
                res.push_back(i);
                flip(A, 0, i - 1);
            }
        }
        
        return res;
    }
};
```

## 971. Flip Binary Tree To Match Preorder Traversal

该题也是straight forward解决即可，不断递归判断每个子树是否可以flip。由于搞错了一个参数的含义(设计的是没问题的，但实现的时候有疏忽)，voyageIndex传入的是root的位置，flip返回的是预计下一个子树的根结点在voyage中的位置。
导致12:19才AC，超时20min。而且还WA了4次。

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    int flip(int voyageIndex, TreeNode* root, vector<int>& voyage, vector<int>& res) {
        if (root == nullptr) return voyageIndex;
        // cout << "root->val : " << root->val << endl;
        if (voyage[voyageIndex] != root->val) return -1;
        // cout << "root->val : " << root->val << endl;
        int voyageIndexEnd;
        bool flag = false;
        if (root->left != nullptr && voyage[voyageIndex + 1] == root->left->val) {
            ;
        } else if (root->right != nullptr && voyage[voyageIndex + 1] == root->right->val && root->left != nullptr) {
            TreeNode *temp;
            temp = root->left;
            root->left = root->right;
            root->right = temp;
            flag = true;
        } else {
            ;
        }
        // cout << "voyageIndex: " << voyageIndex << " "<< root->val << endl;
        voyageIndexEnd = flip(voyageIndex + 1, root->left, voyage, res);
        // cout << "voyageIndexEnd: " << voyageIndexEnd << endl; 
        if (voyageIndexEnd == -1) return -1;
        voyageIndexEnd = flip(voyageIndexEnd, root->right, voyage, res);
        // cout << "voyageIndexEnd: " << voyageIndexEnd << endl; 
        if (voyageIndexEnd == -1) return -1;
        if (flag) res.push_back(root->val);
        return voyageIndexEnd;
    }
    vector<int> flipMatchVoyage(TreeNode* root, vector<int>& voyage) {
        vector<int> error = {-1};
        vector<int> res;
        
        if (flip(0, root, voyage, res) == -1) {
            return error;
        } else {
            return res;
        }
    }
};
```

## 972. Equal Rational Numbers

本题并没有考察任何算法，只考察的是数据结构抽象和基础的数学知识(对有理数Rational Numbers)的理解。
我也是看的题解才明白如此简单的。真的是一道难者不会，会者不难的题目。

```cpp
#include <iostream>
#include <string>
#include <cmath>

using namespace std;

class Fraction {
public:
    long long numerator, denominator;
    long long gcd(long long x, long long y) {
        return y > 0 ? gcd(y, x % y) : x;
    }
    Fraction(long long n, long long d) {
        long long g = this->gcd(n, d);
        this->numerator = n / g;
        this->denominator = d / g;
    }
    Fraction(string S) {
        // <IntegerPart><.><NonRepeatingPart><(><RepeatingPart><)>
        auto dotPosition = S.find(".");
        Fraction ans(0, 1);
        if (dotPosition != string::npos) {
            Fraction integerPart(stol(S.substr(0, dotPosition)), 1);
            ans.add(integerPart);
            
            auto leftParenthese = S.find("(");
            string nonRepeatingPartString;
            if (leftParenthese != string::npos) {
                nonRepeatingPartString = S.substr(dotPosition + 1, leftParenthese - dotPosition - 1);

                
                auto repeatingPartString = S.substr(leftParenthese + 1, S.size() - leftParenthese - 2);
                Fraction repeatingPart(stol(repeatingPartString), pow(10, nonRepeatingPartString.size()) * (pow(10, repeatingPartString.size()) - 1));
                ans.add(repeatingPart);
            } else {
                nonRepeatingPartString = S.substr(dotPosition + 1, S.size() - dotPosition - 1);
            }
            if (nonRepeatingPartString.size() > 0) {
                Fraction nonRepeatingPart(stol(nonRepeatingPartString), pow(10, nonRepeatingPartString.size()));
                ans.add(nonRepeatingPart);
            }
        } else {
            Fraction integerPart(stol(S.substr(0, S.size())), 1);
            ans.add(integerPart);
        }
        
        this->numerator = ans.numerator;
        this->denominator = ans.denominator;
    }
    void add(Fraction b) {
        Fraction n(this->numerator * b.denominator + this->denominator * b.numerator, this->denominator * b.denominator);
        this->numerator = n.numerator;
        this->denominator = n.denominator;
    }
    bool equal(Fraction b) {
        return this->numerator == b.numerator && this->denominator == b.denominator;
    }
};

class Solution {
public:
    bool isRationalEqual(string S, string T) {
        return Fraction(S).equal(Fraction(T));
    }
};

int main2(int argc, char const *argv[])
{
    Solution s;
    // auto res = s.isRationalEqual("0.(52)", "0.5(25)");
    Fraction a("0.(52)");
    cout << a.numerator << " / " << a.denominator << endl;

    Fraction b("0.5(25)");
    cout << b.numerator << " / " << b.denominator << endl;

    Fraction c("0.52(52)");
    cout << c.numerator << " / " << c.denominator << endl;

    return 0;
}
```

事实上，如果注意到对有理数的限制的话，还有更投机取巧的解法，具体可以参考[han神的解答](https://leetcode.com/problems/equal-rational-numbers/discuss/214203/JavaC++Python-Easy-Cheat).
```
Each part consists only of digits.
The <IntegerPart> will not begin with 2 or more zeros.  (There is no other restriction on the digits of each part.)
1 <= <IntegerPart>.length <= 4
0 <= <NonRepeatingPart>.length <= 4
1 <= <RepeatingPart>.length <= 4
```

我的代码很长。写的过程中，暴露出来对C++类的实现十分不熟悉。本来还想用运算符重载来着，后来发现自己并不会。
看来，我还需要把"C++ Primer"的其他部分也花时间读一下。毕竟
> 工欲善其事，必先利其器.
-- 《论语·卫灵公》

## 后记

最后附上我对“C++ Primer”的书评：
>C++入门的神书。从大一开始就被无数人推荐，然而一直懒于去看，天真地认为学校学的那些C++就够了。后来随着编程学习的继续深入，对C++的敬畏之心渐渐建立起来。原来自己一直用的C++根本就是假的，只是带类的C语言。尤其是学习cs107编程范式的时候，老师也一针见血地指出，大多数C++程序员都是这样的。听到后羞愧难当，把C++从简历里会的语言里都删去了。到了元旦假期，终于有勇气去重新入门C++了。直接上手英文版，以用C++刷LeetCode作为辅助，先看了前3章和9～12章（即基础部分、container 和 smart pointer）。看完之后真的是醍醐灌顶，后悔没有早点“学习”C++。由于本书面面俱到(实在太厚了），我短期内也没有计划全部看完。但是我认为，每读一章，都受益无穷。