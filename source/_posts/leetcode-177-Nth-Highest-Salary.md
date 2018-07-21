---
title: leetcode 177 Nth Highest Salary
date: 2018-07-21 19:52:35
tags:
categories:
---

园子宝宝，周六快乐。今天带来的是一道Medium难度的SQL题目（其实一下子讲了2道题）。在我做这道题的时候，你或许正在吃抹茶冰淇凌，你吃东西的时候好可爱呀。

之前发现LeetCode上也有SQL的面试题：https://leetcode.com/problemset/database/。一共42道，难度还可以，比之前BA的每日一练要难很多，尤其是Medium或Hard难度的。我认为这些题尤其适合巩固你之前学的SQL，LeetCode上对MYSQL支持的也很棒，讨论区的很多解答都是用MYSQL完成的。实话说，这道题我也是看别人题解才做出来的。再也不敢再简历上写“精通SQL”了，我只能算是“熟悉”吧。

问题描述：https://leetcode.com/problems/nth-highest-salary/description/

题解：LeetCode上暂时还没有题解，这也是为什么我选这道题作为每日一练的原因。之前的算法题目是因为题解没有提供Python代码，数据库的题目大多提供了MYSQL的解答，你学习起来方便很多。然而这道题没有题解，这才有我的用武之地。

## 题解

建议你先不要向下看，只看问题描述，自己独立思考可以怎么做。由于这道题难度蛮大的，或者说对SQL熟悉的要求蛮高的。所以，自己思考后无法独立解决也是正常的。这个时候就可以向下继续看题解了。

这道题目其实是和前一道题目一脉相承的。
前一道题目的问题描述：https://leetcode.com/problems/second-highest-salary/description/。
不同点在于，本题要求第N高的工资数，所以使用了SQL中的函数。
前一道题目要求第2高的工资数，只需要写一条SELECT语句就可以了。

我们先看一下前一道题目怎么做，看题解前自己先独立思考:)
官方题解：https://leetcode.com/problems/second-highest-salary/solution/

我的题解：
```SQL
SELECT 
    CASE 
    WHEN COUNT(*) = 2 THEN MIN(t0.Salary)
    ELSE NULL
    END as SecondHighestSalary
FROM
(SELECT DISTINCT Salary
FROM Employee
ORDER BY Salary
DESC
LIMIT 2) as t0
;
```

思路相比官方题解更直接。
降序排列所有的Salary（这里需注意使用DISTINCT关键词），选出最高的2个中最小的那个，不就是第二大的吗？
这道题一个比较坑的点在于如果没有第2高的工资，需要返回null，我是通过`CASE`语句解决的。
官方题解是通过`IFNULL`函数或再加一条SELECT解决的，也都可以学习一下。

第N高的工资从思路上来讲不难，但要写出来还是需要对SQL的语法足够熟悉的。涉及创建函数的语法，变量的生命和使用等高级语法知识。

```SQL
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  DECLARE M INT;
  SET M = N - 1;
  RETURN (
      # Write your MySQL query statement below.
      SELECT DISTINCT Salary FROM Employee ORDER BY Salary DESC LIMIT 1 OFFSET M
  );
END
```

这里之所以不需要处理`null`是因为function的声明的返回类型为INT，所以即使如果没有第N高的工资，函数默认是会返回null的。