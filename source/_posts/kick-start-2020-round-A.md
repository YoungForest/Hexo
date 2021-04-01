---
title: kick start 2020 round A
date: 2020-03-22 14:43:50
tags:
- Competitive Programming
categories:
- KickStart
---

新一年的kick start有了些许变化：
1. 所有测试结果正确与否立即返回。之前是大的数据集的测试结果赛后才能看到。相当于是降低了难度，减少了参赛者失误的代价。之前发生一点失误的话，大数据集的分数就没了。现在相当于是增加了一次罚时。
2. 题目从3到变成了4道，时间不变，增加了一道送分题。

Rank 570. 因为大家都是100分，所以最后比拼的都是时间。因为比赛是12:00~15:00, 所以我中间花了半个小时去吃饭。另外每个题目都不是一遍做对，都通过`printf`进行调试，花了不少时间。最快的大佬们都是20min就做完了。

下个月约起来round B呀！4月19号早上7点。

[round A 题目地址](https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ffc7)

## Allocation

刚开始以为是一道简单的背包问题，后来发现是更简单的贪心问题。因为是要求购买房子数目的最大值，而不是价值的最大值，或者说 房子的价值都为1. 所以贪心即可。简而言之，送分的签到题。
把房子按照售价从小到大排序，先买便宜的房子。

时间复杂度: O(N log N),
空间复杂度: O(N).

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

vector<int> A(100005);

int main() {
    int T;
    cin >> T;

    for (int iCase = 1; iCase <= T; ++iCase) {
        int N, B;
        cin >> N >> B;
        for (int i = 0; i < N; ++i) {
            cin >> A[i];
        }
        sort(A.begin(), A.begin() + N);
        int ans = 0;
        int index = 0;
        while (index < N && B >= A[index]) {
            B -= A[index];
            ++ans;
            ++index;
        }
        cout << "Case #" << iCase << ": " << ans <<endl;
    }

    return 0;
}
```
因为贪心的时候忘记检查`index < n`了，导致一次WA罚时。

## Plates

动态规划。
状态转移方程：
第i个stack，取走j个盘子，得到的最大Beaty value和。
`dp[i][j] = max{dp[i-1][x] + top_sum[j - x] for x in [0, j]}`。

时间复杂度: O(N * P * P) 50 * 1500 * 1500,
空间复杂度: O(N * P) 50 * 1500 -> O(P) 1500.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

vector<int> dp(1505, 0);
vector<int> line(35);

int main() {
    int T;
    cin >> T;

    for (int iCase = 1; iCase <= T; ++iCase) {
        int N, K, P;
        cin >> N >> K >> P;
        fill(dp.begin(), dp.end(), 0);
        for (int i = 0; i < N; ++i) {
            for (int j = 0; j < K; ++j) {
                cin >> line[j];
                if (j > 0)
                    line[j] += line[j - 1];
            }
            for (int j = P; j > 0; --j) {
                int max_dp = dp[j];
                for (int x = j - 1; x >= 0 && j - x - 1 < K; --x) {
                    max_dp = max(max_dp, dp[x] + line[j - x - 1]);
                }
                dp[j] = max_dp;
                // cout << dp[j] << ", ";
            }
            // cout << endl;
        }
        cout << "Case #" << iCase << ": " << dp[P] <<endl;
    }

    return 0;
}
```

## Workout

对于`K == 1`的情况，可以直接采用贪心的策略，将最大的间隔等分。

对于`K > 1`的情况，可以采取将`最优化问题转成判定问题`的思路解决。
最优化问题为：求最小的difficulty。
判定问题为：`difficulty == x`可否实现, 时间复杂度为`O(N * K)`。
然后判定问题的解的分布为: `... F F F T T T ...`，我们要找到第一个`T`。
采用二分法，搜索区间为`[1, max(M_i) = 1^9]`, 时间复杂度为`O(log 1e9)`。
故，总的有：
时间复杂度: O(N * K * log 1e9),
空间复杂度: O(N).

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

vector<int> M(1e5 + 5);

int main() {
    int T;
    cin >> T;

    for (int iCase = 1; iCase <= T; ++iCase) {
        int N, K;
        cin >> N >> K;
        for (int i = 0; i < N; ++i) {
            cin >> M[i];
        }
        auto determine = [&](int x) -> bool {
            int used = 0;
            for (int i = 0; i < N - 1; ++i) {
                int difference = M[i + 1] - M[i];
                while (difference > x) {
                    ++used;
                    if (used > K)
                        return false;
                    difference -= x;
                }
            }
            return true;
        };
        int lo = 1, hi = 1e9;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            auto deter = determine(mid);
            // cout << mid << ": " << deter << endl;
            if (deter) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        cout << "Case #" << iCase << ": " << lo <<endl;
    }

    return 0;
}
```

## Bundling

Tire + DFS + Greedy的思路。

因为需要用到共同前缀，所以我们可以用Tire预处理字符串。
用DFS搜索Trie，尝试尽量深地凑成一个group，这样得到的score更大。

时间复杂度: O(characters.size()), 2 * 10 ^ 6.
空间复杂度: O(characters.size()).

```cpp
#include <algorithm>
#include <iostream>
#include <memory>
#include <vector>
#include <functional>
#include <cassert>

using namespace std;

struct Trie {
    int passby = 0;
    int destination = 0;
    array<shared_ptr<Trie>, 26> data;
};

void build_tire(shared_ptr<Trie> root, const string &s, int index) {
    ++root->passby;
    if (index == s.size()) {
        ++root->destination;
        return;
    }
    if (root->data[s[index] - 'A'] == nullptr) {
        root->data[s[index] - 'A'] = make_shared<Trie>();
    }
    build_tire(root->data[s[index] - 'A'], s, index + 1);
}

int main() {
    int T;
    cin >> T;

    for (int iCase = 1; iCase <= T; ++iCase) {
        int N, K;
        cin >> N >> K;
        auto root = make_shared<Trie>();
        for (int i = 0; i < N; ++i) {
            string s;
            cin >> s;
            build_tire(root, s, 0);
        }
        int ans = 0;
        // return left number
        function<int(shared_ptr<Trie>, int)> dfs = [&](shared_ptr<Trie> r,
                                                       int depth) -> int {
            if (r == nullptr)
                return 0;
            int now = r->destination;
            for (int i = 0; i < 26; ++i) {
                now += dfs(r->data[i], depth + 1);
                // cout <<  depth << ": " << char('A' + i) << ": " << now << endl;
            }
            ans += depth * (now / K);
            return now % K;
        };
        int r = dfs(root, 0);
        // cout << "r: " << r << endl;
        cout << "Case #" << iCase << ": " << ans << endl;
    }

    return 0;
}
```