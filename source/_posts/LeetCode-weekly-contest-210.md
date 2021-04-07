---
title: LeetCode weekly contest 210
date: 2020-10-11 19:23:21
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 94 / 11792 | YoungForest | 18 | 0:51:30 | 0:03:13 | 0:08:36 | 0:21:59 | 0:51:30 |

本场比赛都是常规题目，我没有遇到困难，久违地进入了前100名。太难了，残酷群排名也因此上升到25名。

## 5535. Maximum Nesting Depth of the Parentheses

签到题。括号嵌套层数，用栈的思路即可。左括号入栈，右括号出栈。

```cpp
class Solution {
public:
    int maxDepth(string s) {
        int left = 0;
        int ans = 0;
        for (char c : s) {
            if (c == '(') {
                ++left;
            } else if (c == ')') {
                --left;
            }
            ans = max(ans, left);
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 5536. Maximal Network Rank

暴力法。枚举所有的城市对，计算network rank。有个技巧是先统计单个城市的度，如果2城市间存在道路则减一。

```cpp
class Solution {
public:
    int maximalNetworkRank(int n, vector<vector<int>>& roads) {
        using pii = pair<int, int>;
        set<pii> roadmap;
        vector<int> cnt(n);
        for (const auto& r : roads) {
            roadmap.insert({r[0], r[1]});
            ++cnt[r[0]];
            ++cnt[r[1]];
        }
        int ans = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                int sub = 0;
                if (roadmap.find({i, j}) != roadmap.end() || roadmap.find({j, i}) != roadmap.end()) {
                    ++sub;
                }
                ans = max(ans, cnt[i] + cnt[j] - sub);
            }
        }
        return ans;
    }
};
```

时间复杂度: O(n^2 * log m + m log m),
空间复杂度: O(n + m).

评论区中有[一神 O(n + m)](https://leetcode-cn.com/problems/maximal-network-rank/solution/onm-mei-ju-fa-by-zerotrac2/) 的解法，太强了。大意是，只需要知道度最大的城市和第二大的即可。

## 1616. Split Two Strings to Make Palindrome

观察有，答案只有可能2中：
a_prefix + a_mid + b_suffix,
a_prefix + b_mid + b_suffix,
b_prefix + a_mid + a_suffix,
b_prefix + b_mid + a_suffix.

计算a_prefix与b_suffix匹配的最长长度，和a_mid/b_mid的最长长度，看是否相交。
同理，b_prefix 与 a_suffix匹配的最长长度。

```cpp
class Solution {
    int head1 = 0;
    int head2 = 0;
    bool check(const string& a, const string& b) {
        const int n = a.size();
        int left, right;
        if (n % 2 == 0) {
            left = (n - 1)  / 2;
            right = n / 2;
        } else {
            const int mid = n / 2;
            left = mid - 1;
            right = mid + 1;
        }
        while (left >= 0 && right < n && a[left] == a[right]) {
            --left;
            ++right;
        }
        const int length = right - left - 1;
        return head1 > left || head2 > left;
    }
public:
    bool checkPalindromeFormation(string a, string b) {
        const int n = a.size();
        while (head1 < n && a[head1] == b[n - 1 - head1]) {
            ++head1;
        }
        while (head2 < n && b[head2] == a[n - 1 - head2]) {
            ++head2;
        }
        return check(a, b) || check(b, a);
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 5538. Count Subtrees With Max Distance Between Cities

暴力法，写了近100行代码。先枚举所有的点组合，判断是否是subtree，如果是的话，计算最大距离。

判断是否subtree，我使用了用 并查集 判断是否全部联通的方法。
最大距离d，我采用了多次DFS的方式，时间复杂度 n^2. 赛后得知有O(n) [2次dfs的方法计算树的直径](https://oi-wiki.org/graph/tree-diameter/)。

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
    vector<int> countSubgraphsForEachDiameter(int n, vector<vector<int>>& edges) {
        // time: (n ^ 2 * 2 ^ n)
        vector<unordered_set<int>> graph(n);
        for (const auto& v : edges) {
            const int a = v[0] - 1;
            const int b = v[1] - 1;
            graph[a].insert(b);
            graph[b].insert(a);
        }
        vector<vector<int>> dist(n, vector<int>(n));
        function<void(const int, const int, const int, const int)> dfs = [&](const int root, const int current, const int parent, const int depth) -> void {
            dist[root][current] = depth;
            for (int child : graph[current]) {
                if (child == parent) continue;
                dfs(root, child, current, depth + 1);
            }
                
        };
        for (int i = 0; i < n; ++i) {
            dfs(i, i, -1, 0);
        }
        auto getnodes = [&](const int mask) -> vector<int> {
            vector<int> ans;
            for (int i = 0; i < n; ++i) {
                if ((mask & (1 << i)) != 0) {
                    ans.push_back(i);
                }
            }
            return ans;
        };
        auto checksubtree = [&](const vector<int>& nodes) -> bool {
            if (nodes.empty() || nodes.size() == 1) return false;
            UF uf(n);
            for (int i = 0; i < nodes.size(); ++i) {
                for (int j = i + 1; j < nodes.size(); ++j) {
                    const int a = nodes[i], b = nodes[j];
                    if (graph[a].find(b) != graph[a].end()) {
                        uf.unite(a, b);
                    }
                }
            }
            int root = -1;
            for (int a : nodes) {
                if (root == -1) {
                    root = uf.find(a);
                } else {
                    if (root != uf.find(a)) return false;
                }
            }
            return true;
        };
        auto distance = [&](const vector<int>& nodes) -> int {
            int ans = 0;
            for (int i = 0; i < nodes.size(); ++i) {
                for (int j = i + 1; j < nodes.size(); ++j) {
                    const int a = nodes[i], b = nodes[j];
                    ans = max(ans, dist[a][b]);
                }
            }
            return ans;
        };
        // d = 1...n-1        
        vector<int> ans (n - 1, 0);
        const int upper = (1 << n);
        for (int mask = 0; mask < upper; ++mask) {
            auto nodes = getnodes(mask);
            if (!checksubtree(nodes)) continue;
            ++ans[distance(nodes) - 1];
        }
        return ans;
    }
};
```

时间复杂度: O(n ^ 2 * 2 ^ n),
空间复杂度: O(n ^ 2).

由于`n <= 15`, 所以指数级的还是可以过的。

评论区也有 [`O(n ^ 5)`的解法](https://leetcode-cn.com/problems/count-subtrees-with-max-distance-between-cities/solution/python3-shu-xing-dp-by-simpleson/)。