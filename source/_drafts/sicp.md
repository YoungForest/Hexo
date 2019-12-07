---
title: sicp
tags:
categories:
---

# Chapter 1. 构造过程抽象

## 1.1 

不区分表达式（有返回值）和语句，或者说 只有表达式。
特例：
define
(define x 3)

过程定义:
```lisp
(define (<name> <formal parameters>) <body>)
```

正则序求值：完全展开而后规约
应用序求值：先求值参数，后应用

谓词：返回真或假的过程
#t
#f

条件表达式：
```lisp
(cond (<p1> <e1>)
      (<p2> <e2>)
      ...
      (<pn> <en>))
```
`else`是一种符号，类似switch里的default

if 语句
```lisp
(if <predicate> <consequent> <alternative>)
```

逻辑符合运算符
```
(and <e1> <e2> <e3>)
(or <e1> <e2> <e3>)
(not <e>)
```

http://sicp.readthedocs.io/

过程抽象

形式参数

约束变量：过程形式参数的名字
自由变量

内部定义


### 1.2

(/ (+ 5 4 (- 2 (- 3 (+ 6 (/ 4 5))))) (* 3 (- 6 2) (- 2 7)))

-37/150

### 1.3

```lisp
(define (max_of_3_num x y z)
    (if (> x y)
        (if (> y z)
            (+ x y)
            (+ x z)
        )
        (if (> x z)
            (+ x y)
            (+ y z)
        )
    )
)
```

### 1.5

应用序：无限递归
正则序：0

### 1.6

（这个题我参考了网上的答案。）
if 语句是一种特殊形式，当它的 predicate 部分为真时， then-clause 分支会被求值，否则的话， else-clause 分支被求值，两个 clause 只有一个会被求值。

而另一方面，新定义的 new-if 只是一个普通函数，它没有 if 所具有的特殊形式，根据解释器所使用的应用序求值规则，每个函数的实际参数在传入的时候都会被求值，因此，当使用 new-if 函数时，无论 predicate 是真还是假， then-clause 和 else-clause 两个分支都会被求值。

所以，这个sqrt函数会出现无限递归的问题。

### 1.7

牛顿法求平方根

```lisp
(define (sqrt-iter guess x)
    (if (good-enough? guess x)
        guess
        (sqrt-iter
         (improve guess x) x)))
(define (mysqrt x) (sqrt-iter 1.0 x))
(define (improve guess x)
    (average guess (/ x guess))
    )
(define (average x y)
    (/ (+ x y) 2)
    )
(define (good-enough? guess x)
    (<
     (abs (-
      (* guess guess)
      x))
     0.00001))
(define (abs x)
    (if (< x 0)
        (- x)
        x))
(mysqrt 10)
```

很小的数失败是由于如果这个小数比阈值设置的还小，自然会出问题。

大数，则是因为 mit-scheme 实现的小数精度不足以表示两个大数之间的差。

函数与过程之间的矛盾，不过是在描述一件事的特征，和描述如何去做那件事之间普遍性差异的一个具体反映。

块结构：
函数定义里面定义函数（局部函数）

## 1.2 过程和它们产生的计算

递归计算过程（线性递归过程）：构造起一个**推迟进行**的操作所行程的链条，先逐步展开而后收缩。
迭代计算过程（线性迭代过程）：其状态可以用固定数目的**状态变量**描述的计算过程。

### 练习 1.11

```lisp
(define (f1_11 n)
  (if (< n 3)
      n
      (+ (f1_11 (- n 1))
         (* 2 (f1_11 (- n 2)))
         (* 3 (f1_11 (- n 3))))))

(f1_11 4)

(define (f1_11_iter a b c i size)
  (if (= i size)
      c
      (f1_11_iter b c (+ (* 3 a) (* 2 b) c) (+ i 1) size)))
(define (f1_11_2 n)
  (f1_11_iter 0 1 2 2 n))

(f1_11_2 4)
```

## 练习 1.16
```lisp
(define (fast-expt b n)
    (expt-iter b n 1))

(define (expt-iter b n a)
    (cond ((= n 0)
            a)
          ((even? n)
            (expt-iter (square b)
                       (/ n 2)
                       a))
          ((odd? n)
            (expt-iter b
                       (- n 1)
                       (* b a)))))
```

## 1.3 使用高阶函数做抽象

lambda 表达式：
```lisp
(lambda <formal-parameters> <body>)
```