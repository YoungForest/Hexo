---
title: LeetCode 29 Divide Two Integer
date: 2018-10-23 16:41:47
tags:
categories:
- LeetCode
---

有4周时间没有刷LeetCode了，理由一方面是紧迫感下降，另一方面是行动力不足。
最近又有一场面试要准备，小红书 视频组 的算法实习生。
一面看 机器学习的知识，防止重蹈 快手 面试的覆辙；另一面回顾自己的代码能力，果然4周不刷题，连代码都写不好了。作为未来的程序员，代码能力不好怎么行呢？还是要重新有规划的开始刷leetcode的。

Description: https://leetcode.com/problems/divide-two-integers/description/
Solution: 无
Difficulty: Medium

## brute approach

直接暴力，用减法代替除法。不出所料，果然超时。
时间复杂度：O(m)，m为商的绝对值。
空间复杂度：O(1), 除常量外，并未申请额外空间。

```java
class Solution {
    public int divide(int dividend, int divisor) {
        if (dividend == Integer.MIN_VALUE && divisor == -1) return Integer.MAX_VALUE;
        if (divisor == 1) return dividend;
        if (dividend == 0) return 0;
        
        boolean positive = true;
        if (Integer.signum(dividend) + Integer.signum(divisor) == 0) positive = false;
        
        int count = 0;
        int originalDividend = dividend;
        
        while (true) {
            dividend = positive ? dividend - divisor : dividend + divisor;
            if (Integer.signum(dividend) == 0) {
                count = positive ? count + 1 : count - 1;
                break;
            }
            if (Integer.signum(dividend) + Integer.signum(originalDividend) == 0) break;
            count = positive ? count + 1 : count - 1;
        }
        
        return count;
    }
}
```

## 模拟除法笔算

- [很好的解释和python代码](https://leetcode.com/problems/divide-two-integers/discuss/179759/Python-7-lines-(beats-99):-How-you-learned-to-divide-when-you-were-7-years-old)
- [Java Solution, explanation awful though](https://leetcode.com/problems/divide-two-integers/discuss/13417/No-Use-of-Long-Java-Solution)

```java
public class Solution {
    public int divide(int dividend, int divisor) {
		if(dividend==Integer.MIN_VALUE && divisor==-1) return Integer.MAX_VALUE;
        if(dividend > 0 && divisor > 0) return divideHelper(-dividend, -divisor);
        else if(dividend > 0) return -divideHelper(-dividend,divisor);
        else if(divisor > 0) return -divideHelper(dividend,-divisor);
        else return divideHelper(dividend, divisor);
    }
    
    private int divideHelper(int dividend, int divisor){
        // base case
        if(divisor < dividend) return 0;
        // get highest digit of divisor
        int cur = 0, res = 0;
        while((divisor << cur) >= dividend && divisor << cur < 0 && cur < 31) cur++;
        res = dividend - (divisor << cur-1);
        if(res > divisor) return 1 << cur-1;
        // 每次调用都只计算出来商里为1的一位
        return (1 << cur-1)+divide(res, divisor);
    }
}
```