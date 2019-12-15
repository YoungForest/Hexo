---
title: Find all unique pairs of maximum and second maximum elements 子数组的最大值和次大值对
date: 2019-12-14 22:07:31
tags:
- Algorithm
categories:
- Programming
---

问题的根源是有个同学问了个lucky number的问题[Codeforces 280B](https://codeforces.com/problemset/problem/280/B), [Codeforces 281D](https://codeforces.com/problemset/problem/281/D)也是同样的问题。

幸运数的定义为：数组中子数组的最大值和次大值的XOR值。寻找所有幸运数中的最大的。

Brute force 的解法是枚举所有的子数组，时间复杂度为O(N ^ 2).
有没有更优的方法呢？
今天要讨论的就是这个问题。

## 通用的解法，快速寻找 最大次大值对 算法

寻找子数组中最大值和次大值其实是有快速算法的:
[Find all unique pairs of maximum and second maximum elements over all sub-arrays in O(NlogN)](https://www.geeksforgeeks.org/find-all-unique-pairs-of-maximum-and-second-maximum-elements-over-all-sub-arrays-in-onlogn/)

基于这个的观察：数组中的每个数，如果想要成为次大值，就只能和向前的第一个比他大的数 或 向后的第一个比他大的数组成。
我们可以维护一个 单调递减栈，加入新数时，维持单调递增需要弹出所有小于它的数，这时新数就是被弹出来的数后面的第一个比他大的数；栈顶中最大的数 就是 新数 向前的第一个比他大的数。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
#include <iostream>
#include <stack>
#include <vector>

using namespace std;
using ll = long long;

int solve() {
    ll N;
    cin >> N;
    vector<ll> nums(N);
    for (ll i = 0; i < N; ++i) {
        cin >> nums[i];
    }
    stack<ll> st;
    st.push(nums[0]);
    ll ans = 0;
    for (ll i = 1; i < N; ++i) {
        while (!st.empty() && nums[i] > st.top()) {
            ans = max(ans, nums[i] ^ st.top());
            st.pop();
        }
        if (!st.empty()) {
            ans = max(ans, nums[i] ^ st.top());
        }
        st.push(nums[i]);
    }
    return ans;
}

int main() {
    ll ans = solve();
    cout << ans << endl;
    return 0;
}
```

## 我独立思考出的解法

我的解法利用了XOR的性质，如果换成别的运算就不通用了。

首先遍历一遍找到最高的位数。
再遍历一遍找到最高的位数为1的那些数，我们先称其为 最高数。
从这些最高数出发，往两边扩充，直到遇到另一个最高数，在这个过程中寻找次大数并更新幸运数的最大值。可以证明，每个数最多被找2次。
所以，总的时间复杂度是 O(N), 空间复杂度 O(N).

```cpp
#include <iostream>
#include <vector>

using namespace std;
using ll = long long;

int solve() {
    int N;
    cin >> N;
    vector<ll> nums(N);
    for (ll i = 0; i < N; ++i) {
        cin >> nums[i];
    }
    const int MAX_BIT_BEGIN = 40;
    vector<vector<ll>> flag(MAX_BIT_BEGIN + 1, vector<ll>(2, 0));
    for (ll i : nums) {
        for (ll j = 0; j <= MAX_BIT_BEGIN; ++j) {
            ++flag[j][((i >> j) & 1)];
        }
    }
    ll max_bit = MAX_BIT_BEGIN;
    for (; max_bit >= 0; --max_bit) {
        if (flag[max_bit][0] > 0 && flag[max_bit][1] > 0) {
            break;
        }
    }
    if (max_bit == 0) {
        return 1;
    } else if (max_bit < 0) {
        return 0;
    } else {
        vector<ll> max_bit_is_1_indexs;
        for (ll i = 0; i < N; ++i) {
            if (((nums[i] >> max_bit) & 1) == 1) {
                max_bit_is_1_indexs.push_back(i);
            }
        }
        ll ans = 0;
        for (ll index : max_bit_is_1_indexs) {
            ll second_max = 0;
            for (ll i = index - 1; i >= 0 && ((nums[i] >> max_bit) & 1) == 0;
                 --i) {
                second_max = max(second_max, nums[i]);
                ans = max(ans, nums[index] ^ second_max);
            }
            second_max = 0;
            for (ll i = index + 1; i < N && ((nums[i] >> max_bit) & 1) == 0;
                 ++i) {
                second_max = max(second_max, nums[i]);
                ans = max(ans, nums[index] ^ second_max);
            }
        }
        return ans;
    }
}

int main() {
    ll ans = solve();
    cout << ans << endl;
    return 0;
}
```