---
title: LeetCode-biweekly-contest-48
date: 2021-03-21 16:55:34
tags:
- LeetCode
categories:
- Programming
---

昨晚和女朋友KFC，耽误了比赛，赛后补题。

## 1796. Second Largest Digit in a String

签到题。统计所有的数字，再从大到小找第二大的。

```cpp
class Solution {
public:
    int secondHighest(string s) {
        vector<int> cnt(10, 0);
        for (char c : s) {
            if(isdigit(c)) {
                ++cnt[c - '0'];
            }
        }
        int maxNumber = -1;
        for (int i = 9; i >= 0; --i) {
            if (cnt[i] > 0) {
                if (maxNumber == -1) {
                    maxNumber = i;
                } else {
                    return i;
                }
            }
        }
        return -1;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 1797. Design Authentication Manager

用字典存储每一个`tokenId`的`expired time`.

```cpp
class AuthenticationManager {
    int timeToLive;
    unordered_map<string, int> expiredTime;
public:
    AuthenticationManager(int _timeToLive) : timeToLive(_timeToLive) {
        
    }
    
    void generate(string tokenId, int currentTime) {
        expiredTime[tokenId] = currentTime + timeToLive;
    }
    
    void renew(string tokenId, int currentTime) {
        auto it = expiredTime.find(tokenId);
        if (it != expiredTime.end() && it->second > currentTime) {
            generate(tokenId, currentTime);
        }
    }
    
    int countUnexpiredTokens(int currentTime) {
        int ans = 0;
        for (const auto& p : expiredTime) {
            if (p.second > currentTime) {
                ++ans;
            }
        }
        return ans;
    }
};

/**
 * Your AuthenticationManager object will be instantiated and called as such:
 * AuthenticationManager* obj = new AuthenticationManager(timeToLive);
 * obj->generate(tokenId,currentTime);
 * obj->renew(tokenId,currentTime);
 * int param_3 = obj->countUnexpiredTokens(currentTime);
 */
```

时间复杂度:
- generate: O(1),
- renew: O(1),
- countUnexpiredTokens: O(expiredTime.size())
空间复杂度:
- O(expiredTime.size())


## 1798. Maximum Number of Consecutive Values You Can Make

Brute-force: O(N^2), TLE.

```cpp
class Solution {
public:
    int getMaximumConsecutive(vector<int>& coins) {
        // max : sum(coins)
        // determine(X): O(N * X)
        // 2 ^ n, 
        // 1 + 2 + 3 + .. + n
        unordered_set<int> s;
        s.insert(0);
        for (int i : coins) {
            auto ns = s;
            for (int x : s) {
                ns.insert(x + i);
            }
            s = move(ns);
        }
        for (int i = 0; ; ++i) {
            if (s.find(i) == s.end()) return i;
        }
        return -1;
    }
};
```

## 1799. Maximize Score After N Operations