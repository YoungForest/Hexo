---
title: LeetCode weekly contest 211
date: 2020-10-19 20:12:22
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 224 / 11960 | YoungForest | 18 | 1:23:45 | 0:03:19 | 0:31:37 | 1:00:04 | 1:18:45 1 |

本周题目质量还不错，而且自己排名也不错。提前10分钟AC，就是喜欢这种紧张刺激感。而像上周那样提前40minAC反而没今天这么开心。
因为连续2次周赛排名都很靠前，我残酷群的排名也上升到15名了。久违的最高位置，继续保持。

## 1624. Largest Substring Between Two Equal Characters

签到题。记录每个字符的首次出现下标和最后出现下标，遍历做差即可。

```cpp
class Solution {
public:
    int maxLengthBetweenEqualCharacters(string s) {
        using pii = pair<int, int>;
        vector<pii> index(26, {-1, -1});
        for (int i = 0; i < s.size(); ++i) {
            const int idx = s[i] - 'a';
            if (index[idx].first == -1) {
                index[idx].first = i;
            }
            index[idx].second = i;
        }
        int ans = -1;
        for (auto p : index) {
            ans = max(ans, p.second - p.first - 1);
        }
        return ans;
    }
};
```

时间复杂度: O(s.size()),
空间复杂度: O(1).

## 1625. Lexicographically Smallest String After Applying Operations

第二题挺恶心，暴力就行，但实现起来还是比较复杂度的。写了50行代码，没成想竟然一次bug-free。
因为数据规模很小，100，brute force搞起.

先找到所有通过shift可以作为开头的下标。shift最为一个子问题也是LeetCode的原题，通过3次`reverse`可以方便的实现。
然后就不需要考虑shift操作了，只需要考虑增加操作。贪心即可。这时根据b是奇偶，可能有2或1位要增加。
最后找到所有下标可以达到的最小值即可。


```cpp
class Solution {
public:
    string findLexSmallestString(string s, int a, int b) {
        const int n = s.size();
        vector<int> head;
        bool first = true;
        for (int i = 0; ; ++i) {
            const int condidate = ((n - i * b) % n + n) % n;
            if (condidate == 0) {
                if (!first) break;
                first = false;
            }
            head.push_back(condidate);
        }
        string ans(n, '9');
        auto shiftK = [&](string& a, const int k) -> void {
            // shift left k unit
            reverse(a.begin(), a.end());
            auto it = a.begin() + k;
            reverse(a.begin(), it);
            reverse(it, a.end());
        };
        auto minIncrease = [&](const int x) -> int {
            map<int, int> reach;
            int i = x;
            int ans = 0;
            while (reach.find(i) == reach.end()) {
                reach[i] = ans;
                i = (i + a) % 10;
                ans += a;
            }
            return reach.begin()->second;
        };
        auto fixHead = [&](const int d) -> string {
            string ans = s;
            shiftK(ans, d);
            if (b % 2 != 0) {
                const int increase = minIncrease(ans[0] - '0');
                for (int i = 0; i < n; i += 2) {
                    ans[i] = '0' + ((ans[i] - '0' + increase) % 10);
                }
            }
            const int increase = minIncrease(ans[1] - '0');
            for (int i = 1; i < n; i += 2) {
                ans[i] = '0' + ((ans[i] - '0' + increase) % 10);
            }
            return ans;
        };
        for (const int d : head) {
            const string x = fixHead(d);
            if (x < ans) {
                ans = x;
            }
        }
        return ans;
    }
};
```

时间复杂度: O(n * n * 10),
空间复杂度: O(n).

## 1626. Best Team With No Conflicts

动态规划。
先按年龄和分数排序。
`dp[i][j] = max(dp[i-1][x] for x <= j)`
其中，`i`表示年龄位置，`j`表示当前最高分数。

```cpp
class Solution {
public:
    int bestTeamScore(vector<int>& scores, vector<int>& ages) {
        map<int, multiset<int>> players;
        const int n = scores.size();
        for (int i = 0; i < n; ++i) {
            players[ages[i]].insert(scores[i]);
        }
        map<int, int> m;    // maxScore, max_sum_score
        m[0] = 0;
        for (const auto& p : players) {
            auto it = m.begin();
            int maxScore = it->second;
            for (int x : p.second) {
                while (it != m.end() && it->first <= x) {
                    maxScore = max(maxScore, it->second);
                    ++it;
                }
                m[x] = maxScore + x;
                maxScore += x;
            }
        }
        int ans = 0;
        for (const auto&  p : m) {
            ans = max(ans, p.second);
        }
        return ans;
    }
};
```

时间复杂度: O(N ^ 2),
空间复杂度: O(N).

## 1627. Graph Connectivity With Threshold

被国服的翻译坑了。query是询问2个节点是否联通，而不是直接相连。国服一开始翻译成直接相连了，还专门强调一下子。我每次打比赛的习惯是一开始就打开所有的题目。之后除了遇到难题会刷新看提交和通过人数外，几乎不会刷新。所以当题目有问题时，及时之后更新了，我也不知道。力扣并没有类似codeforces的通知机制。幸亏残酷群里有同学也遇到相同的问题，WA了，但就是不明白expected answer怎么对。

本题只有6分，名副其实，属于我恰好能做出来的Hard题目。
联通用并查集可以快速实现，模版拿来。
然后就是最大公因数联通。最笨的方法是两两判断，用gcd。时间复杂度是N^N，肯定TLE了。
比较取巧的方法是枚举公因数（这里并不需要最大），然后连接公因数和倍数就可以了。这里并没有实现题目中的直接相连这一概念，而是间接相连。直接相连并不需要，因为我们最后需要的也是间接相连。

这里时间复杂度不容易判断，需要一个知识:
1 + 1/2 + 1/3 + ... + 1/n ~ log n.

即调和级数求和复杂度约等于对数。

```cpp
class Solution {
    struct UF {
        vector<int> parent;
        int count;
        UF(int n) : parent(n), count(n) {
            iota(parent.begin(), parent.end(), 0);
        }
        // A utility function to find the subset of an element i  
        int find(int x)  
        {  
            return x == parent[x] ? x : parent[x] = find(parent[x]);
        }  

        // A utility function to do union of two subsets  
        void unite(int x, int y)  
        {  
            int xset = find(x);  
            int yset = find(y);  
            if(xset != yset) 
            {  
                parent[xset] = yset;
                --count;
            }  
        }    
    };
public:
    vector<bool> areConnected(int n, int threshold, vector<vector<int>>& queries) {
        // n * log n + queries.size();
        const int q = queries.size();
        vector<bool> ans;
        ans.reserve(q);
        UF uf(n + 1);
        for (int i = threshold + 1; i <= n; ++i) {
            for (int j = i + i; j <= n; j += i) {
                uf.unite(i, j);
            }
        }
        auto check = [&](const int a, const int b) -> bool {
            return uf.find(a) == uf.find(b);
        };
        for (const auto& x : queries) {
            ans.push_back(check(x[0], x[1]));
        }
        return ans;
    }
};
```

时间复杂度: O(n log n + queries.length),
空间复杂度: O(n).

## 后记

本周忙于实习转正需要发的CR和UT，以及28号就要交的大论文初稿。连续加班，估计需要2周时间，一周后交了论文才有机会休息。加油，YoungForest!