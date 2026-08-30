---
title: LeetCode 周赛 259
date: 2021-09-22 20:31:19
tags:
- Competitive Programming
categories:
- LeetCode
description: LeetCode 周赛 259 补题：操作模拟、数组美丽值、正方形检测与重复子序列。
translations:
  zh-CN: https://youngforest.github.io/2021/09/22/LeetCode-weekly-contest-259/
  en: https://youngforest.github.io/en/2021/09/22/LeetCode-weekly-contest-259/
---

<figure class="editorial-illustration editorial-illustration--hero"><img src="/images/ai/LeetCode-weekly-contest-259/zh-hero.webp" width="1536" height="864" alt="Forest 在月光下回到赛后工坊，调试双向拨杆、单调花圃与正方形点阵，最后一箱仍未开启" decoding="async" fetchpriority="high"></figure>

[LeetCode 周赛 259](https://leetcode.com/contest/weekly-contest-259/)

这个周末是中国的中秋节，是一家人团聚的传统节日。我是农村长大的，家人在另一个省份——山西，离我学习和工作的北京大约 1000 公里，所以没法回去看父母。幸运的是，我女朋友在北京长大，她的父母邀请我们回家吃午饭和晚饭。因为女儿喜欢吃，他们准备了很多海鲜。这就是我没有参加本场比赛的理由。

赛后我补完了这些题，现在分享自己的思路和解法。

所以这里没有成绩表。

<!-- more -->

## 2011. 执行操作后的变量值

签到题。一个可以把四种操作简化成两种的技巧是：中间字符（`operations[i][1]`）决定执行自增还是自减。利用这一点可以简化代码。

```cpp
class Solution {
public:
    int finalValueAfterOperations(vector<string>& operations) {
        int ans = 0;
        for (const auto& s : operations) {
            if (s[1] == '-') {
                --ans;
            } else {
                ++ans;
            }
        }
        return ans;
    }
};
```

时间复杂度：O(N)，其中 `N = operations.size()`。

空间复杂度：O(1)。

## 2012. 数组美丽值求和

对于得分为 2 的情况，要把 `nums[i]` 与 `i` 之前的最大值、`i` 之后的最小值比较。我们用一个变量记录并更新前面的最大值，并预先计算一个数组来记录后面的最小值。

对于得分为 1 的情况，只需要把 `nums[i]` 与 `nums[i-1]`、`nums[i+1]` 比较。

```cpp
class Solution {
public:
    int sumOfBeauties(vector<int>& nums) {
        const int n = nums.size();
        vector<int> smallestNumber(n + 1);
        smallestNumber[n] = numeric_limits<int>::max();
        for (int i = n-1; i >= 0; --i) {
            smallestNumber[i] = min(nums[i], smallestNumber[i+1]);
        }
        int largestNumber = nums[0];
        int ans = 0;
        for (int i = 1; i < n - 1; ++i) {
            int score = 0;
            if (largestNumber < nums[i] && nums[i] < smallestNumber[i+1]) {
                score = 2;
            } else if (nums[i-1] < nums[i] && nums[i] < nums[i+1]) {
                score = 1;
            }
            largestNumber = max(largestNumber, nums[i]);
            ans += score;
        }
        return ans;
    }
};
```

时间复杂度：O(n)。

空间复杂度：O(n)。

## 2013. 检测正方形

注意：要求的是**正方形**，不是**矩形**。

我因为这个误解浪费了很多时间。幸好不是在正式比赛里发生的。

使用 `unordered_map<int, map<int, int>>` 存储所有点。统计正方形时，遍历每一列并找出宽度，再利用宽度寻找另外两个点。

```cpp
class DetectSquares {
    static constexpr int MX = 1001;
    unordered_map<int, map<int, int>> points;
public:
    DetectSquares() {

    }

    void add(vector<int> point) {
        ++points[point[0]][point[1]];
    }

    int count(vector<int> point) {
        // iterate in Y axis, iterate in X axis
        // time complexity: n
        const int x = point[0];
        const int y = point[1];
        const auto& row = points[x];
        int ans = 0;
        for (const auto& p : points) {
            if (p.first == x) continue;
            const auto& row2 = p.second;
            auto it = row2.find(y);
            if (it != row2.end()) {
                // find D
                const int width = abs(p.first - x);
                for (int i : {+width, -width}) {
                    auto itB = row.find(y + i);
                    auto itC = row2.find(y + i);
                    if (itB != row.end() && itC != row2.end()) {
                        ans += it->second * itB->second * itC -> second;
                    }
                }
            }
        }
        return ans;
    }
};

/**
 * Your DetectSquares object will be instantiated and called as such:
 * DetectSquares* obj = new DetectSquares();
 * obj->add(point);
 * int param_2 = obj->count(point);
 */
```

时间复杂度：

- DetectSquares：O(1)
- add：O(log n)
- count：O(n log n)

空间复杂度：O(n)，其中 n 为点的数量。

## 2014. 重复 K 次的最长子序列
