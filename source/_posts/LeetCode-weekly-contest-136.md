---
title: LeetCode weekly contest 136
date: 2019-05-12 12:04:20
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (6) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 220 / 4109	|	YoungForest |	15 | 0:59:43 | 0:17:07 | 0:29:36 |	0:54:43 (1) | null |

最近比赛的质量都还可以。即使是最简单的签到题，也是需要认真思考的。考察DP的题也是每次都有，DP算是那种你做很多，遇到新的题目还是可能写不出来的类型。
本次恢复了原先的水平，跌到了200+。
这次大概需要55分钟前3题，才能进入前200。我一是做题比较慢，二是 第3题DP有个下标问题搞错了，导致了一次罚时。所以遗憾地没有进入前200.

## 1041. Robot Bounded In Circle

Intuition:
执行instruction直到再此面朝北。因为只有4个方向，所以最多执行4次，也可能是2次或1次。
如果此时不在原点，则继续走下去一定越走越远。否则就是一个circle.
时间复杂度: O(instructions.length),
空间复杂度: O(1)

```cpp
class Solution {
    enum class Direction {
        north,
        south,
        west,
        east
    };
public:
    bool isRobotBounded(string instructions) {
        // 只要执行完一次instructions, 面朝北，同时不在原点，就没有圈。否则有圈
        Direction direction = Direction::north;
        int x = 0, y = 0;
        do {
            for (char c : instructions) {
                if (c == 'G') {
                    switch (direction) {
                        case Direction::north:
                            ++y;
                            break;
                        case Direction::south:
                            --y;
                            break;
                        case Direction::west:
                            --x;
                            break;
                        case Direction::east:
                            ++x;
                            break;
                    }
                } else if (c == 'L') {
                    switch (direction) {
                        case Direction::north:
                            direction = Direction::west;
                            break;
                        case Direction::south:
                            direction = Direction::east;
                            break;
                        case Direction::west:
                            direction = Direction::south;
                            break;
                        case Direction::east:
                            direction = Direction::north;
                            break;
                    }
                } else if (c == 'R') {
                    switch (direction) {
                        case Direction::north:
                            direction = Direction::east;
                            break;
                        case Direction::south:
                            direction = Direction::west;
                            break;
                        case Direction::west:
                            direction = Direction::north;
                            break;
                        case Direction::east:
                            direction = Direction::south;
                            break;
                    }
                }
                // cout << x << " " << y << " " << static_cast<int>(direction) << endl;
            }
        } while (direction != Direction::north);
        return x == 0 && y == 0;
    }
};
```

## 1042. Flower Planting With No Adjacent

Intuition: 
染色问题。因为一定存在解，所以可以基于贪心的思路。每次取可取颜色中的任意一个。

时间复杂度: O(N),
空间复杂度: O(N).
有二维数组和2层循环，难道不是`N^2`嘛？事实上由于`出入度 <= 3`, 颜色个数为4. 第二维的复杂度其实是个常数。

```cpp
class Solution {
public:
    vector<int> gardenNoAdj(int N, vector<vector<int>>& paths) {
        vector<int> ret(N, 0);
        vector<vector<int>> edges(N + 1);
        vector<set<int>> remain_color(N + 1, {1, 2, 3, 4});
        for (const auto path : paths) {
            edges[path[0]].push_back(path[1]);
            edges[path[1]].push_back(path[0]);
        }
        for (int i = 1; i <= N; ++i) {
            if (remain_color[i].begin() != remain_color[i].end()) {
                auto color = *(remain_color[i].begin());
                ret[i - 1] = color;
                for (auto j : edges[i]) {
                    remain_color[j].erase(color);
                }
            }
        }
        return ret;
    }
};
```

## 1043. Partition Array for Maximum Sum

Intuition:
看到`Array` `Maximum`就可以想到动态规划了。
动态规划，就要寻找递归子结构和最优表达式。
回到本题，第i位的maxSumAfterPartitioning可以由前面的解得到。

时间复杂度：`O(A.size() * K)`
空间复杂度：`O(A.size())`

```cpp
class Solution {
public:
    int maxSumAfterPartitioning(vector<int>& A, int K) {
        // dp
        // dp[i] 表示以第i个元素结尾的数组的结果，i已经被划分到前一个子数组
        int n = A.size();
        vector<int> dp(n + 1, 0);
        for (int i = 0; i < n; ++i) {
            int max_value = A[i];
            dp[i + 1] = max_value;
            for (int j = 0; j < K && i - j >= 0; ++j) {
                max_value = max(max_value, A[i - j]);
                dp[i + 1] = max(dp[i + 1], dp[i - j] + (j + 1) * max_value);
            }
            // cout << dp[i+1] << endl;
        }
        return dp[n];
    }
};
```

## 1044. Longest Duplicate Substring

