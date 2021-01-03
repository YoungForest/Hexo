---
title: LeetCode biweekly contest 42
date: 2020-12-27 22:12:29
tags:
- LeetCode
categories:
- Programming
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 573 / 6631 | YoungForest | 12 | 0:51:14 |  0:19:42 | 0:24:42  1 |  0:46:14 | 差一分钟debug出来，好气呀！ |

## 1700. Number of Students Unable to Eat Lunch

模拟题目中描述的吃饭的过程。事实上因为判断结束条件的原因，实现起来还不是那么直接了当。

```cpp
class Solution {
public:
    int countStudents(vector<int>& students, vector<int>& sandwiches) {
        const int n = students.size();
        int ans = 0;
        queue<int> stu;
        for (int i : students) {
            stu.push(i);
        }
        stack<int> sand;
        for (int i = sandwiches.size() - 1; i >= 0; --i) {
            sand.push(sandwiches[i]);
        }
        while (!stu.empty()) {
            int current = stu.size();
            while (!stu.empty()) {
                int s = stu.front();
                stu.pop();
                if (s == sand.top()) {
                    sand.pop();
                    ++ans;
                    break;
                } else {
                    --current;
                    stu.push(s);
                    if (current == 0) {
                        return n - ans;
                    }
                }
            }
        }
        return 0;
    }
};
```

时间复杂度: O(students.size() * sandwiches.size()),
空间复杂度: O(students.size() + sandwiches.size()).

其实我的实现想复杂了。因为要有遍历学生的操作，所以学生的顺序其实是无所谓的。统计学生喜欢的种类，然后不断判断sandwiches栈顶元素是否满足条件。

## 1701. Average Waiting Time

模拟做饭的过程。对于每一个顾客，判断他来时是否可以直接开始做饭。

```cpp
class Solution {
    using ll = long long;
public:
    double averageWaitingTime(vector<vector<int>>& customers) {
        ll wait = 0;
        ll current = 0;
        for (const auto& v : customers) {
            if (current <= v[0]) {
                current = v[0] + v[1];
                wait += v[1];
            } else {
                wait += (current + v[1] - v[0]);
                current += v[1];
            }
        }
        double n = customers.size();
        return wait / n;
    }
};
```

时间复杂度: O(customers.size()),
空间复杂度: O(1).

## 1702. Maximum Binary String After Change

贪心，思路见注释。

```cpp
class Solution {
    // greedy: change first two op
    // 00 -> 10
    // 01 -> change after substring, 后面可以是0吗？010 -> 001 -> 101, recurse i + 1
    //                             是 1 变 0，找0 向后传导即可。
    // 10 -> do not change, recurse i + 1
    // 11 -> do not change, recurse i + 2
    
    // 时间复杂度： N * 4
    
    // 1 会越变越多，然后往后移
public:
    string maximumBinaryString(string binary) {
        int firstZero = -1;
        auto updateFirstZero = [&]() -> void {
            ++firstZero;
            while (firstZero < binary.size() && binary[firstZero] != '0') {
                ++firstZero;
            }
        };
        updateFirstZero();
        function<void(const int)> recurse = [&](const int i) -> void {
            if (i >= binary.size()) return;
            if (i + 1 == binary.size()) {
                return;
            }
            auto begin = binary.substr(i, 2);
            if (begin == "11") {
                recurse(i + 2);
            } else if (begin == "10") {
                recurse(i + 1);
            } else if (begin == "00") {
                binary[i] = '1';
                recurse(i + 1);
            } else { // "01"
                while (firstZero <= i) {
                    updateFirstZero();
                }
                if (firstZero >= binary.size()) return;
                binary[firstZero] = '1';
                updateFirstZero();
                binary[i] = '1';
                binary[i + 1] = '0';
                binary[i + 2] = '1';
                recurse(i + 1);
            }
        };
        recurse(0);
        return binary;
    }
};
```

时间复杂度: O(binary.size()),
空间复杂度: O(binary.size()).

实际上，
也有[寒神更简单的解法](https://leetcode.com/problems/maximum-binary-string-after-change/discuss/987335/JavaC%2B%2BPython-Solution-with-Explanation).


## 1703. Minimum Adjacent Swaps for K Consecutive Ones

枚举集合中心位置，双指针更新左右边界。

```cpp
template <typename T>
ostream& operator <<(ostream& out, const vector<T>& a) {
  out << "["; bool first = true;
  for (auto& v : a) { out << (first ? "" : ", "); out << v; first = 0;} out << "]";
  return out;
}
class Solution {
    // 二分？ 如何判定？N * log N
    // greedy, 向密的地方靠近
    // 把1移到对应位置的花费是中间0的数目
    // 遍历集合地点，然后左右找k个1. N * K
    // 右边取 x 个，左边取 k - x个
    // 贪心， 左边右边谁近取谁
    // 更新集合位置，双指针更新左右边界
public:
    int minMoves(vector<int>& nums, int k) {
        vector<int> ones;
        int zero = 0;
        for (int i : nums) {
            if (i == 1) {
                ones.push_back(zero);
            } else {
                ++zero;
            }
        }
        zero = 0;
        int one = 0;
        int left = 0, right = 0;
        int ans = 0;
        int currentAns = 0;
        // [left, right)
        for (; right < k; ++right) {
            currentAns += ones[right];
        }
        ans = currentAns;
        for (int mid = 0; mid < nums.size(); ++mid) {
            if (nums[mid] == 0) {
                ++zero;
                currentAns -= right - one; // right
                currentAns += one - left; // left;
            } else {
                ++one;
            }
            
            while (right < ones.size() && ones[right] - zero <= zero - ones[left]) {
                currentAns += ones[right] - zero - (zero - ones[left]);
                ++right;
                ++left;
            }
            ans = min(ans, currentAns);
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

比赛过程中，因为写了2个 bug 调了半个小时。差一分钟没交上，亏死了。