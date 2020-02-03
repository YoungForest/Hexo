---
title: LeetCode biweekly contest 14
date: 2019-12-14 16:12:29
tags:
- LeetCode
categories:
- Programming
---

这周没有出去玩，恰好遇到双周赛。久违地参加了一场，确实难得。
本次双周赛都是常规题目，不难。我提前50min全部一次AC, 典型的手速场。

| Rank |	Name |	Score |	Finish Time | 	Q1 (2) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 119 / 2503 |	YoungForest | 18 | 0:39:28 | 0:02:18 | 0:08:49 |  0:21:07  | 0:39:28 |

比赛结束之前的排名是92，参与人数为1900，赛后发现名次掉了。我猜测并验证是，赛后的排名把中国区的人也算进来了。增加的人数和第一名的变化完全符合我的猜测。到leetcode-cn上看了下，那里的排名是分为中国区和全球区的。看来以后比赛时要更加油了，有许多不知道的人在中国区打同样的比赛。

## 5126. Element Appearing More Than 25% In Sorted Array

One pass统计所有数的出现次数。
时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int findSpecialInteger(vector<int>& arr) {
        unordered_map<int, int> count;
        const int target = arr.size() / 4;
        for (int i : arr) {
            ++count[i];
            if (count[i] > target)
                return i;
        }
        return -1;
    }
};
```

这个解法的缺陷在于没有利用题目中给的限制条件，数组是已经排好序的。但本题是签到题，数据规模10^4，此解法方便快速实现。

更优的解法，利用二分搜索，每次可以递增的更快些。
时间复杂度: O(N log N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int findSpecialInteger(vector<int>& arr) {
        auto it = arr.begin();
        while (it != arr.end()) {
            auto it2 = upper_bound(it, arr.end(), *it);
            auto diff = it2 - it;
            if (diff > arr.size() / 4)
                return *it;
            it = it2;
        }
        return -1;
    }
};
```

## 5127. Remove Covered Intervals

数据规模为1000，所以O(N ^ 2)的解法就可以过。
最暴力的方法就是两两比较，该remove的remove。
我的代码还使用了一个技巧，先按区间大小排序，然后从大到小开始比较。因为小的不可能包含大的，减少了比较数量。虽然时间复杂度不变，但会在常数上稍快些。

时间复杂度: O(N ^ 2),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int removeCoveredIntervals(vector<vector<int>>& intervals) {
        set<pair<int, int>> remains;
        sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) -> bool {
            int length_a = a[1] - a[0];
            int length_b = b[1] - b[0];
            return length_b < length_a;
        });
        for (auto& v : intervals) {
            for (auto p : remains) {
                if (p.first <= v[0] && v[1] <= p.second) {
                    goto remove;
                }
            }
            remains.insert({v[0], v[1]});
            remove:;
        }
        return remains.size();
    }
};
```

更优的解法。先排序，排序规则为 区间左侧小的靠前，如果左侧相等，则右侧大的靠前。
然后One pass遍历一边即可, 比较当前的右侧和之前最大的右侧的值。

时间复杂度: O(N log N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int removeCoveredIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(), [](auto& a, auto& b)  -> bool {
            if (a[0] != b[0]) {
                return a[0] < b[0];
            } else {
                return a[0] > b[0];
            }
        });
        int right = 0;
        int ans = 0;
        for (auto& v : intervals) {
            if (v[1] > right) {
                ++ans;
            }
            right = max(right, v[1]);
        }
        return  ans;
    }
};
```

## 5123. Iterator for Combination

最暴力的方法是用回溯法生成所有的组合，存起来，然后封装迭代器。缺点是：空间消耗会比较大；在next调用次数小的时候，速度上没有懒运算经济。无奈我不知道C++中如何实现 Python 的 `yield`，否则就可以懒运算了。
当然，赛后有时间我还是研究了下C++ yield的实现策略。
参考: [C++ yield实现](how C++ implement yield)

时间复杂度: O(C^n_characters.size()),
空间复杂度: O(combinationLength * C^n_characters.size()).

```cpp
class CombinationIterator {
    void backtracking(vector<string>& results, string& current, int remain, const string& characters, int index) {
        if (remain == 0) {
            results.push_back(current);
            return;
        }
        if (index == characters.size()) {
            return;
        }
        if (remain > characters.size() - index) {
            return;
        }
        // add
        current.push_back(characters[index]);
        backtracking(results, current, remain - 1, characters, index + 1);
        current.pop_back();
        // not add
        backtracking(results, current, remain, characters, index + 1);
    }
    vector<string> results;
    int index = 0;
public:
    CombinationIterator(string characters, int combinationLength) {
        string current;
        backtracking(results, current, combinationLength, characters, 0);
    }
    
    string next() {
        return results[index++];
    }
    
    bool hasNext() {
        return index < results.size();
    }
};

/**
 * Your CombinationIterator object will be instantiated and called as such:
 * CombinationIterator* obj = new CombinationIterator(characters, combinationLength);
 * string param_1 = obj->next();
 * bool param_2 = obj->hasNext();
 */
```

## 5129. Minimum Falling Path Sum II

和[Minimum Falling Path Sum I](https://leetcode.com/problems/minimum-falling-path-sum/)一样，属于 DP 问题。
状态转移方程为:
`dp[row][column] = arr[row][column] + min(dp[row - 1][last_column] for last_column in [0, column_size) and last_column != column)`.
而且实现寻找上一层的最小值并不需要多一层循环，只需要保存上一层中最小值和次小值即可。

时间复杂度: O(row_size * column_size),
空间复杂度: O(row_size * column_size)，另一个明显的优化是dp只需要保存上一层的，可以减小到O(column_size).

```cpp
class Solution {
    const int MAX_N = 0x3f3f3f3f;
public:
    int minFallingPathSum(vector<vector<int>>& arr) {
        const int row_size = arr.size();
        const int column_size = arr[0].size();
        vector<vector<int>>  dp(row_size, vector<int> (column_size, 0));
        int row = 0;
        int min_first = MAX_N, min_second = MAX_N;
        for (int column = 0; column < column_size; ++column) {
            dp[row][column] = arr[row][column];
            if (dp[row][column] < min_first) {
                min_second  = min_first;
                min_first = dp[row][column];
            } else if (dp[row][column] < min_second) {
                min_second = dp[row][column];
            }
            // cout << dp[row][column] << " ";
        }
        // cout << " | " << min_first << " " << min_second;
        // cout << endl;
        int last_row_min_first = min_first;
        int last_row_min_second = min_second;
        for (row = 1; row < row_size; ++row) {
            min_first = min_second = MAX_N;
            for (int column = 0; column < column_size; ++column) {
                if (dp[row - 1][column] == last_row_min_first) {
                    dp[row][column] = last_row_min_second + arr[row][column];
                } else {
                    dp[row][column] = last_row_min_first + arr[row][column];
                }           
                if (dp[row][column] < min_first) {
                    min_second  = min_first;
                    min_first = dp[row][column];
                } else if (dp[row][column] < min_second) {
                    min_second = dp[row][column];
                }
                // cout << dp[row][column] << " ";
            }
            // cout << " | " << min_first << " " << min_second;
            // cout << endl;
            last_row_min_first = min_first;
            last_row_min_second = min_second;
        }
        return min_first;
    }
};
```