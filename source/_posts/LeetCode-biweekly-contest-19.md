---
title: LeetCode biweekly contest 19
date: 2020-02-10 11:30:20
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 179 / 3745 |	YoungForest | 18 | 0:41:10 | 0:02:39 | 0:10:36 |  0:12:53  | 0:36:10 1 |

回国后第一次参加双周赛，手有些生，状态还在恢复。最近因为新型冠状病毒的瘟疫，一直在家隔离，除了买菜外几乎无法出门。今年的年味也因此没有了。我在家呆的几乎都快产后抑郁了。比赛结果还行。手速场也是我一直不擅长的类型。

## 1342. Number of Steps to Reduce a Number to Zero

签到题。直接模拟 除2 和 减一 的2中操作即可。

时间复杂度: O(log N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int numberOfSteps (int num) {
        int step = 0;
        while (num > 0) {
            if (num % 2 == 0) {
                num /= 2;
            } else {
                --num;
            }
            ++step;
        }
        return step;
    }
};
```

## 1343. Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold

简单的滑动窗口，可以直接套用模版。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int numOfSubarrays(vector<int>& arr, int k, int threshold) {
        int ans = 0;
        int s = 0;
        for (int i = 0; i < k; ++i) {
            s += arr[i];
        }
        if (s >= threshold * k) {
            ++ans;
        }
        for (int i = k; i < arr.size(); ++i) {
            s = s + arr[i] - arr[i - k];
            if (s >= threshold * k) {
                ++ans;
            }
        }
        
        return ans;
    }
};
```

## 1344. Angle Between Hands of a Clock

计算钟表上时针和分针之间的角度。分别计算时针和分针的位置，然后算夹角即可。

时间复杂度: O(1),
空间复杂度: O(1).

```cpp
class Solution {
public:
    double angleClock(int hour, int minutes) {
        double h = hour;
        double m = minutes;
        h = h * 5 + m / 12;
        double x = abs(h - m) * 6;
        if (x >= 180) {
            return 360 - x;
        } else {
            return x;
        }
    }
};
```

## 1345. Jump Game IV

又一道Jump Game的题目，本以为和之前一样都要用动态规划。尝试一次后，发现其实需要用BFS解决。
有一点需要注意的是，每次用过reverse数组后，需要把数组清空，这样就不会导致重复的计算。感谢[hiepit的帖子](https://leetcode.com/problems/jump-game-iv/discuss/502699/JavaC%2B%2B-BFS-Solution-Clean-code-O(N))。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
    const int INF = 0x3f3f3f3f;
public:
    int minJumps(vector<int>& arr) {
        if (arr.size() <= 1) return 0;
        int target = arr.size() - 1;
        unordered_map<int, vector<int>> reverse;
        for (int i = arr.size() - 1; i >= 0; --i) {
            reverse[arr[i]].push_back(i);
        }
        queue<int> q;
        q.push(0);
        unordered_set<int> seen;
        seen.insert(0);
        int step = 1;
        while (!q.empty()) {
            int s = q.size();
            for (int i = 0; i < s; ++i) {
                int index = q.front();
                q.pop();
                auto& condidates = reverse[arr[index]];
                condidates.push_back(index + 1);
                condidates.push_back(index - 1);
                for (int next : condidates) {
                    if (next == target)
                        return step;
                    if (next < arr.size() && next >= 0 && seen.find(next) == seen.end()) {
                        seen.insert(next);
                        q.push(next);
                    }
                }
                condidates.clear(); // important, avoid duplicated computing
            }
            ++step;
        }
        return -1;
    }
};
```