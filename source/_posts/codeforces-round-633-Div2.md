---
title: codeforces round 633 Div2
date: 2020-04-12 22:06:55
tags:
- codeforces
- contest
categories:
- Programming
---

[官方题解](https://codeforces.com/blog/entry/75913)

codeforces上题目一般高于平时的面试题。如果是为了面试的话，只刷LeetCode就可以了。不过如果是对算法和竞赛感兴趣，强烈鼓励试一试。题目的数量和质量都远超LeetCode。而且为不同水平的同学有不同的赛道，题目难度也不同。对于高水平玩家来说，竞赛体验会好的多。

我目前共参加过2场Div.2，rating 1480。没错，初始值是1500，我反而掉下来了。

## A. Filling Diamonds

可以用动态规划的方式思考这个问题。对于长度为n的belt来说，共有2种状态：

0.
\
/

和
1.
/
\

状态转移方程有:
dp[n][0] = dp[n-1][1] + dp[n-1][0],
dp[n][1] = dp[n-1][1].

对于初始值有:
dp[0][1] = 1,
dp[0][0] = 0.

答案为: dp[n][0].

通过该方程可以很快地得出`dp[n][0] = n`。

时间复杂度: O(1),
空间复杂度: O(1).

```cpp
#include <iostream>
#include <vector>

using namespace std;

using ll = long long;

int main() {
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        cout << n << endl;
    }
    return 0;
}
```

出题人也很骄傲地说，这是目前最简单的Div.2 A了。代码很简单，但是思路还挺巧妙。

## B. Sorted Adjacent Differences

贪心。先排序，从中间开始选，向右跳一下，向左跳一下。

时间复杂度: O(n log n),
空间复杂度: O(n).

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int SIZE = 1e5 + 5;

using ll = long long;

vector<int> a(SIZE);

int main() {
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        for (int i = 0; i < n; ++i){
            cin >> a[i];
        }
        sort(a.begin(), a.begin() + n);
        int current = (n - 1) / 2;
        int left = current, right = current;
        bool direction = true;
        // [left, right]
        while (current >= 0 && current < n) {
            cout << a[current] << " ";
            if (direction) {
                ++right;
                current = right;
            } else {
                --left;
                current = left;
            }
            direction = !direction;
        }
        cout << endl;
    }
    return 0;
}
```

## C. Powered Addition

问题可以转化为: 可以给数组中的任何数 加 最多 2^k - 1. 使得整个数组非递减。求最小的k.

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

using ll = long long;

int main() {
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        ll max_value_in_array = numeric_limits<ll>::min();
        ll max_demand = 0;
        for (int i = 0; i < n; ++i){
            ll current;
            cin >> current;
            if (current > max_value_in_array) {
                max_value_in_array = current;
            } else {
                max_demand = max(max_demand, max_value_in_array - current);
            }
        }
        int ans = 0;
        ll could_present = 1;
        while (could_present <= max_demand) {
            ++ans;
            could_present *= 2;
        }
        cout << ans << endl;
    }
    return 0;
}
```
