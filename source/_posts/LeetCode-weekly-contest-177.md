---
title: LeetCode weekly contest 177
date: 2020-02-23 12:12:46
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (4) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 333 / 6106 |	YoungForest | 	20 | 1:04:22 | 0:25:00 | 0:33:40 | 0:43:21 | 0:59:22  1 |

手速和bug-free的场。

## 1360. Number of Days Between Two Dates

计算2个日期间的差值。本来想着手算来着，但写起来太复杂了。后来果断放弃，投机取巧用了Python日期处理的库函数。

时间复杂度: O(1),
空间复杂度: O(1).

```python
from datetime import date

class Solution:
    def daysBetweenDates(self, date1: str, date2: str) -> int:
        delta = date.fromisoformat(date1) - date.fromisoformat(date2)
        return abs(delta.days)
```

## 1361. Validate Binary Tree Nodes

观察有，合法的二叉树为：
1. 有且仅有一个节点没有父节点
2. 剩下节点均只有一个父节点
3. 没有孤儿，既没有父亲、也没有child（在节点数大于1的情况下）

第3个要求比较难想到，甚至是OJ一开始也是错的。我也就将错就错通过了。感谢[votrubac](https://leetcode.com/problems/validate-binary-tree-nodes/discuss/517596/Count-Parents-and-Orphans-O(n))的提示。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    bool validateBinaryTreeNodes(int n, vector<int>& leftChild, vector<int>& rightChild) {
        if (n < 2)
            return true;
        vector<int> parents(n, -1);
        vector<bool> hasChild(n, false);
        auto fillParents = [&](int index, int parent) -> bool {
            if (parents[index] != -1)
                return false;
            parents[index] = parent;
            return true;
        };
        for (int i = 0; i < n; ++i) {
            for (int child : {leftChild[i], rightChild[i]}) {
                if (child != -1) {
                    if(fillParents(child, i) == false)
                        return false;
                }
            }
            hasChild[i] = leftChild[i] != -1 || rightChild[i] != -1;
        }
        int count = 0;
        for (int i : parents) {
            if (i == -1) {
                if (hasChild[i] == false)
                    return false;
                ++count;
            }
        }
        return count == 1;
    }
};
```

## 1362. Closest Divisors

使用贪心的策略。从sqrt(n)开始进行枚举，此时差就是最小的。

时间复杂度: O(sqrt(n)),
空间复杂度: O(1).

```cpp
class Solution {
    pair<int, int> current(int n) {
        for (int i = floor(sqrt(n)); i >= 1; --i) {
            if (n % i == 0) {
                return {i, n / i};
            }
        }
        return {0, 0};
    }
public:
    vector<int> closestDivisors(int num) {
        auto p1 = current(num + 1);
        auto p2 = current(num + 2);
        if (abs(p1.first - p1.second) < abs(p2.second - p2.first)) {
            return {p1.first, p1.second};
        } else {
            return {p2.first, p2.second};
        }
    }
};
```

## 1363. Largest Multiple of Three

总体上是一个贪心的思路。
首先考虑一个更简单的问题：
如何组成最大的数组->最大的放前面。
在加入被3整除这一约束条件后，
我们有观察，剩下的数字越多越好，其次是删掉的数越小越好。
此时，就有了如下算法。

因为错将`multiset`用作`set`，导致了一次Wrong Answer. 这不是第一次犯类似的错误了。以后考虑使用`set`时，需要提前想想允不允许重复。

时间复杂度: O(n log n),
空间复杂度: O(n).

```cpp
class Solution {
    // n log n
public:
    string largestMultipleOfThree(vector<int>& digits) {
        vector<multiset<int>> remind(3);
        int all = 0;
        for (int i : digits) {
            remind[i % 3].insert(i);
            all += i;
        }
        auto remove = [&](int one, int two) -> bool {
            if (remind[one].empty()) {
                if (remind[two].size() >= 2) {
                    remind[two].erase(remind[two].begin());
                    remind[two].erase(remind[two].begin());
                } else {
                    return false;
                }
            } else {
                remind[one].erase(remind[one].begin());
            }
            return true;
        };
        if (all % 3 == 0) {
            
        } else if (all % 3 == 1) {
            if (remove(1, 2) == false)
                return "";
        } else {
            if (remove(2, 1) == false)
                return "";
        }
        vector<int> v;
        for (const auto& s : remind) {
            for (int i : s) {
                v.push_back(i);
            }
        }
        sort(v.begin(), v.end(), greater<int>());
        string ans;
        for (int i : v) {
            ans += to_string(i);
        }
        if (ans[0] == '0')
            return "0";
        else
            return ans;
    }
};
```