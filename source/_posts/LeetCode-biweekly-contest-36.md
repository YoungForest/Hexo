---
title: LeetCode biweekly contest 36
date: 2020-10-06 09:29:23
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (6) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 1667 / 8332 | YoungForest | 7 | 0:15:37 | 0:01:46 | 0:15:37 | null | null |

这次双周赛有跪了，生活真是起起落落落落...三四题其实还是有机会做出来的，但比赛时状态不好，决策有失误。在第3题看了2分钟没思路时转到第四题了，然后第四题想复杂了，实现花了不少时间，最后还是被卡时间TLE了。

## 1603. Design Parking System

签到题。维护各个类型剩余车位数即可。

```cpp
class ParkingSystem {
    array<int, 4> cnt;
public:
    ParkingSystem(int big, int medium, int small) {
        cnt[1] = big;
        cnt[2] = medium;
        cnt[3] = small;
    }
    
    bool addCar(int carType) {
        if (cnt[carType] > 0) {
            --cnt[carType];
            return true;
        } else return false;
    }
};

/**
 * Your ParkingSystem object will be instantiated and called as such:
 * ParkingSystem* obj = new ParkingSystem(big, medium, small);
 * bool param_1 = obj->addCar(carType);
 */
```

时间复杂度: O(addCar calls),
空间复杂度: O(1).

## 1604. Alert Using Same Key-Card Three or More Times in a One Hour Period

先按时间进行排序，然后依次遍历，记录每个人进入的时间，检查最后3次进入是否处于同一个小时。

```cpp
class Solution {
public:
    vector<string> alertNames(vector<string>& keyName, vector<string>& keyTime) {
        using pss  = pair<string, string>;
        set<string> ans;
        const int n = keyName.size();
        vector<pss> records;
        records.reserve(n);
         for (int i = 0; i < n; ++i) {
             records.emplace_back(keyTime[i], keyName[i]);
         }
        sort(records.begin(), records.end());
        int hour = 0;
        unordered_map<string, vector<string>> enter;
        auto convert2int = [&](const string& x) -> int {
            int h = stoi(x.substr(0, 2));
            int m = stoi(x.substr(3));
            return h * 60 + m;
        };
        auto check = [&](const string& x) -> bool {
            if (enter[x].size() < 3) return false;
            else {
                int a = convert2int(enter[x][enter[x].size() - 1]);
                int b = convert2int(enter[x][enter[x].size() - 2]);
                int c = convert2int(enter[x][enter[x].size() - 3]);
                return a - c <= 60;
            }
        };
        for (int i = 0; i < n; ++i) {
            enter[records[i].second].push_back(records[i].first);
            if (check(records[i].second)) {
                ans.insert(records[i].second);
            }
        }
        return {ans.begin(), ans.end()};
    }
};
```

时间复杂度: O(N log N * nameLength),
空间复杂度: O(N).

## 1605. Find Valid Matrix Given Row and Column Sums

贪心。对于每个位置，选择行列和小的那个，可以证明最后一定可以得到解。

```cpp
class Solution {
public:
    vector<vector<int>> restoreMatrix(vector<int>& rowSum, vector<int>& colSum) {
        const int rows = rowSum.size(), cols = colSum.size();
        vector<vector<int>> ans(rows, vector<int>(cols, 0));
        for (int i = 0; i < rows; ++i) {
            for (int j = 0; j < cols; ++j) {
                ans[i][j] = min(rowSum[i], colSum[j]);
                rowSum[i] -= ans[i][j];
                colSum[j] -= ans[i][j];
            }
        }
        return ans;
    }
};
```

时间复杂度: O(rows * cols),
空间复杂度: O(rows * cols).

## 1606. Find Servers That Handled Most Number of Requests

用一个 set 维护可用server。用priority_queue维护server变空闲时间，并更新set。

```cpp
class Solution {
public:
    vector<int> busiestServers(int k, vector<int>& arrival, vector<int>& load) {
        set<int> availble;
        for (int i = 0; i < k; ++i) {
            availble.insert(i);
        }
        using pii = pair<int, int>;
        priority_queue<pii, vector<pii>, greater<pii>> pq;
        vector<int> cnt(k, 0);
        for (int i = 0; i < arrival.size(); ++i) {
            const int time = arrival[i];
            while (!pq.empty() && pq.top().first <= time) {
                availble.insert(pq.top().second);
                pq.pop();
            }
            if (availble.empty()) continue;
            const int j = i % k;
            auto it = availble.lower_bound(j);
            if (it == availble.end()) {
                it = availble.begin();
            }
            ++cnt[*it];
            pq.push({arrival[i] + load[i], *it});
            availble.erase(it);
        }
        const int maxRequests = *max_element(cnt.begin(), cnt.end());
        vector<int> ans;
        for (int i = 0; i < cnt.size(); ++i) {
            if (cnt[i] == maxRequests) {
                ans.push_back(i);
            }
        }
        return ans;
    }
};
```

时间复杂度: O(arrival.size() * k),
空间复杂度: O(k).