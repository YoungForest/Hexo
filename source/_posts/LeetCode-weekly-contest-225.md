---
title: LeetCode weekly contest 225
date: 2021-01-24 19:58:06
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 299 / 11282 | YoungForest | 18 | 1:16:19 | 0:05:09 | 0:18:06 | 0:29:04 |  1:11:19  1 |

## 1736. Latest Time by Replacing Hidden Digits

贪心。分析每位的情况，`if-else`解决。

```cpp
class Solution {
public:
    string maximumTime(string time) {
        if (time[4] == '?') {
            time[4] = '9';
        }
        if (time[3] == '?') {
            time[3] = '5';
        }
        if (time[1] == '?') {
            if (time[0] == '?') {
                time[0] = '2';
                time[1] = '3';
            } else if (time[0] == '2') {
                time[1] = '3';
            } else {
                time[1] = '9';
            }
        } else {
            if (time[0] == '?') {
                if (time[1] < '4') {
                    time[0] = '2';
                } else {
                    time[0] = '1';
                }
            }
        }
        return time;
    }
};
```

时间复杂度: O(1),
空间复杂度: O(1).

## 1737. Change Minimum Characters to Satisfy One of Three Conditions

计算每种目标情况。
1，2: 枚举分割点，变换超过分割点的不合适字符。
3: 找到众数即可。

```cpp
class Solution {
public:
    int minCharacters(string a, string b) {
        int ans = a.size() + b.size();
        auto calculatePresum = [&](const string& x) -> vector<int> {
            vector<int> ans(26, 0);
            for (char c : x) {
                ++ans[c - 'a'];
            }
            for (int i = 1; i < 26; ++i) {
                ans[i] += ans[i - 1];
            }
            return ans;
        };
        auto op12 = [&](const string& a, const string& b) -> void {
            // 26 * (a.size() + b.size())
            auto presumA = calculatePresum(a);
            auto presumB = calculatePresum(b);
            // b >= splitPoint, a < splitPoint
            for (int splitPoint = 1; splitPoint < 26; ++splitPoint) {
                int need = 0;
                // a need
                need += a.size() - presumA[splitPoint - 1];
                // b need
                need += presumB[splitPoint - 1];
                ans = min(ans, need);
            }
        };
        // 1, 2
        op12(a, b);
        op12(b, a);
        
        // 3
        // size 和 - 众数
        {
            unordered_map<char, int> cnt;
            for (char c : a) {
                ++cnt[c];
            }
            for (char c : b) {
                ++cnt[c];
            }
            int maxCnt = 0;
            for (auto p : cnt) {
                maxCnt = max(maxCnt, p.second);
            }
            ans = min(ans, static_cast<int>(a.size() + b.size()) - maxCnt);
        }
        return ans;
    }
};
```

时间复杂度: O(n + 26),
空间复杂度: O(26).

## 1738. Find Kth Largest XOR Coordinate Value

动态规划。
事实上，比赛时算复杂了。用了3个DP数组，分别表示矩形异或值，行异或值，列异或值。
不过根据异或的性质，交换律和抵消律，只需要维护一个矩形异或值就可以了。

```cpp
class Solution {
public:
    int kthLargestValue(vector<vector<int>>& matrix, int k) {
        const int m = matrix.size();
        const int n = matrix[0].size();
        auto rows = matrix;
        auto cols = matrix;
        vector<int> nums;
        nums.reserve(m * n);
        nums.push_back(matrix[0][0]);
        for (int i = 1; i < m; ++i) {
            cols[i][0] = cols[i-1][0] ^ matrix[i][0];
            matrix[i][0] ^= matrix[i-1][0];
            nums.push_back(matrix[i][0]);
        }
        for (int j = 1; j < n; ++j) {
            rows[0][j] = rows[0][j-1] ^ matrix[0][j];
            matrix[0][j] ^= matrix[0][j-1];
            nums.push_back(matrix[0][j]);
        }
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                rows[i][j] = rows[i][j-1] ^ matrix[i][j];
                cols[i][j] = cols[i-1][j] ^ matrix[i][j];
                matrix[i][j] ^= matrix[i-1][j-1] ^ rows[i][j-1] ^ cols[i-1][j];
                nums.push_back(matrix[i][j]);
            }
        }
        sort(nums.begin(), nums.end(), greater<int>());
        return nums[k-1];
    }
};
```

时间复杂度: O(m * n),
空间复杂度: O(1), 不需要`rows`, `cols`如果复用`matrix`的话。

## 1739. Building Boxes

二分查找。
确定最下一层盒子数，计算其最多可以摆多少盒子。
根据贪心的思路，每一层都要尽量挤到角角上，是一个等差数列。

```cpp
class Solution {
    using ll = long long;
public:
    int minimumBoxes(int n) {
        // time: log n * log n * log n
        // 1 + 3 + 6
        // level(x) = level(x-1) + x, level(1) = 1
        // level(2) = 3
        // level(3) = 6
        // binary_search
        // maxBoxesCount(x) = 
        const ll MAX = n + 1;
        auto binary = [&](ll lo, ll hi, function<bool(const ll)> predicate) -> int {
            while (lo < hi) {
                ll mid = lo + (hi - lo) / 2;
                if (predicate(mid)) {
                    hi = mid;
                } else {
                    lo = mid + 1;
                }
            }
            return lo;
        };
        function<ll(const ll)> maxBoxesCouldHoldByLastLevel = [&](const ll x) -> ll {
            if (x <= 0) return 0;
            ll k = binary(0, MAX, [&](const ll k) -> bool {
                return k * (k + 1) / 2 > x;
            }) - 1;
            // if (x < 5) cout << "maxBoxesCouldHoldByLastLevel: " << x << " " << k << endl;
            const ll y = x - (k * (k + 1) / 2);
            const ll couldNotPut = y + (k) - (y == 0 ? y : (y - 1));
            const ll nextLevel = x - couldNotPut;
            return x + maxBoxesCouldHoldByLastLevel(nextLevel);
        };
        return binary(0, MAX, [&](const ll x) -> bool {
            return maxBoxesCouldHoldByLastLevel(x) >= n;
        });
    }
};
```

时间复杂度: O(log n * log n * sqrt n), sqrt n 为 `maxBoxesCouldHoldByLastLevel`的递归层数，
空间复杂度: O(sqrt n).