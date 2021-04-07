---
title: LeetCode weekly contest 149
date: 2019-08-11 12:34:32
tags:
- Competitive Programming
categories:
- LeetCode
---
| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (6) |	Q4 (9)|
|--|--|--|--|--|--|--|--|
| 476 / 5091 |	YoungForest | 15	 | 	1:00:14 | 0:10:21  | 0:42:14 | 1:00:14 | null |

惭愧的排名又落到400+了。最后一题有半个小时可以解决，一直试图用线段树来做。像kick start round D一样，沉迷于线段树而翻车。获得的教训是，不要纠结与区间问题一定要用线段树做，常常还有其他更简单的做法。

## 1154. Day of the Year

判断闰年，累加之前月份的日子。
时间复杂度: O(1),
空间复杂度: O(1).

```cpp
class Solution {
    bool isLeap(int yy) {
        return (yy % 4 == 0 && yy % 100 != 0) || yy % 400 == 0;
    }
public:
    int dayOfYear(string date) {
        auto yy = stoi(date.substr(0, 4));
        auto mm = stoi(date.substr(5, 2));
        auto dd = stoi(date.substr(8, 2));
        vector<int> days = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        if (isLeap(yy)) {
            days[2] = 29;
        }
        int ans = 0;
        ans += accumulate(days.cbegin(), days.cbegin() + mm, 0);
        ans += dd;
        return ans;
    }
};
```

## 1155. Number of Dice Rolls With Target Sum

隔板插空，经典的排列组合问题。由于2个隔板之前的间隔不能大于骰子最大的数字，所以不能直接用数学公式求解。我采用了回溯法，使用了memorization，所以也算是DP。

时间复杂度: O(N ^ 2),
空间复杂度: O(d * bar).

```cpp
class Solution {
    const int mod = 1e9 + 7;
    int f;
    map<pair<int, int>, int> memo;
    // [begin, end), the index of insert bar
    int backtracking(int begin, int end, int bar) {
        if (memo.find({begin, bar}) != memo.end()) {
            return memo[{begin, bar}];
        }
        if (bar == 0) {
            if (end - begin + 1 <= f)
                return 1;
            else
                return 0;
        }
        int ans = 0;
        for (int i = begin; i < end && i - begin + 1 <= f; ++i) {
            // insert in i
            ans += backtracking(i + 1, end, bar - 1);
            ans %= mod;
        }
        memo[{begin, bar}] = ans;
        return ans;
    }
public:
    int numRollsToTarget(int d, int f, int target) {
        this->f = f;
        int ans = backtracking(0, target - 1, d - 1);
        return ans;
    }
};
```

## 1156. Swap For Longest Repeated Character Substring

One pass, 更新可以获得的最长长度。
需要观察到: 最长长度的获得和中间空的字母无关，而只和前后有无需要的字母有关。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int maxRepOpt1(string text) {
        vector<vector<pair<int, int>>> v(26);
        char last = ' ';
        for (int i = 0; i < text.size(); ++i) {
            if (text[i] == last) {
                v[text[i] - 'a'].back().second = i + 1;
            } else {
                v[text[i] - 'a'].push_back({i, i + 1});
            }
            last = text[i];
        }
        int ans = 0;
        for (const auto& row : v) {
            for (int i = 0; i < row.size(); ++i) {
                if (i + 1 == row.size()) {
                    if (row.size() == 1)
                        ans = max(ans, row[i].second - row[i].first);
                    else
                        ans = max(ans, row[i].second - row[i].first + 1);
                } else {
                    const auto& a = row[i];
                    const auto& b = row[i + 1];
                    if (a.second + 1 == b.first) {
                        if (row.size() > 2) {
                            ans = max(ans, a.second - a.first + b.second - b.first + 1);
                        } else {
                            ans = max(ans, a.second - a.first + b.second - b.first);
                        }
                    } else {
                        ans = max(ans, a.second - a.first + 1);
                    }
                }
            }
        }
        return ans;
    }
};
```

## 1157. Online Majority Element In Subarray

random pick + binary search.

时间复杂度: O(log N).
空间复杂度: O(N).

```cpp
class MajorityChecker {
    unordered_map<int, vector<int>> appear_index;
    vector<int> arr;
public:
    MajorityChecker(vector<int>& arr) {
        for (int i = 0; i < arr.size(); ++i) {
            appear_index[arr[i]].push_back(i);
        }
        this->arr = arr;
    }
    
    int query(int left, int right, int threshold) {
        std::random_device dev;
        std::mt19937 rng(dev());
        std::uniform_int_distribution<std::mt19937::result_type> dist6(left,right); // distribution in range [left, right]
        for (int i = 0; i < 20; ++i) {
            int a = arr[dist6(rng)];
            const auto& index = appear_index[a];
            auto l = lower_bound(index.cbegin(), index.cend(), left);
            auto r = upper_bound(index.cbegin(), index.cend(), right);
            if (r - l >= threshold) {
                return a;
            }
        }
        return -1;
    }
};

/**
 * Your MajorityChecker object will be instantiated and called as such:
 * MajorityChecker* obj = new MajorityChecker(arr);
 * int param_1 = obj->query(left,right,threshold);
 */
```
