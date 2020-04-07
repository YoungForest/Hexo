---
title: LeetCode weekly contest 182
date: 2020-03-29 12:42:45
tags:
- LeetCode
categories:
- Programming
---


| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 727 / 11694 |	YoungForest | 12 | 	0:22:50 | 0:03:13 | 0:14:04 |  0:22:50 | null |

这周一加了一个LeetCode每日打卡和周赛群。每周出排名，末位发红包；每天做道指定题目，连续2天没做发红包，极其惊现刺激。[赛事排行榜](https://wisdompeak.github.io/lc-score-board/)。
本次比赛是入群以来的第一次，由于第四题太难了，总共也就一百人做出来。群里也只有5个人AC

## 1394. Find Lucky Integer in an Array

签到题。注意数据范围，统计frequency即可。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int findLucky(vector<int>& arr) {
        vector<int> count(501, 0);
        for (int i : arr) {
            ++count[i];
        }
        for (int i = 500; i >= 1; --i) {
            if (count[i] == i)
                return i;
        }
        return -1;
    }
};
```

## 1395. Count Number of Teams

由于数据规模很小，所以即使是枚举所有3元组的N^3的解法也能过。
在这里，我使用了DP, N^2复杂度的解法。如果使用order statistic tree的话，可以近一步降为N log N.

时间复杂度: O(N ^ 2),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int numTeams(vector<int>& rating) {
        auto f = [&](function<bool(int,int)> op) -> int {
            const int n = rating.size();
            vector<vector<int>> large(3, vector<int>(n, 1));
            int ans;
            for (int echo = 1; echo <= 2; ++echo) {
                ans = 0;
                for (int i = 0; i < n; ++i) {
                    large[echo][i] = 0;
                    for (int j = 0; j < i; ++j) {
                        if (op(rating[i], rating[j])) {
                            large[echo][i] += large[echo-1][j];
                        }
                    }
                    ans += large[echo][i];
                }
            }
            return ans;
        };
        return f(greater<int>()) + f(less<int>());
    }
};
```

## 1396. Design Underground System

straight forward.
用map记录每个站对的进出站总时间和人数。

时间复杂度：
- checkIn: O(1),
- checkOut: O(1 + log N),
- getAverageTime: O(log N).
空间复杂度: O(user.size() + station.size() ^ 2).

```cpp
class UndergroundSystem {
    unordered_map<int, pair<string, int>> user_checkin_time;    // 记录进站信息
    map<pair<string, string>, pair<int, int>> interval_total_time_person_count; // 记录2站之间流量的信息，总时间、人数
public:
    UndergroundSystem() {
        
    }
    
    void checkIn(int id, string stationName, int t) {
        user_checkin_time[id] = {stationName, t};
    }
    
    void checkOut(int id, string stationName, int t) {
        auto in = user_checkin_time[id];
        auto& interval = interval_total_time_person_count[{in.first, stationName}];
        interval.first += t - in.second;
        ++interval.second;
        user_checkin_time.erase(id);
    }
    
    double getAverageTime(string startStation, string endStation) {
        auto it = interval_total_time_person_count.find({startStation, endStation});
        if (it == interval_total_time_person_count.end())
            return -1;
        else
            return static_cast<double>(it->second.first) / it->second.second;
    }
};

/**
 * Your UndergroundSystem object will be instantiated and called as such:
 * UndergroundSystem* obj = new UndergroundSystem();
 * obj->checkIn(id,stationName,t);
 * obj->checkOut(id,stationName,t);
 * double param_3 = obj->getAverageTime(startStation,endStation);
 */
```

## 1397. Find All Good Strings