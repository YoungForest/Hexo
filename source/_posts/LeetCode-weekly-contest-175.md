---
title: LeetCode weekly contest 175
date: 2020-02-09 15:46:26
tags:
- LeetCode
categories:
- Programming
---

本周由于眼镜坏掉了，不在状态。在家吃饭也晚，所以题目并没有做完。

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 1378 / 7826 |	YoungForest | 	7	 | 0:11:41 | 0:06:51 | 0:11:41 | null | null |


## 1346. Check If N and Its Double Exist

使用一个hashmap存储之前见到过的数即可。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    bool checkIfExist(vector<int>& arr) {
        unordered_set<int> s;
        for (int i : arr) {
            if (s.find(i * 2) != s.end() || (i % 2 == 0 && s.find(i / 2) != s.end()))
                return true;
            s.insert(i);
        }
        return false;
    }
};
```

## 1347. Minimum Number of Steps to Make Two Strings Anagram

根据Anagram的定义，我们统计2个字符串中各个字符出现频数之差就可以了。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
    vector<int> convert(const string& s) {
        vector<int> ans(26);
        for (char c : s) {
            ++ans[c - 'a'];
        }
        return ans;
    }
public:
    int minSteps(string s, string t) {
        auto count_s = convert(s);
        auto count_t = convert(t);
        int ans = 0;
        for (int i = 0; i < 26; ++i) {
            if (count_s[i] > count_t[i]) {
                ans += count_s[i] - count_t[i];
            }            
        }
        return ans;
    }
};
```

## 1348. Tweet Counts Per Frequency

使用TreeMap记录Tweet即可。
需要注意记录区间分割的点，根据这些分割点寻找里面的Tweet。

时间复杂度:
- recordTweet: O(log N)
- getTweetCountsPerFrequency: O(N * log N * (endTime - startTime) / interval)
空间复杂度:
- O(N)

```cpp
class TweetCounts {
    unordered_map<string, map<int, int>> string_map;
public:
    TweetCounts() {
        
    }
    void recordTweet(string tweetName, int time) {
        ++string_map[tweetName][time];
    }
    
    vector<int> getTweetCountsPerFrequency(string freq, string tweetName, int startTime, int endTime) {
        int interval = 0;
        if (freq == "hour") {
            interval = 3600;
        } else if (freq == "day") {
            interval =  3600 * 24;
        } else {
            interval = 60;
        }
        const auto& m = string_map[tweetName];
        vector<int> ans;
        int st = startTime;
        auto start_it = m.lower_bound(st);
        auto end_it = m.upper_bound(endTime);
        auto it = start_it;
        while (st <= endTime) {
            auto next_it = m.lower_bound(st + interval);
            int accu = 0;
            for (; it != next_it && it != end_it; ++it) {
                accu += it->second;
            }
            ans.push_back(accu);
            st += interval;
        }
        
        return ans;
    }
};

/**
 * Your TweetCounts object will be instantiated and called as such:
 * TweetCounts* obj = new TweetCounts();
 * obj->recordTweet(tweetName,time);
 * vector<int> param_2 = obj->getTweetCountsPerFrequency(freq,tweetName,startTime,endTime);
 */
```

## 1349. Maximum Students Taking Exam

一道还挺难的题目，看了[花花酱](https://www.bilibili.com/video/av88416735)的视频后才学会正确的解法，在这里友情打一波广告。
动态规划 和 状态压缩。

这里有几个bitmask的技巧:
- 左右不能有学生: (x & (x >> 1)) == 0
- 左上不能有学生: (a & (b >> 1)) == 0
- 根据座椅枚举所有的状态: state_enum = state & (state_enum - 1)

时间复杂度: O(m * 2 ^ n * 2 ^ n),
空间复杂度: O(m * 2 ^ n) -> O(2 ^ n).

```cpp
class Solution {
    bool left_and_right(int a) {
        return (a & (a >> 1)) == 0;
    }
    bool ok(int a, int b) {
        return left_and_right(b) && left_and_right(b) && (a & (b >> 1)) == 0 && (b & (a >> 1)) == 0;
    }
public:
    int maxStudents(vector<vector<char>>& seats) {
        const int m = seats.size();
        const int n = seats[0].size();
        
        vector<vector<int>> dp(m + 1, vector<int> (1 << n));
        int last_state = 0;
        
        for (int row = 0; row < m; ++row) {
            auto& last_row = dp[row];
            auto& current_row = dp[row + 1];
            int state = 0;
            for (int col = 0; col < n; ++col) {
                state |= seats[row][col] == '.' ? (1 << col) : 0;
            }
            for (int last_state_enum = last_state; ; last_state_enum = last_state & (last_state_enum - 1)) {
                for (int state_enum = state; ; state_enum = state & (state_enum - 1)) {
                    if (ok(last_state_enum, state_enum)) {
                        current_row[state_enum] = max(current_row[state_enum], last_row[last_state_enum] +  __builtin_popcount(state_enum));
                    }
                    if (state_enum == 0) {
                        break;
                    }
                }
                if (last_state_enum == 0) {
                    break;
                }
            }
            
            last_state = state;
        }
        
        return *max_element(begin(dp[m]), end(dp[m]));
    }
};
```