---
title: LeetCode weekly contest 159
date: 2019-10-21 09:29:11
tags:
- Competitive Programming
categories:
- LeetCode
---

## 1232. Check If It Is a Straight Line

依次检查3个点是否共线。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
    bool right(const vector<int>& p1, const vector<int>& p2, const vector<int>& p3) {
        return (p1[0] - p2[0]) * (p2[1] -  p3[1]) == (p1[1] - p2[1]) * (p2[0] - p3[0]);
    }
public:
    bool checkStraightLine(vector<vector<int>>& coordinates) {
        for (int i =   0; i + 2 < coordinates.size(); ++i) {
            if (!right(coordinates[i], coordinates[i + 1], coordinates[i + 2])) {
                return  false;
            }
        }
        return true;
    }
};
```

## 1233. Remove Sub-Folders from the Filesystem

用一个HashSet记录出现过的路径，再遍历所有路径，依次分解每层的父目录，判断是否再记录中即可。

时间复杂度: O(folder.size() * string.size()),
空间复杂度: O(folder.size() * string.size()).

```cpp
class Solution {
public:
    vector<string> removeSubfolders(vector<string>& folder) {
        unordered_set<string> memo;
        for (auto& f : folder) {
            memo.insert(f);
        }
        vector<string> ans;
        for (auto& f : folder) {
            int i = f.size() - 1;
            bool appear = false;
            while (i >= 0) {
                while (i >= 0 && f[i] != '/') {
                    --i;
                }
                auto head = f.substr(0, i);
                if (memo.find(head) != memo.end()) {
                    appear = true;
                    break;
                }
                --i;
            }
            if (!appear) {
                ans.push_back(f);
            }
        }
        return ans;
    }
};
```

## 1234. Replace the Substring for Balanced String

滑动窗口。
记录所有多的字母，然后设置一个窗口使得多的字母出现字数多于多的次数。然后移动该窗口，保持窗口的特性(多的字母出现字数多于多的次数)不变。记录 窗口的最小长度。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
    using ll = long long;
public:
    int balancedString(string s) {
        auto charaters = {'Q', 'W', 'E', 'R'};
        unordered_map<char, ll> count;
        for (char c : s) {
            ++count[c];
        }
        ll target = s.size() / 4;
        ll window_size = 0;
        unordered_set<char> one;
        for (const auto& p : count) {
            // cout << p.first << ", " << p.second << endl;
            if (p.second > target) {
                window_size += p.second - target;
                one.insert(p.first);
            }
        }
        if (window_size == 0)
            return 0;
        ll i = 0;
        unordered_map<char, ll> one_amount;
        while (i < s.size()) {
            if (all_of(one.begin(), one.end(), [&](const auto& p) -> bool {
                return one_amount[p] >= count[p] - target;
            })) {
                break;
            }
            if (one.find(s[i]) != one.end()) {
                ++one_amount[s[i]];
            }
            ++i;
        }
        ll left = 0;
        while (left < s.size() && (one.find(s[left]) != one.end() && one_amount[s[left]] > count[s[left]] - target) || (one.find(s[left]) == one.end())) {
            --one_amount[s[left]];
            ++left;
        }
        ll ret = i - left;
        for (; i < s.size(); ++i) {
            if (one.find(s[i]) != one.end()) {
                ++one_amount[s[i]];
                while (left < s.size() && (one.find(s[left]) != one.end() && one_amount[s[left]] > count[s[left]] - target) || (one.find(s[left]) == one.end())) {
                    --one_amount[s[left]];
                    ++left;
                }
            }
            ret = min(ret, i - left + 1);
        }
        return ret;
    }
};
```

## 1235. Maximum Profit in Job Scheduling

类似背包问题。
先把job按照endTime排序，遍历每个job，加入或不加入，更新总的profit。
更新策略为：根据job的start_time 二分查找符合条件的 end_time，得到加入该job的最大收益。如果最大收益大于之前 end_time的最大收益（因为 事先已经根据end_time排好序了，所以可以保证job的end_time是获得最大收益的end_time，则更新profit。
最后返回最大的end_time的profit。

时间 复杂度: O(N log N),
空间 复杂度: O(N).

```
class Solution {
public:
    int jobScheduling(vector<int>& startTime, vector<int>& endTime, vector<int>& profit) {
        map<int, int> dp;
        dp[0] = 0;
        const int n = startTime.size();
        vector<tuple<int, int, int>> jobs(n);
        for (int i = 0; i < n; ++i) {
            jobs[i] = {endTime[i], startTime[i], profit[i]};
        }
        sort(jobs.begin(), jobs.end());
        for (const auto& job : jobs) {
            int cur = prev(dp.upper_bound(get<1>(job)))->second + get<2>(job);
            if (cur > dp.rbegin()->second) {
                dp[get<0>(job)] = cur;
            }
        }
        return dp.rbegin()->second;
    }
};
```