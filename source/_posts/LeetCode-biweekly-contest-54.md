---
title: LeetCode biweekly contest 54
date: 2021-06-16 01:36:43
tags:
- Competitive Programming
categories:
- LeetCode
translations:
  zh-CN: https://youngforest.github.io/2021/06/16/LeetCode-biweekly-contest-54/
  en: https://youngforest.github.io/en/2021/06/16/LeetCode-biweekly-contest-54/
---
| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 120 / 12076 | YoungForest | 18 | 	1:19:33 |  0:03:17 | 0:09:23 🐞1 |  0:26:15 | 1:04:33 🐞2 |

继续保持好成绩，尤其是最后一题，还是挺难的。刚开始没有思路甚至想放弃，但最后还是靠自己的思考解决了难题。

## 1893. Check if All the Integers in a Range Are Covered

签到题。对于`[right, right]`中每一个数，判断是否被`ranges`中的某个区间包含。

```cpp
class Solution {
public:
    bool isCovered(vector<vector<int>>& ranges, int left, int right) {
        auto cover = [&](const int i) -> bool {
            for (const auto& range : ranges) {
                const int l = range[0], r = range[1];
                if (l <= i && i <= r) return true;
            }
            return false;
        };
        for (int i = left; i <= right; ++i) {
            if (!cover(i)) return false;
        }
        return true;
    }
};
```

时间复杂度: O((right - left) * ranges.length),
空间复杂度: O(1).

## 1894. Find the Student that Will Replace the Chalk

先求前缀和，把k和和取余数，可以定位到最后一轮的遍历。然后用二分搜索寻找恰好大于k的位置，即为需要更换粉笔的学生。

```cpp
class Solution {
    using ll = long long;
public:
    int chalkReplacer(vector<int>& chalk, int k) {
        const int n = chalk.size();
        vector<ll> presum(n + 1);
        presum[0] = 0;
        for (int i = 0; i < n; ++i) {
            presum[i+1] = presum[i] + chalk[i];
        }
        if (k >= presum.back()) {
            k = k % presum.back();
        }
        // the first index, presum[i] > k
        auto it = upper_bound(presum.begin(), presum.end(), k);
        return distance(presum.begin(), it) - 1;
    }
};
```

时间复杂度: O(N + log N), N = chalk.length,
空间复杂度: O(chalk.length).

需要注意数据范围，计算前缀和时可能会`int`溢出。我也因此Runtime Error一次。换成`long long`就好了。LeetCode最近坑溢出的case越来越多了，以后遇到需要先预估一下最大的值，该用`long long`用`long long`.

## 1895. Largest Magic Square

暴力法：从大到小枚举所有的正方形，计算所有行、列、对角的和，判断是否相等。唯一的优化是采用前缀和，快速计算行列和。

```cpp
class Solution {
public:
    int largestMagicSquare(vector<vector<int>>& grid) {
        const int m = grid.size();
        const int n = grid[0].size();
        vector<vector<int>> presumLeft(m, vector<int>(n + 1));
        for (int i = 0; i < m; ++i) {
            presumLeft[i][0] = 0;
            for (int j = 0; j < n; ++j) {
                presumLeft[i][j+1] = presumLeft[i][j] + grid[i][j];
            }
        }
        vector<vector<int>> presumUp(m + 1, vector<int>(n));
        for (int j = 0; j < n; ++j) {
            presumUp[0][j] = 0;
        }
        for (int j = 0; j < n; ++j) {
            for (int i = 0; i < m; ++i) {
                presumUp[i+1][j] = presumUp[i][j] + grid[i][j];
            }
        }
        
        auto check = [&](const int i, const int j, const int k) -> bool {
            int target = presumLeft[i][j+k] - presumLeft[i][j];
            for (int row = 1; row < k; ++row) {
                if (target != presumLeft[i+row][j+k] - presumLeft[i+row][j]) return false;
            }
            for (int col = 0; col < k; ++col) {
                if (target != presumUp[i+k][j+col] - presumUp[i][j+col]) return false;
            }
            {
                int diagonal = 0;
                for (int row = 0; row < k; ++row) {
                    diagonal += grid[i+row][j+row];
                }
                if (diagonal != target) return false;
            }
            {
                int diagonal = 0;
                for (int row = 0; row < k; ++row) {
                    diagonal += grid[i+row][j+k-1-row];
                }
                if (diagonal != target) return false;
            }
            
            return true;
        };
        
        for (int k = min(n, m); k > 0; --k) {
            for (int i = 0; i < m; ++i) {
                for (int j = 0; j < n; ++j) {
                    if (i + k <= m && j + k <= n && check(i, j, k)) return k;
                }
            }
        }
        
        return 1;
    }
};
```

时间复杂度: O(N^4),
空间复杂度: O(N^2).

## 1896. Minimum Cost to Change the Final Value of Expression

递归，根据 & | 和 子表达式的值 进行分类，寻找最小cost。
括号的处理需要提前用栈，找到所有的配对。

```python
class Solution:
    def minOperationsToFlip(self, expression: str) -> int:
        n = len(expression)
        leftPair = {}
        left = 0
        leftStack = []
        for i in range(n):
            if expression[i] == ')':
                left -= 1
                leftPair[i] = leftStack.pop()
            elif expression[i] == '(':
                left += 1
                leftStack.append(i)
        def dp(i, j):
            # [i, j)
            if i + 1 == j: # 0, 1
                return expression[i] == '1', 1
            else:
                if expression[j-1] == ')':
                    leftIndex = leftPair[j-1]
                    if leftIndex == i: return dp(i+1,j-1)
                    pivot = leftIndex - 1
                else:
                    # 0, 1
                    pivot = j - 2
                    
                if expression[pivot] == '0' or expression[pivot] == '1': pivot -= 1
                leftResult, leftCost = dp(i, pivot)
                rightResult, rightCost = dp(pivot+1, j)
                if expression[pivot] == '|':
                    if leftResult == False and rightResult == False:
                        return False, min(leftCost, rightCost)
                    elif leftResult == True and rightResult == False:
                        return True, 1
                    elif leftResult == False and rightResult == True:
                        return True, 1
                    else:
                        return True, min(leftCost + 1, rightCost + 1)
                elif expression[pivot] == '&':
                    if leftResult == False and rightResult == False:
                        return False, min(leftCost + 1, rightCost + 1)
                    elif leftResult == True and rightResult == False:
                        return False, 1
                    elif leftResult == False and rightResult == True:
                        return False, 1
                    else:
                        return True, min(leftCost, rightCost)
                
        return dp(0, len(expression))[1]
```

时间复杂度: O(N),
空间复杂度: O(N).