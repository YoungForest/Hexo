---
title: LeetCode weekly contest 189
date: 2020-05-17 18:47:50
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (7)|
|--|--|--|--|--|--|--|--|
| 484 / 13036|	YoungForest | 19 | 1:27:45 | 0:11:20 | 0:19:20  1 | 0:08:48 |  1:22:45 |

本周的最后一题是一个经典的计算几何问题，并不好写。不过通过率还是很高的，可能是test case比较弱的原因。

在残酷群的排名降到了32名，跌幅达100%。之前感觉自己变强了错觉，是由于3周前的186周赛取得了113的好成绩，所以按照群排名算法，之后3周的排名都比较高。最好的一次成绩过去后，排名就恢复了本来的水平。30左右。并不是自己变强了，而是运气好而已。而且186正好用的python，python确实对手速场有优势。

## 1450. Number of Students Doing Homework at a Given Time

签到题，One Pass.

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int busyStudent(vector<int>& startTime, vector<int>& endTime, int queryTime) {
        int ans = 0;
        for (int i = 0; i < startTime.size(); ++i) {
            if (startTime[i] <= queryTime && queryTime <= endTime[i]) ++ans;
        }
        return ans;
    }
};
```

## 1451. Rearrange Words in a Sentence

利用C++ STL提供的排序函数。

时间复杂度: O(N log N),
空间复杂度: O(N).

```cpp
class Solution {
    vector<pair<string,int>> splitSentence(const string& text) {
        string tmp;
        vector<pair<string,int>> stk;
        stringstream ss(text);
        int position = 0;
        while(getline(ss,tmp,' ')) {
            if (!islower(tmp[0])) tmp[0] = tolower(tmp[0]);
            stk.push_back({tmp, position});
            ++position;
        }
        return stk;
    }
public:
    string arrangeWords(string text) {
        auto split = splitSentence(text);
        sort(split.begin(), split.end(), [](const auto& a, const auto& b) -> bool {
            if (a.first.size() == b.first.size()) {
                return a.second < b.second;
            } else {
                return a.first.size() < b.first.size();
            }
        });
        string ans;
        for (const auto& word : split) {
            ans += word.first;
            ans.push_back(' ');
        }
        ans.pop_back();
        ans[0] = toupper(ans[0]);
        return ans;
    }
};
```

## 1452. People Whose List of Favorite Companies Is Not a Subset of Another List

brute force. 对于每个人，判断是否被另外一个人所包含。N^2.
判断包含时，可以将公司先排序，再顺序比较。O(m * log m + m).
N为人数，M为公司数。

时间复杂度: O(N^2 * M log M),
空间复杂度: O(N).

其中，利用了STL algorithm里的includes函数，可以判断2个排序区间是否包含。

```cpp
class Solution {
public:
    vector<int> peopleIndexes(vector<vector<string>>& favoriteCompanies) {
        for (auto& v : favoriteCompanies) {
            sort(v.begin(), v.end());
        }
        const int n = favoriteCompanies.size();
        vector<int> ans;
        for (int i = 0; i < n; ++i) {
            bool remove = false;
            for (int j = 0; j < n; ++j) {
                if (i == j) continue;
                if (includes(favoriteCompanies[j].begin(), favoriteCompanies[j].end(), favoriteCompanies[i].begin(), favoriteCompanies[i].end())) {
                    remove = true;
                    break;
                }
            }
            if (!remove) {
                ans.push_back(i);
            }
        }
        return ans;
    }
};
```

## 1453. Maximum Number of Darts Inside of a Circular Dartboard

一道经典的题目：disk partial covering problem。
在网上随便一搜就有，原理参考[geekforgeek](https://www.geeksforgeeks.org/angular-sweep-maximum-points-can-enclosed-circle-given-radius/), [discuss](https://leetcode.com/problems/maximum-number-of-darts-inside-of-a-circular-dartboard/discuss/636416/c%2B%2B-O(n2logn)-angular-sweep-(with-picture)), 即著名的augular sweep.

时间复杂度: O(n^2 log n)
空间复杂度: O(n ^ 2).


```cpp
class Solution {
    using Point = complex<double>;
    // angular sweep
    int getPointsInside(const vector<Point>& arr, const vector<vector<double>>& dis, int i, double r, int n) 
    { 
        vector<pair<double, bool> > angles; 
        for (int j=0; j<n; j++) 
        { 
            if (i != j && dis[i][j] <= 2*r) 
            { 
                double B =  acos(dis[i][j]/(2*r)); 
                double A = arg(arr[j]-arr[i]); 
                double alpha = A-B; 
                double beta = A+B; 
                angles.push_back(make_pair(alpha, false)); 
                angles.push_back(make_pair(beta, true)); 
            } 
        } 
        sort(angles.begin(), angles.end()); 
        int count = 1, res = 1; 
        vector<pair<double, bool> >::iterator it; 
        for (it=angles.begin(); it!=angles.end(); ++it) 
        { 
            if (!(*it).second) 
                count++; 
            else
                count--; 

            if (count > res) 
                res = count; 
        } 

        return res; 
    } 
public:
    int numPoints(vector<vector<int>>& points, int r) {
        const int n = points.size();
        vector<Point> arr;
        arr.reserve(n);
        for (const auto& p : points) {
            arr.emplace_back(p[0], p[1]);
        }
        vector<vector<double>> dis(n, vector<double>(n, 0));
        for (int i=0; i<n-1; i++) 
            for (int j=i+1; j<n; j++) 
                dis[i][j] = dis[j][i] = abs(arr[i]-arr[j]); 
        int ans = 0; 
        for (int i=0; i<n; i++) 
            ans = max(ans, getPointsInside(arr, dis, i, r, n));
        return ans; 
    }
};
```