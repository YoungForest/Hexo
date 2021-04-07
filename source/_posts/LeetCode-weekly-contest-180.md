---
title: LeetCode weekly contest 180
date: 2020-03-15 22:04:28
tags:
- Competitive Programming
categories:
- LeetCode
---

自从LeetCode[更新了周赛rating算法](https://leetcode.com/discuss/general-discussion/518516/New-Rating-Algorithm-Details-Contest-Season-and-Absence-in-Participation)后，结果下我一跳。Rating直接涨到2171，全球排名608/81184, 完成比赛53场。记得上周我还在期望可以近几周突破2000分的，已经1990+了。更新后的算法显示去年8月份就已经2000了。

本周日会村里看望奶奶，由于疫情原因，之前一家人一直未能团聚。今天好不容易，几乎所有人都到场了。周赛也是回老家参加的。由于环境不适合思考，所以结果也差强人意。

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (4) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 1300 / 10047 |	YoungForest | 	11	 | 0:29:31 | 0:12:20 | 0:18:26 | 0:29:31 | null |

## 1380. Lucky Numbers in a Matrix

统计每行的最小值所在的列数和每列最大值所在的行数，判断是否有相等的。

时间复杂度: O(m * n),
空间复杂度: O(m + n).

```cpp
class Solution {
public:
    vector<int> luckyNumbers (vector<vector<int>>& matrix) {
        const int m =  matrix.size();
        if (m == 0) return {};
        const  int n = matrix[0].size();
        vector<int> row_min_index(m, -1);
        vector<int> col_max_index(n, -1);
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (row_min_index[i] == -1 || matrix[i][row_min_index[i]] > matrix[i][j]) {
                    row_min_index[i] = j;
                }
                if (col_max_index[j] == -1 || matrix[col_max_index[j]][j] < matrix[i][j]) {
                    col_max_index[j] = i;
                }
            }
        }
        vector<int> ans;
        for (int row = 0; row < m; ++row) {
            if (col_max_index[row_min_index[row]] == row) {
                ans.push_back(matrix[row][row_min_index[row]]);
            }
        }
        return ans;
    }
};
```

## 1381. Design a Stack With Increment Operation

用数组实现栈即可。

时间复杂度:
- Constructor: O(1)
- push: O(1)
- pop: O(1)
- increment: O(k)
空间复杂度: O(maxSize)

还有一种[Lazy Increment的算法](https://leetcode.com/problems/design-a-stack-with-increment-operation/discuss/539716/JavaC++Python-Lazy-increment-O(1))，increment时，只做一个标记，只有到pop的时候才真的增加。可以实现increment的O(1).

```cpp
class CustomStack {
    vector<int> data;
    int index;
    int max_size;
public:
    CustomStack(int maxSize) {
        data.resize(maxSize);
        index = 0;
        max_size = maxSize;
    }
    
    void push(int x) {
        if (index < max_size) {
            data[index++] = x;
        }
    }
    
    int pop() {
        if (index > 0) {
            return data[--index];
        } else {
            return -1;
        }
    }
    
    void increment(int k, int val) {
        for (int i = 0; i < k && i < index; ++i) {
            data[i] += val;
        }
    }
};

/**
 * Your CustomStack object will be instantiated and called as such:
 * CustomStack* obj = new CustomStack(maxSize);
 * obj->push(x);
 * int param_2 = obj->pop();
 * obj->increment(k,val);
 */
```

## 1382. Balance a Binary Search Tree

先用中序遍历将数据排序，然后再使用二分法重新建树。

时间复杂度: O(N),
空间复杂度: O(height).

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* balanceBST(TreeNode* root) {
        if (!root) return nullptr;
        vector<int> element;
        function<void(TreeNode*)> store = [&](TreeNode* root) -> void {
            if (!root) {
                return;
            } else {
                store(root->left);
                element.push_back(root->val);
                store(root->right);
            }
        };
        store(root);
        function<TreeNode*(int, int)> build = [&](int begin, int end) -> TreeNode* {
            if (begin > end) return nullptr;
            else if (begin == end) return new TreeNode(element[begin]);
            else {
                int mid = begin + (end - begin) / 2;
                auto ret = new TreeNode(element[mid]);
                ret->left = build(begin, mid - 1);
                ret->right = build(mid + 1, end);
                return ret;
            }
        };
        return build(0, element.size() - 1);
    }
};
```

## 1383. Maximum Performance of a Team

贪心的算法。先按照efficiency从大到小排序，挑选效率最高的k个人，然后再遍历效率稍低的人，尝试把他们加入队伍(剔除掉speed最小的), 更新可能的Maximum performance.

时间复杂度: O(N log N + N log K),
空间复杂度: O(N + K).

相似的题目: [LeetCode 857](https://leetcode.com/problems/minimum-cost-to-hire-k-workers/description/).

```cpp
class Solution {
    using ll = long long;
    const ll MOD = 1e9 + 7;
    const ll INF = 0x3f3f3f3f;
public:
    int maxPerformance(int n, vector<int>& speed, vector<int>& efficiency, int k) {
        ll ans = 0;
        priority_queue<int, vector<int>, greater<int>> pq;
        vector<pair<int, int>> workers;
        for (int i = 0; i < n; ++i) {
            workers.push_back({efficiency[i], speed[i]});
        }
        sort(workers.begin(), workers.end(), greater<pair<int, int>>());
        ll sum_speed = 0;
        ll min_efficiency = INF;
        for (int i = 0; i < k; ++i) {
            sum_speed += workers[i].second;
            min_efficiency = workers[i].first;
            pq.push(workers[i].second);
            ans = max(sum_speed * min_efficiency, ans);
        }
        for (int i = k; i < n; ++i) {
            min_efficiency = workers[i].first;
            if (workers[i].second > pq.top()) {
                auto t = pq.top();
                pq.pop();
                sum_speed = sum_speed - t + workers[i].second;
                pq.push(workers[i].second);
                ans = max(ans, sum_speed * min_efficiency);
            }
        }
        return ans % MOD;
    }
};
```