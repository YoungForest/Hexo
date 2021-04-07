---
title: LeetCode  weekly contest 181
date: 2020-03-22 18:57:47
tags:
- Competitive Programming
categories:
- LeetCode
---

自从LeetCode rating算法更新后，我的rating到达了顶峰，之后就一直向下掉。不过也是因为自己菜，每次都打的大好几百名，偶尔还上千。

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 839 / 10930 |	YoungForest | 	18	 | 	1:31:13 | 0:04:53 | 0:14:43  1 | 0:45:27  1 | 1:16:13  1 |


## 1389. Create Target Array in the Given Order

签到题。使用vector的insert接口，缺点是效率有问题，不过对于签到题足够了。

时间复杂度: O(n ^ 2), 最坏情况是 每次都插到首位。
空间复杂度: O(n).

```cpp
class Solution {
public:
    vector<int> createTargetArray(vector<int>& nums, vector<int>& index) {
        vector<int> ans;
        const int n = nums.size();
        for (int i = 0; i < n ; ++ i) {
            if (index[i] < ans.size()) 
                ans.insert(ans.begin() + index[i], nums[i]);
            else
                ans.push_back(nums[i]);
        }
        return ans;
    }
};
```

## 1390. Four Divisors

Brute force. 计算每个数的因数。

时间复杂度: O(sqrt(nums[i]) * nums.length),
空间复杂的: O(nums.length) -> O(1) without memo.

```cpp
class Solution {
    unordered_map<int, int> memo;
    unordered_map<int, int> sumDivisors;
    int divisors(int x) {
        if (x == 1)
            return 1;
        else {
            if (memo.find(x) == memo.end()) {
                int ans = 2;
                int sum = 1 + x;
                for (int i = 2; i * i <= x; ++i) {
                    if (x % i == 0) {
                        ans += (i * i == x) ? 1 : 2;
                        sum += (i * i == x) ? i : i + x / i;
                    }
                    if (ans > 4)
                        break;
                }
                if (ans == 4) {
                    sumDivisors[x] = sum;
                }
                return memo[x] = ans;
            } else {
                return memo[x];
            }
        }
    }
public:
    int sumFourDivisors(vector<int>& nums) {
        int ans = 0;
        for (int i : nums) {
            if (divisors(i) == 4)
                ans += sumDivisors[i];
        }
        return ans;
    }
};
```

## 1391. Check if There is a Valid Path in a Grid

算法不是很难的一道题目，一遍搜索即可。难点在于实现，对复杂问题进行抽象。我在这里使用了多个hashmap来解决方位的抽象。

时间复杂度: O(row * col),
空间复杂度: O(1).

本题也可以用 "[并查集](https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid/discuss/547229/Python-Union-Find)"解决，实现起来更简单些。

```cpp
class Solution {
public:
    bool hasValidPath(vector<vector<int>>& grid) {
        unordered_map<string, pair<int, int>> directions = {
            {"up", {-1, 0}},
            {"down", {1, 0}},
            {"left", {0, -1}},
            {"right", {0, 1}}
        };
        unordered_map<int, unordered_map<string, string>> mm = {
            {1, {{"left", "right"}, {"right", "left"}}},
            {2, {{"up", "down"}, {"down", "up"}}},
            {3, {{"left", "down"}, {"down", "left"}}},
            {4, {{"down", "right"}, {"right", "down"}}},
            {5, {{"left", "up"}, {"up", "left"}}},
            {6, {{"up", "right"}, {"right", "up"}}}
        };
        unordered_map<string, string> reversed = {
            {"left", "right"},
            {"right", "left"},
            {"up", "down"},
            {"down", "up"}
        };
        unordered_map<int, vector<string>> start_direction = {
            {1, {"left"}},
            {2, {"up"}},
            {3, {"left"}},
            {4, {"down", "right"}},
            {5, {}},
            {6, {"up"}}
        };
        const int m = grid.size();
        const int n = grid[0].size();
        if (m == 1 && n == 1)
            return true;
        for (string d : start_direction[grid[0][0]]) {
            int row = 0, col = 0;
            while (true) {
                d = mm[grid[row][col]][d];
                row += directions[d].first;
                col += directions[d].second;
                d = reversed[d];
                if (row < 0 || row >= m || col < 0 || col >= n || mm[grid[row][col]].find(d) == mm[grid[row][col]].end()) {
                    break;
                } else if (row == m - 1 && col == n - 1)
                    return true;
            }
        }
        return false;
    }
};
```

## 1392. Longest Happy Prefix

参考的是[geekforgeek](https://www.geeksforgeeks.org/longest-prefix-also-suffix/)上的代码，并不难找，Google "longest prefix suffix"就能出来。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    string longestPrefix(string s) {
        int n = s.size(); 
  
        vector<int> lps(n); 
        lps[0] = 0; // lps[0] is always 0 

        // length of the previous 
        // longest prefix suffix 
        int len = 0; 

        // the loop calculates lps[i] 
        // for i = 1 to n-1 
        int i = 1; 
        while (i < n) 
        { 
            if (s[i] == s[len]) 
            { 
                len++; 
                lps[i] = len; 
                i++; 
            } 
            else // (pat[i] != pat[len]) 
            { 
                if (len != 0) 
                { 
                    len = lps[len-1]; 
                } 
                else // if (len == 0) 
                { 
                    lps[i] = 0; 
                    i++; 
                } 
            } 
        } 
        int res = lps[n-1]; 

        return s.substr(0, res); 
    }
};
```