最后30min都在想本题，也尝试了明知会TLE的暴力解法。虽然心存侥幸，但果然超时了。
暴力解法的思路很简单，每次把字符串向右平移一位，然后找相同的子字符串。
时间复杂度: O(N ^ 2),
空间复杂度: O(1).
因为字符串的长度为`10^5`, `n^2`的算法一定超时。

```cpp
class Solution {
public:
    string longestDupSubstring(string S) {
        // 暴力解法，n^2. 肯定会超时
        int global_max_begin = 0, global_max = 0;
        for (int shift = 1; shift < S.size(); ++shift) {
            int max_begin = 0, max_ = 0;
            for (int i = shift; i < S.size() && i + global_max < S.size(); ++i) {
                if (S[i] == S[i - shift]) {
                    ++max_;
                    if (max_ > global_max) {
                        global_max = max_;
                        global_max_begin = max_begin + 1;
                    }
                } else {
                    max_ = 0;
                    max_begin = i;
                }
            }
        }
        
        return S.substr(global_max_begin, global_max);
    }
};
```

其实，这道题是经典题。什么是经典题呢？题目很明确，都是关键字，题面很短，没有一句废话。这类题目往往没有理解的困难和场景的包装，属于原始的题目。往往会就是会，不会就是不会。常常是之前做过就会，没做过就不会。

