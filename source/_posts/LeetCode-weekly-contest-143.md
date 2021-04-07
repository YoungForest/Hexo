---
title: LeetCode weekly contest 143
date: 2019-07-01 10:22:51
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (5) |	Q2 (5) |	Q3 (8) |	Q4 (8)|
|--|--|--|--|--|--|--|--|
| 396 / 4272 |	YoungForest | 14 | 1:01:14 | 0:11:38 | 0:28:38 | 0:56:14 1 | null |

## 1103. Distribute Candies to People

Brute force. 模拟整个分配过程。

时间复杂度: `O(sqrt(candies.size()))`. 因为`1 + 2 + ... + n = n * (n + 1) / 2 = candies.size()`.
空间复杂度: `O(num_people)`.

```cpp
class Solution {
public:
    vector<int> distributeCandies(int candies, int num_people) {
        vector<int> ret(num_people, 0);
        int row = 0;
        while (candies > 0) {
            for (int i = 0; i < ret.size() && candies > 0; ++i) {
                ret[i] += min(candies, row * num_people + i + 1);
                candies -= min(candies, row * num_people + i + 1);
            }
            ++row;
        }
        return ret;
    }
};
```

## 1104. Path In Zigzag Labelled Binary Tree

利用2个算法
- 如果是顺序编号的话，父节点编号为 子节点编号 / 2 向下取整。
- 反序编号，可以转成顺序编号。

时间复杂度: O(log N),
空间复杂度: O(1).

```cpp
class Solution {
    int getLevel(int label) {
        int level = 0;
        while (label > 0) {
            label >>= 1;
            ++level;
        }
        return level - 1;
    }
    int complete(int label, int level) {
        return (1<<(level + 1)) - 1 - label + (1<<level);
    }
public:
    vector<int> pathInZigZagTree(int label) {
        int n = getLevel(label);
        const int level = n + 1;
        // cout << level << endl;
        vector<int> ret(level);
        int true_label = label;
        if (n % 2 == 1) {
            true_label = complete(label, n);
        }
        ret[n] = true_label;
        for (int i = n - 1; i >= 0; --i) {
            ret[i] = ret[i + 1] / 2;
        }
        // for (int i = 0; i <= n; ++i) {
        //     cout << ret[i] << " ";
        // }
        for (int i = 0; i <= n; ++i) {
            if (i % 2 == 1)
                ret[i] = complete(ret[i], i);
        }
        return ret;
    }
};
```

## 1105. Filling Bookcase Shelves

回溯法 + 剪枝。
时间复杂度: O(2^N), 实际上因为剪枝会小的多。
空间复杂度: O(N).

```cpp
class Solution {
    vector<vector<int>> local_min;
    int global_min = numeric_limits<int>::max();
    void backtracking(const vector<vector<int>>& books, const int shelf_width, int i, int current_level_height, int height_before, int width) {
        if (i >= books.size()) {
            global_min = min(global_min, current_level_height + height_before);
            return;
        }
        if (current_level_height + height_before >= global_min)
            return;
        const int w = books[i][0];
        const int h = books[i][1];
        if (local_min.at(i).at(width) <= height_before + max(current_level_height, h)) {
            return;
        }
        local_min.at(i).at(width) = height_before + max(current_level_height, h);
        if (w + width <= shelf_width) {
            backtracking(books, shelf_width, i + 1, max(current_level_height, h), height_before, width + w);
        }
        backtracking(books, shelf_width, i + 1, h, height_before + current_level_height, w);
    }
public:
    int minHeightShelves(vector<vector<int>>& books, int shelf_width) {
        const int n = books.size();
        local_min = vector<vector<int>> (n, vector<int> (shelf_width + 1, numeric_limits<int>::max()));
        backtracking(books, shelf_width, 0, 0, 0, 0);
        
        return global_min;
    }
};
```

实际上还可以通过DP解决该问题：[Discuss](https://leetcode.com/problems/filling-bookcase-shelves/discuss/323368/ChineseC++-1105.-DP)

## 1106. Parsing A Boolean Expression

词法分析。
时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
    // op: o not, 1 and, 2 or
    bool parseNot(const string& expression, int& i) {
        // cout << "parseNot (" << i << "): " << expression.at(i) << endl;
        ++i; // skip '('
        bool ret = parse(expression, i);
        ++i; // skip ')'
        return !ret;
    }
    bool parseAnd(const string& expression, int& i) {
        // cout << "parseAnd (" << i << "): " << expression.at(i) << endl;
        bool ret = true;
        while (expression.at(i) != ')') {
            ++i; // skip ',' or '('
            ret = parse(expression, i) && ret;  // Warning: ret 必需写到后面，在比赛过程中，由于我写到前面了。忽略了逻辑短路问题，一直wrong answer。功亏一篑。
        }
        ++i;    // skip ')'
        return ret;
    }
    bool parseOr(const string& expression, int& i) {
        // cout << "parseOr (" << i << "): " << expression.at(i) << endl;
        bool ret = false;
        while (expression.at(i) != ')') {
            ++i; // skip ',' or '('
            ret = parse(expression, i) || ret;
        }
        ++i;    // skip ')'
        return ret;
    }
    bool parse(const string& expression, int& i) {
        // cout << "parse (" << i << "): " << expression.at(i) << endl;
        char head = expression.at(i);
        switch (head) {
            case 't':
                ++i; // skip 't'
                return true;
            case 'f':
                ++i;
                return false;
            case '!':
                ++i;
                return parseNot(expression, i);
            case '&':
                ++i;
                return parseAnd(expression, i);
            case '|':
                ++i;
                return parseOr(expression, i);
            default:
                cout << "error: " << head << endl;
                return false;
        }
    }
public:
    bool parseBoolExpr(string expression) {
        int pos = 0;
        return parse(expression, pos);
    }
};
```