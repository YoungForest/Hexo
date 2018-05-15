---
title: SQL实践进阶
date: 2018-05-07 23:30:25
tags:
- kuaishou
- tech
categories:
- intern
---
这一周在公司写了很多很长功能很复杂的sql语句，深感自己的数据库和SQL学的还只是皮毛，完全没法满足工程上的要求。
负责带我的二mentor对SQL比较也精通，对我有很多指导和建议。
没有对比就没有伤害，自己的菜和师兄的强让我知耻而后勇，有了进阶SQL的想法和行动。

<!--more-->
我被推荐的2份教程（感谢师兄和二mentor）：
- sql必知必会
- [runoob](http://www.runoob.com/sql/sql-constraints.html)

其中《sql必知必会》我系统的看过一遍，runoob教程只是大致浏览一遍。
我认为只看一个教程就够了。
runoob的优点是可以在网站提供的线上数据库进行测试和练习，这一点和[w3school的教程](https://www.w3schools.com/sql/)有些像。
《sql必知必会》的优点是内容比较多，作者会传授一些写sql的经验，还会涉及到不同数据库的移植性和区别。

# 实践中遇到的问题
由于我的岗位是推荐组的算法工程师，有大量的数据挖掘的需要。
而且写的不是纯sql，而是[Hive](https://cwiki.apache.org/confluence/display/Hive/Home)-sql。
Hive上存在很多限制和挑战，比如不能在select中嵌套select子句，`select 2 * (select 3);`就是不可以的（最后摸索出得解决方案是：使用聚集函数或列之间的可计算进行需要的计算，这就很考验`union`或`join`的灵活使用了。）；数据量特别大，每次查询很耗时（学会了用小的查询验证想法，从内到外层层验证，还有在‘jupyter notebook'上进行查询和计算）。

# 回答面试中的问题
一面的小哥哥当时问我：你会SQL吗？

我：会，而且我之前还有在数据库公司的实习经历。

小哥哥：那你说说‘left join'，'right join'，'inner join'的区别。

我：不知道...

小哥哥：那你知道partition吗？

我：这个我也不知道。

小哥哥：你会的SQL仅限于上过的“数据库原理”和“课程设计”课吗？

我：是的，而且因为一段时间不用有些生疏了。

小哥哥就没再问SQL相关的内容了。

经过一周的工作和SQL的重新系统学习，我现在可以回答这两个问题了。

### ‘left join'，'right join'，'inner join'的区别
 
'inner join'即内联结，对于不匹配的项，不存在于联结结果中；'left join'，左外联结，如果左边的项在右边的表中没有匹配项，仍存在一条记录于联结结果中，此时右边表列均为NULL；'right join'，右联结与之类似。事实上，'left join'和'right join'可以互换，只是联结的左右两表也需要互换位置。

### partition的概念
partion是为了加快查询速度，而将一个表分成不同的区。
限制是，select时，被partition的列必须写在where里作为filter。