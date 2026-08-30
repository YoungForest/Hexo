---
title: LeetCode weekly contest 250
date: 2021-07-19 09:20:38
description: 四道题涉及坏键过滤、批量补梯级、优化网格动态规划，以及离线树查询与二进制 Trie。
tags:
- Competitive Programming
categories:
- LeetCode
translations:
  zh-CN: https://youngforest.github.io/2021/07/19/LeetCode-weekly-contest-250/
  en: https://youngforest.github.io/en/2021/07/19/LeetCode-weekly-contest-250/
---
| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (6) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 192 / 13694 | YoungForest | 18 | 	1:22:27 |  0:03:20 | 0:09:15  🐞1 | 0:28:08 | 1:07:27  🐞2 |

连续2周成绩还不错，前200。导致美服小号rating都要上2400了，以后打起来会更加需要小心翼翼。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/LeetCode-weekly-contest-250/zh-hero.webp" alt="坏键筛掉部分无字词块，梯子一次补齐缺级，双向光束扫过积分网格，树路径令牌进入二叉分拣器" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

## 1935. Maximum Number of Words You Can Type

签到题。字符串问题用Python果然没错。光`split`这一项就值得。

```python
class Solution:
    def canBeTypedWords(self, text: str, brokenLetters: str) -> int:
        ans = 0
        broken = set()
        for i in brokenLetters:
            broken.add(i)
        def ok(word):
            for c in word:
                if c in broken:
                    return False
            return True
        for word in text.split(' '):
            if ok(word):
                ans += 1
        return ans
```

时间复杂度: O(text.length),
空间复杂度: O(text.length + 26).

## 1936. Add Minimum Number of Rungs

贪心，如果够不到下一级，就在最远的距离上加一个。
需要注意，不能一级一级加，而是用除法一次加完中间缺少的。否则，会TLE（我也因此罚时5min）。

```cpp
class Solution {
public:
    int addRungs(vector<int>& rungs, int dist) {
        int ans = 0;
        
        int last = 0;
        for (int idx = 0; idx < rungs.size(); ++idx) {
            const int i = rungs[idx];
            if (i - last <= dist) {
                last = i;
            } else {
                ans += (i - last - 1) / dist;
                last = i;
            }
        }
        
        return ans;
    }
};
```

时间复杂度: O(rungs.length),
空间复杂度: O(1).

## 1937. Maximum Number of Points with Cost

很明显的一道动态规划题目。
```
dp[i][j] = points[i][j] + max(dp[i-1][k] - abs(k-j) for k in range(n))
```
然而直接莽的话，时间复杂度是 O(m * n ^ 2). 显然会TLE。需要优化。
上一行根据 abs的正负，可以分为
前面的 dp[i-1] - (j - k) = dp[i-1] + k - j,
后面的 dp[i-1] - (k - j) = dp[i-1] - k + j.
可以使用2个TreeSet记录前后的 dp + k 和 dp - k，并在j更新的时候，更新这2个TreeSet.
这样时间复杂度降为: O(m * n). 

```cpp
class Solution {
    using ll = long long;
public:
    long long maxPoints(vector<vector<int>>& points) {
        const int m = points.size();
        const int n = points[0].size();
        vector<vector<ll>> dp(m, vector<ll> (n, 0));
        // i == 0
        for (int j = 0; j < n; ++j) {
            dp[0][j] = points[0][j];
        }
        for (int i = 1; i < m; ++i) {
            multiset<ll> before, after;
            for (int k = 0; k < n; ++k) {
                after.insert(dp[i-1][k] - k);
            }
            for (int j = 0; j < n; ++j) {
                ll add = 0;
                if (before.empty()) {
                    add = *after.rbegin() + j;
                } else if (after.empty()) {
                    add = *before.rbegin() - j;
                } else {
                    add = max(*before.rbegin() - j, *after.rbegin() + j);
                }
                dp[i][j] = max(dp[i][j], points[i][j] + add);
                auto it = after.find(dp[i-1][j] - j);
                after.erase(it);
                before.insert(dp[i-1][j] + j);
            }
        }
        
        
        return *max_element(dp.back().begin(), dp.back().end());
    }
};
```

