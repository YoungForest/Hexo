---
title: 'LeetCode #906 Super Palindromes'
tags:
categories:
- LeetCode
---

```python
class Solution:
    def superpalindromesInRange(self, L, R):
        """
        :type L: str
        :type R: str
        :rtype: int
        """
        ret = 0
        
        def isPalindrome(s):
            for i in range(len(s) // 2):
                if s[i] != s[len(s) - i - 1]:
                    return False
                
            return True
        
        for i in range(math.ceil(math.sqrt(int(L))), math.ceil(math.sqrt(int(R)))):
            if isPalindrome(str(i)) and isPalindrome(str(i*i)):
                ret += 1
                
        return ret
```

时间复杂度 O(n^0.5 log n)，for遍历sqrt(n)次，判断回文数和数字的长度log n成正比；
空间复杂度 O(1)。

## 打表

时间复杂度 O(1),
空间复杂度 O(1)。
因为L和R的范围是固定的[1, 10^18]。

```python
class Solution:
    def superpalindromesInRange(self, L, R):
        """
        :type L: str
        :type R: str
        :rtype: int
        """
        table = [1, 2, 3, 11, 22, 101, 111, 121, 202, 212, 1001, 1111, 2002, 10001, 10101, 10201, 11011, 11111, 11211, 20002, 20102, 100001, 101101, 110011, 111111, 200002, 1000001, 1001001, 1002001, 1010101, 1011101, 1012101, 1100011, 1101011, 1102011, 1110111, 1111111, 2000002, 2001002, 10000001, 10011001, 10100101, 10111101, 11000011, 11011011, 11100111, 11111111, 20000002, 100000001, 100010001, 100020001, 100101001, 100111001, 100121001, 101000101, 101010101, 101020101, 101101101, 101111101, 110000011, 110010011, 110020011, 110101011, 110111011, 111000111, 111010111, 111101111, 111111111, 200000002, 200010002]
        lo = 0
        
        for i in range(len(table)):
            if table[i]**2 >= int(L):
                lo = i
                break
        
        hi = len(table)
        for i in range(lo, len(table)):
            if table[i]**2 > int(R):
                hi = i
                break
                
        return hi - lo
```