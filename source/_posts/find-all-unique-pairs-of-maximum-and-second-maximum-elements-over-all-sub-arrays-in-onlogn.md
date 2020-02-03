---
title: Find all unique pairs of maximum and second maximum elements 子数组的最大值和次大值对
date: 2019-12-14 22:07:31
tags:
categories:
---

问题的根源是有个同学问了个lucky number的问题[Codeforces 280B](https://codeforces.com/problemset/problem/280/B), [Codeforces 281D](https://codeforces.com/problemset/problem/281/D)也是同样的问题。



[Find all unique pairs of maximum and second maximum elements over all sub-arrays in O(NlogN)](https://www.geeksforgeeks.org/find-all-unique-pairs-of-maximum-and-second-maximum-elements-over-all-sub-arrays-in-onlogn/)

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