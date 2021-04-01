---
title: kick start 2019 round G
date: 2019-10-20 18:53:36
tags:
- Competitive Programming
categories:
- KickStart
---

本轮是今年的倒数第二轮，也是相对比较简单的一个轮次。
我做出了第3题和1 2题的小数据集。第二题我本身的算法是对的，但是没有正确的评估最大的k的位数，并防止溢出操作，所以字大数据集上WA。第一题其实本身不难，只是我对约数不很敏感，导致错失没有想出更好的解法。总的来说，本轮是我最接近AC的轮次，运气相对不错，也提前1个小时完成了比赛。因为后来实在想不出解法 和 要注意的点了，就放弃了。

## Book Reading

暴力法加memo可以直接过。可以我的记忆化写错了，忘记记忆了。导致TLE，损失了不少分数，太可惜 了。
另外，能用`long long`就不要用`int`。否则最后的`ans`会溢出。

时间复杂度: O(N log (N)).

因为记忆化 的存在，计算的页数最多是`1 + 1 / 2 + 1 / 3 + ... + 1 / N = log N`, 即调和级数。

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;
using ll = long long;

int main() {
    ll T;
    cin >> T;
    for (ll iCase = 1; iCase <= T; ++iCase) {
        ll ans = 0;
        ll N, M, Q;
        cin >> N >> M >> Q;
        vector<bool> pages(N + 1, true);
        pages[0] = false;
        for (ll i = 0; i < M; ++i) {
            ll P;
            cin >> P;
            pages[P] = false;
        }
        unordered_map<ll, ll> memo;
        for (ll i = 0; i < Q; ++i) {
            ll R;
            cin >> R;
            ll count = 0;
            if (memo.find(R) != memo.end()) {
                count = memo[R];
            } else {
                for (ll j = 1; j * R <= N; ++j) {
                    if (pages[j * R]) {
                        ++count;
                    }
                }
                memo[R] = count;
            }
            ans += count;
        }
        cout << "Case #" << iCase << ": " << ans << endl;
    }
}
```

## The Equation

本题要注意的点相对比较多，本身算法并不难。
1. long long  常数是`1L`。否则`1`默认 是`int`，会有溢出风险。
2. 我们不能从A中的最高位开始找，因为可能k会是更大的数。而应该从 M的角度考虑k的最大值，这里M是15位的，对应二进制50位。然而，我们同样不能从太高的位开始找，否则 `N*( 1<<i )`会溢出64位。鉴于N最大是1000，二进制10位。我们可以从50~53位开始找。

因为要最大化k，所以我们可以使用贪心的思路，从高位向低位数，尽量放置1，否则放置0，超过要求回溯。

因为有大量的回溯剪枝的存在，时间复杂度不是很好分析。但可以过大的数据集。

```cpp
#include <iostream>
#include <vector>

using namespace std;
using ll = long long;

ll backtracking(const vector<ll> &bits, const ll N, const ll M, ll position,
                ll accu, ll k) {
    ll one = bits[position];
    ll zero = N - one;
    // k always wants to be 1 in position i
    ll i = position;
    if (position < 0) {
        return k;
    }

    ll ret = -1;
    if (accu + zero * (1L << i) <= M) { // if one
        ret = backtracking(bits, N, M, position - 1,
                           accu + zero * (1L << i),
                           k + (1L << i));
    }
    if (ret == -1) { // zero
        if (accu + one * (1L << i) <= M) {
            ret = backtracking(bits, N, M, position - 1,
                               accu + one * (1L << i), k);
        }
    }
    return ret;
}

int main() {
    ll T;
    cin >> T;
    for (ll iCase = 1; iCase <= T; ++iCase) {
        ll ans = 0;
        ll N, M;
        cin >> N >> M;
        vector<ll> bits(64, 0);
        ll max_position = 0;
        for (ll i = 0; i < N; ++i) {
            ll A;
            cin >> A;
            ll position = 0;
            while (A > 0) {
                ll last_bit = A % 2;
                if (last_bit > 0) {
                    ++bits[position];
                    max_position = max(max_position, position);
                }
                A = A / 2;
                ++position;
            }
        }
        ans = backtracking(bits, N, M, 53, 0, 0);

        cout << "Case #" << iCase << ": " << ans << endl;
    }
}
```

## Shifts

同第二题，我采用了回溯法加大量剪枝和记忆化，以枚举所有的组合。没想到竟然过了。

题解给出的方法是采用 分治法，分别枚举2个小的集合的组合。然后再遍历所有组合，寻找合并后符合要求的组合数。

```cpp
#include <cmath>
#include <iostream>
#include <map>
#include <vector>

using namespace std;
using ll = long long;

ll backtracking(const vector<ll> &A, const vector<ll> &B,
                const vector<ll> &suffixA, const vector<ll> &suffixB, ll needA,
                ll needB, ll position, map<tuple<ll, ll, ll>, ll> &memo,
                map<tuple<ll, ll>, ll> &memoA, map<tuple<ll, ll>, ll> &memoB) {
    const ll n = A.size();
    if (position >= n) {
        return needA <= 0 && needB <= 0 ? 1 : 0;
    }
    auto it = memo.find({needA, needB, position});
    if (it != memo.end()) {
        return it->second;
    }
    if (needA <= 0 && needB <= 0) {
        return memo[{needA, needB, position}] = pow(3, n - position);
    }
    if (needA > suffixA[position] || needB > suffixB[position]) {
        return memo[{needA, needB, position}] = 0;
    }
    if (needA <= 0) {
        auto it = memoA.find({needB, position});
        if (it != memoA.end()) {
            return it->second;
        }
    }
    if (needA <= 0) {
        auto it = memoA.find({needB, position});
        if (it != memoA.end()) {
            return it->second;
        }
    }
    if (needB <= 0) {
        auto it = memoB.find({needA, position});
        if (it != memoB.end()) {
            return it->second;
        }
    }
    ll ret = 0;
    ret += backtracking(A, B, suffixA, suffixB, needA - A[position],
                        needB - B[position], position + 1, memo, memoA, memoB);
    ret += backtracking(A, B, suffixA, suffixB, needA, needB - B[position],
                        position + 1, memo, memoA, memoB);
    ret += backtracking(A, B, suffixA, suffixB, needA - A[position], needB,
                        position + 1, memo, memoA, memoB);
    if (needA <= 0) {
        memoA[{needB, position}] = ret;
    }
    if (needB <= 0) {
        memoB[{needA, position}] = ret;
    }
    return memo[{needA, needB, position}] = ret;
}

int main() {
    ll T;
    cin >> T;
    for (ll iCase = 1; iCase <= T; ++iCase) {
        ll N, H;
        cin >> N >> H;
        vector<ll> A(N), B(N), suffixA(N), suffixB(N);
        for (int i = 0; i < N; ++i) {
            cin >> A[i];
        }
        for (int i = 0; i < N; ++i) {
            cin >> B[i];
        }
        if (N > 0) {
            suffixA[N - 1] = A[N - 1];
            suffixB[N - 1] = B[N - 1];
        }
        for (int i = N - 2; i >= 0; --i) {
            suffixA[i] = A[i] + suffixA[i + 1];
            suffixB[i] = B[i] + suffixB[i + 1];
        }
        map<tuple<ll, ll, ll>, ll> memo;
        map<tuple<ll, ll>, ll> memoA;
        map<tuple<ll, ll>, ll> memoB;
        auto ans =
            backtracking(A, B, suffixA, suffixB, H, H, 0, memo, memoA, memoB);

        cout << "Case #" << iCase << ": " << ans << endl;
    }
}
```