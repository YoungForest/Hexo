---
title: Codeforces Educational Codeforces Round 151
date: 2023-07-01 16:33:20
tags:
- codeforces
- contest
categories:
- Programming
---

[比赛链接](https://codeforces.com/contest/1845)
[官方题解](https://codeforces.com/blog/entry/117791)

做出了前2题，卡在第三题了。
Rating change: 1407 -> 1378

## [A. Forbidden Integer](https://codeforces.com/contest/1845/problem/A)

分类讨论。如果可以选1的话，那肯定可以组成任意数字。
如果不能的话，可以选2和3，也可以组成除1以外任意的数字。
如果只能选2的话，那么只能组成偶数。

时间复杂度: O(t * n),

```python
t = int(input())

for _ in range(t):
    n, k, x = map(int, input().split())

    if x == 1:
        if k == 1:
            print('NO')
            continue
        elif k == 2:
            if n % 2 == 0:
                print('YES')
                print(n//2)
                for _ in range(n//2):
                    print(2, end=' ')
                print()
            else:
                print('NO')
                continue
        else:
            print('YES')
            print(n//2)
            while n > 3:
                print(2, end=' ')
                n -= 2
            print(n)
    else:
        print('YES')
        print(n)
        for _ in range(n):
            print(1, end=' ')
        print()
```

## [B. Come Together](https://codeforces.com/contest/1845/problem/B)

分类讨论，B，C 在不同象限，最长公用路线不同。

时间复杂度: O(t),
空间复杂度: O(1).

```python
t = int(input())

for _ in range(t):
    A = list(map(int, input().split()))
    B = list(map(int, input().split()))
    C = list(map(int, input().split()))
    B[0] = B[0] - A[0]
    B[1] = B[1] - A[1]
    C[0] = C[0] - A[0]
    C[1] = C[1] - A[1]

    # if B and C are in the same quadrant
    if (B[0] * C[0] > 0 and B[1] * C[1] > 0) \
        or (B[0] * C[0] == 0 and B[1] * C[1] > 0) \
        or (B[0] * C[0] > 0 and B[1] * C[1] == 0):
        print(min(abs(B[0]), abs(C[0])) + 1 + min(abs(B[1]), abs(C[1])) + 1 - 1)
    elif B[0] * C[0] <= 0 and B[1] * C[1] > 0: # the same side but different quadrant
        print(min(abs(B[1]), abs(C[1])) + 1)
    elif B[0] * C[0] > 0 and B[1] * C[1] <= 0: # the same side but different quadrant
        print(min(abs(B[0]), abs(C[0])) + 1)
    else: # opposite quadrant
        print(1)
```

## [C. Strong Password](https://codeforces.com/contest/1845/problem/C#)

暴力方法很简单，回溯枚举所有符合l, r限制的密码，然后判断是否是s的子序列。
然而，回溯这步时间复杂度就是对数的了。

正确的解法是贪心，对于每个位置，尽量取其在s中最靠右的数。
时间复杂度: O(m*D + n), n = s.length, D = r_i - l_i = 10