解法1: suffix array + LCP(longest common prefix of the suffixes ) array
[kasais-algorithm](https://www.geeksforgeeks.org/%C2%AD%C2%ADkasais-algorithm-for-construction-of-lcp-array-from-suffix-array/)

```cpp
class Solution {
    // Structure to store information of a suffix 
    struct suffix 
    { 
        int index; // To store original index 
        array<int, 2> rank; // To store ranks and next rank pair 
    }; 

    // A comparison function used by sort() to compare two suffixes 
    // Compares two pairs, returns 1 if first pair is smaller 
    static constexpr auto cmp = [](const suffix& a, const suffix& b) -> bool
    { 
        return (a.rank[0] == b.rank[0])? a.rank[1] < b.rank[1]: 
            a.rank[0] < b.rank[0]; 
    };

    // This is the main function that takes a string 'txt' of size n as an 
    // argument, builds and return the suffix array for the given string 
    vector<int> buildSuffixArray(string txt)
    { 
        int n = txt.size();
        // A structure to store suffixes and their indexes 
        struct suffix suffixes[n]; 

        // Store suffixes and their indexes in an array of structures. 
        // The structure is needed to sort the suffixes alphabatically 
        // and maintain their old indexes while sorting 
        for (int i = 0; i < n; i++) 
        { 
            suffixes[i].index = i; 
            suffixes[i].rank[0] = txt[i] - 'a'; 
            suffixes[i].rank[1] = ((i+1) < n)? (txt[i + 1] - 'a'): -1; 
        } 

        // Sort the suffixes using the comparison function 
        // defined above. 
        sort(suffixes, suffixes+n, cmp); 

        // At his point, all suffixes are sorted according to first 
        // 2 characters. Let us sort suffixes according to first 4 
        // characters, then first 8 and so on 
        vector<int> ind(n); // This array is needed to get the index in suffixes[] 
        // from original index. This mapping is needed to get 
        // next suffix. 
        for (int k = 4; k < 2*n; k = k*2) 
        { 
            // Assigning rank and index values to first suffix 
            int rank = 0; 
            int prev_rank = suffixes[0].rank[0]; 
            suffixes[0].rank[0] = rank; 
            ind[suffixes[0].index] = 0; 

            // Assigning rank to suffixes 
            for (int i = 1; i < n; i++) 
            { 
                // If first rank and next ranks are same as that of previous 
                // suffix in array, assign the same new rank to this suffix 
                if (suffixes[i].rank[0] == prev_rank && 
                        suffixes[i].rank[1] == suffixes[i-1].rank[1]) 
                { 
                    prev_rank = suffixes[i].rank[0]; 
                    suffixes[i].rank[0] = rank; 
                } 
                else // Otherwise increment rank and assign 
                { 
                    prev_rank = suffixes[i].rank[0]; 
                    suffixes[i].rank[0] = ++rank; 
                } 
                ind[suffixes[i].index] = i; 
            } 

            // Assign next rank to every suffix 
            for (int i = 0; i < n; i++) 
            { 
                int nextindex = suffixes[i].index + k/2; 
                suffixes[i].rank[1] = (nextindex < n)? 
                                    suffixes[ind[nextindex]].rank[0]: -1; 
            } 

            // Sort the suffixes according to first k characters 
            sort(suffixes, suffixes+n, cmp); 
        } 

        // Store indexes of all sorted suffixes in the suffix array 
        vector<int>suffixArr; 
        for (int i = 0; i < n; i++) 
            suffixArr.push_back(suffixes[i].index); 

        // Return the suffix array 
        return suffixArr; 
    } 

    /* To construct and return LCP */
    vector<int> kasai(string txt, vector<int> suffixArr) 
    { 
        int n = suffixArr.size(); 

        // To store LCP array 
        vector<int> lcp(n, 0); 

        // An auxiliary array to store inverse of suffix array 
        // elements. For example if suffixArr[0] is 5, the 
        // invSuff[5] would store 0. This is used to get next 
        // suffix string from suffix array. 
        vector<int> invSuff(n, 0); 

        // Fill values in invSuff[] 
        for (int i=0; i < n; i++) 
            invSuff[suffixArr[i]] = i; 

        // Initialize length of previous LCP 
        int k = 0; 

        // Process all suffixes one by one starting from 
        // first suffix in txt[] 
        for (int i=0; i<n; i++) 
        { 
            /* If the current suffix is at n-1, then we don’t 
            have next substring to consider. So lcp is not 
            defined for this substring, we put zero. */
            if (invSuff[i] == n-1) 
            { 
                k = 0; 
                continue; 
            } 

            /* j contains index of the next substring to 
            be considered to compare with the present 
            substring, i.e., next string in suffix array */
            int j = suffixArr[invSuff[i]+1]; 

            // Directly start matching from k'th index as 
            // at-least k-1 characters will match 
            while (i+k<n && j+k<n && txt[i+k]==txt[j+k]) 
                k++; 

            lcp[invSuff[i]] = k; // lcp for the present suffix. 

            // Deleting the starting character from the string. 
            if (k>0) 
                k--; 
        } 

        // return the constructed lcp array 
        return lcp; 
    }

public:
    string longestDupSubstring(string S) {
        auto suffixArray = buildSuffixArray(S);
        auto ret = kasai(S, suffixArray);
        auto it = max_element(ret.begin(), ret.end());
        if (*it == 0)
            return "";
        return S.substr(*(suffixArray.begin() + distance(ret.begin(), it)), *it);
    }
};
```

时间复杂度: `O(N log N)`, `N = S.size()`.
空间复杂度: `O(N)`.

另一种解法，使用了经典的二分搜索。trick的地方在于判断是否子字符串之前见过，使用了26进制编码的hashtable。
```cpp
class Solution {
    string ret;
    const int64_t prime = 288230376151711717; 
    bool compare(const string& S, int first, int second, int len) {
        for (int i = 0; i < len; ++i) {
            if (S[first + i] != S[second + i])
                return false;
        }
        return true;
    }
    pair<bool, int> possible(const string& S, int len) {
        // if the duplicate substring the length of which is len exist
        unordered_map<int64_t, vector<int>> seen;
        int64_t hash_code = 0;
        int64_t highest_weight = 1;
        for (int i = 0; i < len; ++i) {
            hash_code = (hash_code * 26 + S[i] - 'a') % prime;
            highest_weight = (highest_weight * 26) % prime;
        }
        seen[hash_code].push_back(0);
        
        for (int i = 1; i + len <= S.size(); ++i) {
            hash_code = (hash_code * 26 + S[i + len - 1] - 'a') % prime;
            hash_code = (hash_code + prime - (S[i - 1] - 'a')*highest_weight % prime) % prime;
            if (seen.find(hash_code) != seen.end()) {
                for (auto begin_index : seen[hash_code]) {
                    if (compare(S, begin_index, i, len)) {
                        return {true, i};
                    }
                }
            }
            seen[hash_code].push_back(i);
        }
        return {false, -1};
    }
public:
    string longestDupSubstring(string S) {
        // true, true, true, ..., false
        // lo, ...,                     hi
        int lo = 0, hi = S.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            // cout << mid << " ";
            auto r = possible(S, mid);
            if (r.first) {
                // cout << "true" << endl;
                lo = mid + 1;
            } else {
                // cout << "false" << endl;
                hi = mid;
            }
        }
        if (lo <= 1) return "";
        auto r = possible(S, lo - 1);
        // cout << r.second << " " << lo - 1 << " " << S.size();
        return S.substr(r.second, lo - 1);
    }
};
```
时间复杂度: O(N log N),
空间复杂度: O(N), hashtable + return value.

第四题还是很难的。即使是我看discuss复现代码也用了半天时间。
kasai算法基本上是复制的，要自己写还是很难写对。
二分法，在26进制编码的时候踩了坑，忘记`字符 - 'a'`了。之后又在二分搜索的不变式上花了不少时间。正如 编程珠玑 所说，只有10%的程序员可以将二分查找一次写对，坑太多。推荐个别人的[教程](
https://www.zhihu.com/question/36132386/answer/530313852). 区间前闭后开，区间收缩时保持不变性，如何用`lower_bound`和`upper_bound`完成其他的二分任务，这些讲的都十分清楚。