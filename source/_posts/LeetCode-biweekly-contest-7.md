---
title: LeetCode biweekly contest 7
date: 2019-08-25 23:46:29
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 106 / 1901 |	YoungForest | 18 | 1:01:13 | 0:05:46 | 0:27:13 | 0:35:34  | 1:01:13 |

本周参加 字节跳动的夏令营，周六开幕，所以本次的双周赛是在五星级酒店的床上完成的。好不舒服，比赛结果也还能看下去。
由于第二天上午要参加夏令营的课程，所以周赛就鸽掉了。不过下午的kick start round E还是参加了，翘掉了夏令营的课程。谁让我非常想去谷歌呢？

双周赛题目不难，感觉像是其他OJ上类似的beginner定位。

## 1165. Single-Row Keyboard

考察hash table的应用, 建立字母和index的反向映射即可。

时间复杂度: O(N)
空间复杂度: O(N)

```cpp
class Solution {
public:
    int calculateTime(string keyboard, string word) {
        vector<int> location(26);
        for (int i = 0; i < keyboard.size(); ++i) {
            location[keyboard[i] - 'a'] = i;
        }
        int ans = 0;
        int current = 0;
        for (char c : word) {
            ans += std::abs(location[c - 'a'] - current);
            current = location[c - 'a'];
        }
        return ans;
    }
};
```

## 1166. Design File System

考察基本的数据结构（树）和字符串处理。
对路径进行建树，每个文件或目录是一个节点，节点上有value。查找和增长的过程都是类似字典树。
时间复杂度: O(N).
空间复杂度: O(N).

```cpp
class FileSystem {
    struct Node {
        unordered_map<string, shared_ptr<Node>> children;
        int value;
        Node(int v) : value(v) {}
    };
    vector<string> split(const string& path) {
        string tmp;
        vector<string> stk;
        stringstream ss(path);
        while(getline(ss,tmp,'/')) {
            stk.push_back(tmp);
        }
        return stk;
    }
    shared_ptr<Node> m;
public:
    FileSystem() {
        m = make_shared<Node>(0);
    }
    
    bool create(string path, int value) {
        auto words = split(path);
        auto current = m;
        for (int i = 1; i < words.size() - 1; ++i) {
            const auto& word = words[i];
            if (current->children.find(word) == current->children.end()) {
                return false;
            } else {
                current = current->children[word];
            }
        }
        if (current->children.find(words.back()) != current->children.end()) {
            return false;
        }
        current->children[words.back()] = make_shared<Node>(value);
        return true;
    }
    
    int get(string path) {
        auto words = split(path);
        auto current = m;
        for (int i = 1; i < words.size(); ++i) {
            const auto& word = words[i];
            if (current->children.find(word) == current->children.end()) {
                return -1;
            } else {
                current = current->children[word];
            }
        }
        return current->value;
    }
};

/**
 * Your FileSystem object will be instantiated and called as such:
 * FileSystem* obj = new FileSystem();
 * bool param_1 = obj->create(path,value);
 * int param_2 = obj->get(path);
 */
```

## 1167. Minimum Cost to Connect Sticks

贪心算法。每次选择cost最小的2个stick进行connect操作。一个stick越早被connect，它的长度越可能影响整个cost。

```cpp
class Solution {
public:
    int connectSticks(vector<int>& sticks) {
        /*N个sticks，需要N-1次connect
        4
            4,5,8 9
            8,9 17
            17
        */
        int ans = 0;
        priority_queue<int, vector<int>, greater<int>> pq;
        for (int s : sticks) {
            pq.push(s);
        }
        while (pq.size() > 1) {
            int smallest = pq.top();
            pq.pop();
            int second = pq.top();
            pq.pop();
            ans += smallest + second;
            pq.push(smallest + second);
        }
        return ans;
    }
};
```

## 1168. Optimize Water Distribution in a Village

最小生成树的变种。
pipe是边，除此之外，well也是边。可以当成是和水源连接的边。

时间复杂度: O(E log E)
空间复杂度: O(N)

```cpp
class Solution {
    struct UF {
        vector<int> parents;
        UF(int n) {
            parents.resize(n);
            for (int i = 0; i < n; ++i) {
                parents[i] = i;
            }
        }
        int find(int x) {
           return x == parents[x] ? x : parents[x] = find(x);
        }
        void unin(int x, int y) {
            int xp = find(x);
            int yp = find(y);
            parents[xp] = yp;
        }
    };
public:
    int minCostToSupplyWater(int n, vector<int>& wells, vector<vector<int>>& pipes) {
        // 最小生成树
        // 每次寻找最短的边
        vector<tuple<int, int, int>> edges;
        for (int i = 0; i < wells.size(); ++i) {
            edges.push_back(make_tuple(wells[i], 0, i + 1));
        }
        for (const auto& pipe : pipes) {
            edges.push_back(make_tuple(pipe[2], pipe[0], pipe[1]));
        }
        sort(edges.begin(), edges.end());
        UF uf(n + 1);
        int ans = 0;
        for (const auto& e : edges) {
            int cost = get<0>(e);
            int left = get<1>(e);
            int right = get<2>(e);
            if (uf.find(left) == uf.find(right))
                ;
            else {
                ans += cost;
                uf.unin(left, right);
            }
        }
        return ans;
    }
};
```