时间复杂度: O(m * n)，
空间复杂度: O(m * n). 其实也可以降为O(n), 但写起来稍微麻烦些，对AC也没必要.

## 1938. Maximum Genetic Difference Query

Trie + backtracking + 离线计算。
Trie用来快速计算最大XOR，backtracking用来维护从根到当前节点的路径和更新Trie，离线计算用以得到query的答案。

使用cpp需要注意Trie的实现方式。
本题用`shared_ptr`会TLE，raw pointer + delete也会TLE。
删了delete才AC，这是逼我内存泄漏呀。
不过本题因为可以使用`cnt`表示节点状态，实际上也并不需要真正删除节点。

```cpp
class Solution {
    const int MAX_BIT = 17;
    struct TrieNode {
        array<TrieNode*, 2> children;
        int cnt = 0;
    };
    void buildTrie(const int num, TrieNode* root, const int index) {
        if (index < 0) return;
        const int b = (num >> index) & 1;
        if (root->children[b] == nullptr) {
            root->children[b] = new TrieNode();
        }
        root->children[b]->cnt++;
        buildTrie(num, root->children[b], index - 1);
    }
    void eraseTrie(const int num, TrieNode* root, const int index) {
        if (index < 0) return;
        const int b = (num >> index) & 1;
        // if (root->children[b] == nullptr) {
        //     cout << num << ":" << index << " " << endl;
        //     root->children[b] = make_shared<TrieNode>();
        // }
        eraseTrie(num, root->children[b], index - 1);
        root->children[b]->cnt--;
        if (root->children[b]->cnt == 0) {
            // delete root->children[b];
            root->children[b] = nullptr;
        }
    }
public:
    vector<int> maxGeneticDifference(vector<int>& parents, vector<vector<int>>& queries) {
        const int n = parents.size();
        const int m = queries.size();
        vector<vector<int>> children(n);
        int rootNode = -1;
        for (int i = 0; i < n; ++i) {
            if (parents[i] == -1) rootNode = i;
            else children[parents[i]].push_back(i);
        }
        vector<int> ans(m);
        using pii = pair<int, int>;
        vector<vector<pii>> offQueies(n);
        for (int index = 0; index < m; ++index) {
            offQueies[queries[index][0]].push_back({queries[index][1], index});
        }
        // shared_ptr<TrieNode> root = make_shared<TrieNode>();
        auto root = new TrieNode();
        auto maxXOR = [&](const int val) -> int {
            int ans = 0;
            auto current = root;
            for (int i = MAX_BIT; i >= 0; --i) {
                const int b = (val >> i) & 1;
                if (current->children[1 - b]) {
                    ans += (1 << i);
                    current = current->children[1 - b];
                } else {
                    current = current->children[b];
                }
            }
            return ans;
        };
        function<void(const int, vector<int>&)> dfs = [&](const int current, vector<int>& path) -> void {
            for (auto p : offQueies[current]) {
                int val = get<0>(p);
                int index = get<1>(p);
                ans[index] = maxXOR(val);
            }
            // cout << current << " ";
            for (int child : children[current]) {
                path.push_back(child);
                buildTrie(child, root, MAX_BIT);
                dfs(child, path);
                eraseTrie(path.back(), root, MAX_BIT);
                path.pop_back();
            }
        };
        vector<int> path;
        path.push_back(rootNode);
        buildTrie(rootNode, root, MAX_BIT);
        dfs(rootNode, path);
        eraseTrie(path.back(), root, MAX_BIT);
        path.pop_back();
        return ans;
    }
};
```

时间复杂度: O(log (max(val_i)) * (parents.length + queries.length)),
空间复杂度: O(parents.length), Trie的空间消耗其实是个等比数列求和。
