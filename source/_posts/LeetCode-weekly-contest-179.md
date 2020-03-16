---
title: LeetCode weekly contest 179
date: 2020-03-08 13:54:54
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 539 / 6242 |	YoungForest | 18 | 	1:09:53 | 0:05:43 | 0:13:09 | 0:24:01 | 1:04:53  1 |

## 1374. Generate a String With Characters That Have Odd Counts

如果n为偶数，则一个a，剩下都为b；
如果n为奇数，则全为a.

时间复杂度: O(n),
空间复杂度: O(n).

之前写代码从来不过重注意输入的合法性检查。因为Leetcode本身对输入有限制。但是现实面试的时候，面试官有时会关注你对输入的预设和检查，毕竟实际生产过程中的输入永远是无法预料的。

```cpp
class Solution {
public:
    string generateTheString(int n) {
        if (n <= 0) return "";
        string ans;
        if (n % 2 == 1) {
            ans.append(n, 'a');
        } else {
            ans.push_back('a');
            ans.append(n - 1, 'b');
        }
        return  ans;
    }
};
```

## 1375. Bulb Switcher III

观察有：蓝色灯永远是前连续个，意味着蓝色灯的状态可以用index最高的灯表示，同时这个index是单调非递减的。所以只需要比较它和最大亮着的灯的下标是否相同即可。且每次亮灯都试图增大这个`blue_index`。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int numTimesAllBlue(vector<int>& light) {
        int max_turn_on_index = -1;
        int blue_index = -1;
        const int n = light.size();
        vector<bool> turn_on(n);
        int ans = 0;
        for (int i : light) {
            turn_on[i - 1] = true;
            max_turn_on_index = max(max_turn_on_index, i - 1);
            while (blue_index + 1 < n && turn_on[blue_index +  1] == true) {
                ++blue_index;
            }
            if (blue_index == max_turn_on_index)
                ++ans;
        }
        return ans;
    }
};
```

## 1376. Time Needed to Inform All Employees

典型的dfs，每次寻找最长时间通知完的下属。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int numOfMinutes(int n, int headID, vector<int>& manager, vector<int>& informTime) {
        unordered_map<int, vector<int>> graphs;
        for (int i = 0; i < manager.size(); ++i) {
            graphs[manager[i]].push_back(i);
        }
        if (graphs[-1].empty()) return 0;
        int head = graphs[-1][0];
        function<int(int)> dfs = [&](int index) -> int {
            if (graphs[index].empty())
                return 0;
            else {
                int ans = 0;
                for (int subordinate : graphs[index]) {
                    ans = max(ans, dfs(subordinate));
                }
                return ans + informTime[index];
            }
        };
        
        return dfs(head);
    }
};
```

## 1377. Frog Position After T Seconds

同样是DFS, 需要注意的是，我们要寻找的是经过`t`秒后的位置。所以有可能跳过`target`，概率为0。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    double frogPosition(int n, vector<vector<int>>& edges, int t, int target) {
        unordered_map<int, set<int>> graphs;
        for (const auto& e : edges) {
            graphs[e[0]].insert(e[1]);
            graphs[e[1]].insert(e[0]);
        }
        graphs[1].insert(0);
        int ans = 0;
        unordered_set<int> visited;
        visited.insert(0);
        function<bool(int,int,int)> dfs = [&](int index, int probability, int time) -> bool {
            visited.insert(index);
            if (time > t)
                return false;
            if (index == target) {
                if (time == t)
                    ans = probability;
                else {
                    if (graphs[index].size() <= 1)
                        ans = probability;
                    else
                        ans = 0;
                    // cout << ans << " " << probability << endl;
                }
                return true;
            } else {
                for (int neighbor : graphs[index]) {
                    if (visited.find(neighbor) == visited.end())
                        if (dfs(neighbor, probability * (graphs[index].size() - 1), time + 1))
                            return true;
                }
                return false;
            }
        };
        dfs(1, 1, 0);
        // cout << ans << endl;
        return ans > 0 ? 1.0 / ans : 0;
    }
};
```