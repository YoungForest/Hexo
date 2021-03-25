---
title: recursion
date: 2019-02-11 12:58:52
tags:
- LeetCode
- Algorithm
categories:
- Programming
---

本文根据LeetCode上的教程 [Introduction to Algorithms - Recursion I](https://leetcode.com/explore/learn/card/recursion-i/) 整理而成。目的在于帮助笔者自己更熟悉“递归”这一重要的编程概念，如果能够同时对他人产生帮助，那更好不过了。

本文的结构和LeetCode上的完全相同，分为 简介、递归原则、复现关系、备忘录、复杂度分析、总结 6个部分。

## 简介

本Card的目的，回答以下问题：
1. 什么是递归？递归如何工作？
2. 如何递归地解决一个问题？
3. 如何分析一个递归算法的时间复杂度和空间复杂度？
4. 如何以一种更好的方式应用递归？

## 递归的原理

每次递归函数调用自身，都将给定问题变为子问题。递归过程一直继续指导子问题可以不通过进一步递归就可以直接解决。

递归函数避免无限递归的必要属性：
1. 递归结束条件(**base cases**)
2. 一套规则(**recurrence relation**)，可以将所有其他的cases规约为base cases。

递归函数中可以有多个地方调用本身。

### 例子 翻转字符串
```cpp
void printReverse(const char *str) {
    if (!*str) return;  // base case
    printReverse(str + 1);
    putchar(*str);
}
```

### 递归函数

如果一个问题存在递归解法，我们就可以遵循下列步骤去实现它。

我们定义该问题为函数`F(x)`可以实现，其中`X`是函数的输入，同时表示了问题的范围。

在函数`F(X)`中，我们实现以下步骤：
1. 将问题拆分成更小的范围，$x_1 \belong X, x_2 \belong X, ..., x_n \belong X$.
2. 递归调用函数`F(x_1), F(x_2), ..., F(x_n)`以解决`X`的子问题。
3. 最后，处理子问题的解，组合成对应`X`的解。

## Recurrence Relation

定义：一个问题的解和其子问题的解之间的关系。

### 例子：Pascal's Triangle

定义：杨辉三角是一系列数字组成三角形的形状。在杨辉三角中，每行最左和最右的数字永远是1. 对于剩余的数字，每个数字是它前一行正上方2个数字之和。

用数学公式表达出来就是，Recurrence Relation为
$f(i, j) = f(i-1, j-1) + f(i-1, j),$

base cases为：
$f(i, j) = 1, if j = 1 or j = i$.

其中，$f(i, j)$表示第i行第j个数。

## Memoization 备忘录

### 递归过程中重复的计算

递归解法常常是十分**符合直觉**和**容易编码**的。但大多数时候，在递归过程中，重复计算导致了性能上的损失。

**备忘录法(Memoization)**
即是一个通用的避免重复计算的技术。
是的，这个词没有拼错，不是Memorization。

定义：为了避免重复计算，我们可以在一个cache中存储中间子问题的结果，以便之后再次使用它们的时候不需要重复计算。

备忘录的实现可以通过hashmap实现。尤其是在OOP中，利用装饰器可以实现通用的Memoization。

### 例子 斐波那契数

[斐波那契数的多种解法](https://leetcode.com/articles/climbing-stairs/)，其中有时间复杂度为O(log n)的**Binets法**和**公式法**，令人印象十分深刻.

## Complexity Analysis 复杂度分析

递归算法的复杂度有时候不是显而易见的，要通过一些套路分析。

尾递归是一种特殊的技术，可以消减递归栈的使用，优化空间复杂度，使其和迭代算法相同。

### Time Complexity 时间复杂度

递归算法的时间复杂度为：
O(T) = R * O(s),
其中，R为递归调用的数量，O(s)为每次递归调用产生的计算复杂度。
一般来说，R更难算一点，O(s)的计算和非递归算法的时间复杂度分析一样。

借助execution tree的技术，我们可以更好地分析递归调用的数量。
execution tree是展示具体情况下递归调用流的一棵树，每个节点代表一次调用，节点上的值表示调用时的参数。
这棵树的节点数目就是R。

需要特别注意的是，当使用Memoization技术时，execution tree的变化。

### Space Complexity 空间复杂度

递归算法的空间使用主要分为2部分：
1. recursion related
2. non-recursion related 

#### recursion related

学过编译原理的我们都知道，每次函数调用都要在栈上压入：
1. 函数的返回地址
2. 函数参数
3. 函数的本地变量

递归算法的函数调用栈的深度是从初始case到base case.

#### non-recursion related

全局变量使用的空间，主要在堆上分配。比如，memoization 要使用的hashmap。

### Tail Recursion 尾递归

尾递归是一种递归调用是递归函数的最后指令，而且函数中只有一个递归调用。

尾递归的一个很好的例子。注意，non_tail_recursion在最后的递归调用后还有计算。
```java
public class Main {
    
  private static int helper_non_tail_recursion(int start, int [] ls) {
    if (start >= ls.length) {
      return 0;
    }
    // not a tail recursion because it does some computation after the recursive call returned.
    return ls[start] + helper_non_tail_recursion(start+1, ls);
  }

  public static int sum_non_tail_recursion(int [] ls) {
    if (ls == null || ls.length == 0) {
      return 0;
    }
    return helper_non_tail_recursion(0, ls);
  }

  //---------------------------------------------

  private static int helper_tail_recursion(int start, int [] ls, int acc) {
    if (start >= ls.length) {
      return acc;
    }
    // this is a tail recursion because the final instruction is the recursive call.
    return helper_tail_recursion(start+1, ls, acc+ls[start]);
  }
    
  public static int sum_tail_recursion(int [] ls) {
    if (ls == null || ls.length == 0) {
      return 0;
    }
    return helper_tail_recursion(0, ls, 0);
  }
}
```

尾递归消除递归栈的原理：
编译器知道在从callee中返回之后，会立刻再次返回，不需要再利用函数调用栈中保存的数据。只需要一个栈帧就可以了，所有层共用一个栈帧，所以返回时可以跳过整个递归栈。

并不是所有语言的编译器都支持尾递归优化的。比如，C, C++支持，而Python, Java不支持。

尾递归通常也不是那么好实现。需要
递归调用只出现在最后一个指令，如果需要调用多个函数，或是对返回值进行计算，就没法尾递归了。

而且细心的同学可以发现尾递归和迭代(loop)的相似之处。事实上，有些函数式编程语言甚至不支持loop，只有递归，完全可以实现迭代。因为我们平时使用loop居多，尾递归很少。如果需要写尾递归时（一般是在一些面试的要求中），可以先写loop版本的代码。然后试着把其中的局部变量更新改成尾递归中的参数，往往就可以写出优雅的（但对于大多数人可读性并不高）的尾递归代码了。

## 总结

解决递归问题的套路：
1. 定义递归函数
2. 写下recurrence relation和base case
3. 使用Memoization消除重复计算，如果存在的话
4. 如果可能的话，使用尾递归实现递归算法，以消减空间复杂度