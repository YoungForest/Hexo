---
title: kick start 2021 round A
date: 2021-03-22 19:19:06
tags:
- Competitive Programming
categories:
- KickStart
---

| ID | score | rank | K-Goodness String | L Shaped Plots | Rabbit House | Checksum | Penalty Time |
|--|--|--|--|--|--|--|--|
| YoungForest | 56 | 1295 | 5 + 7 | 8 + 12 | 9 + 15 | 0 | 1:40:55 |


久违的参加了KickStart比赛。之前2年还因为想去Google的原因一直坚持打，不过人算不如天算，因为疫情原因实习和秋招都直接凉了。2年多参加了10+场比赛也“白”打了。
今年参加真的是全凭兴趣。结果排名果然1000+。之前基本都是几百。
不得说，从去年开始，KickStart简单也友好了很多。之前经常只能做出来1道半题。后来为了增加参赛范围，3题变四题，整体难度也降下来了。

<!-- more -->

## K-Goodness String

签到题。统计字符串的goodness score，可知无论是增一还是减一的最小操作都是1.

```cpp
#include <bits/stdc++.h>

using namespace std;

int solve() {
    int N, K;
    cin >> N >> K;
    string s;
    cin >> s;
    int k = 0;
    for (int i = 1; i <= N / 2; ++i) {
        if (s[i - 1] != s[N - i + 1 - 1]) {
            ++k;
        }
    }
    return abs(K - k);
}

int main() {
    int T;
    cin >> T;
    for (int i = 0; i < T; ++i) {
        auto ans = solve();
        cout << "Case #" << i + 1 << ": " << ans << endl;
    }
    return 0;
}
```

时间复杂度: O(N),
空间复杂度: O(N).

## L Shaped Plots

统计一个方向的L，其他方向的L可以通过 上下/左右翻转 和 旋转 共8种情况得到。
用动态规划的思想更新当前位置左边的长度和上边的长度，求的以当前位置为拐点的L的数目。

```cpp
#include <bits/stdc++.h>

using namespace std;

int solve() {
    int R, C;
    cin >> R >> C;
    vector<vector<bool>> matrix(R, vector<bool> (C));
    int x;
    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) {
            cin >> x;
            matrix[i][j] = (x == 1);
        }
    }
    
    auto reverseLeftRight = [&]() -> void {
        for (auto& m : matrix) {
            reverse(m.begin(), m.end());
        }
    };
    auto reverseUpDown = [&]() -> void {
        for (int j = 0; j < C; ++j) {
            for (int i = 0; i < R - 1 - i; ++i) {
                swap(matrix[i][j], matrix[R - 1 - i][j]);
            }
        }
    };
    auto flip = [&]() -> void {
        vector<vector<bool>> newMatrix(C, vector<bool>(R));
        for (int i = 0; i < R; ++i) {
            for (int j = 0; j < C; ++j) {
                newMatrix[j][i] = matrix[i][j];
            }
        }
        matrix = move(newMatrix);
        swap(R, C);
    };
    auto one = [&]() -> int {
        vector<vector<int>> dp(R, vector<int> (C));
        int ans = 0;
        for (int j = 0; j < C; ++j) {
            dp[0][j] = matrix[0][j] ? 1 : 0;
        }
        for (int i = 1; i < R; ++i) {
            int left = 0;
            for (int j = 0; j < C; ++j) {
                if (matrix[i][j]) {
                    ++left;
                    dp[i][j] = dp[i-1][j] + 1;
                    const int up = dp[i][j] / 2;
                    const int could = min(up, left);
                    if (could > 1) ans += could - 1;
                } else {
                    left = 0;
                    dp[i][j] = 0;
                }
            }
        }
        return ans;
    };
    auto two = [&]() -> int {
        int ans = 0;
        ans += one();
        reverseLeftRight();
        ans += one();
        return ans;
    };
    auto four = [&]() -> int {
        int ans = 0;
        ans += two();
        reverseUpDown();
        ans += two();
        return ans;
    };
    int ans = 0;
    ans += four();
    flip();
    ans += four();
    return ans;
}

int main() {
    int T;
    cin >> T;
    for (int i = 0; i < T; ++i) {
        auto ans = solve();
        cout << "Case #" << i + 1 << ": " << ans << endl;
    }
    return 0;
}
```

时间复杂度: O(8 * R * C)
空间复杂度: O(R*C).


## Rabbit House

BFS. 相邻位置差最多为1，从最高的cells开始搜索。

```cpp
#include <bits/stdc++.h>

using namespace std;
using ll = long long;
using pii = pair<int, int>;

const vector<pii> directions = {
    {1, 0}, {0, 1}, {-1, 0}, {0, -1}
};

ll solve() {
    int R, C;
    cin >> R >> C;
    vector<vector<ll>> matrix(R, vector<ll> (C));
    unordered_map<int, vector<pii>> cells;
    ll x;
    ll maxHeight = 0;
    for (int i = 0; i < R; ++i) {
        for (int j = 0; j < C; ++j) {
            cin >> matrix[i][j];
            cells[matrix[i][j]].emplace_back(i, j);
            maxHeight = max(maxHeight, matrix[i][j]);
        }
    }

    queue<pii> q;
    for (const auto& p : cells[maxHeight]) {
        q.push(p);
    }

    ll ans = 0;
    ll height = maxHeight;
    while (!q.empty() && height > 0) {
        const int s = q.size();
        for (int x = 0; x < s; ++x) {
            auto [i, j] = q.front();
            q.pop();
            for (pii d : directions) {
                const int ni = i + d.first;
                const int nj = j + d.second;
                if (ni >= 0 && ni < R && nj >= 0 && nj < C) {
                    if (matrix[ni][nj] >= height) continue;
                    q.emplace(ni, nj);
                    ans += height - 1 - matrix[ni][nj];
                    matrix[ni][nj] = height;
                }
            }
        }
        for (const auto& p : cells[height-1]) {
            q.push(p);
        }
        --height;
    }
    
    return ans;
}

int main() {
    int T;
    cin >> T;
    for (int i = 0; i < T; ++i) {
        auto ans = solve();
        cout << "Case #" << i + 1 << ": " << ans << endl;
    }
    return 0;
}
```

时间复杂度: O(R * C),
空间复杂度: O(R * C).

需要注意的2点是：
- BFS时，需要每次把高度相同的cells也加入队中。这些也是下次遍历的起点之一。
- 另外最后的结果大于32位数，需要`long long`避免overflow的WA。
我也因此多了3次WA罚时。

## Checksum

比赛到最后一题已经非常累了。LeetCode周赛1小时+KickStart3小时，如此高强度的脑力活动，对人的精力已经是十分大的消耗了。因此，最后一题时我脑子已经不如一开始的清醒了。思考了一段时间后就放弃了。事实上，暴力法拿个小数据的分数对我平时的水平来说还是做的到的。

赛后补题, 解法参考官方的Analysis。

### 暴力法 Test Set 1

枚举所有的花费集合，判断是否可以推断出全部的棋盘。
判断是否可以推断出全部元素可以使用BFS来进行，从行列唯一元素开始遍历，依次增加元素。其实DFS也行。

时间复杂度: O(2^(N^2) * N ^ 2).

### 破环法 Test Set 2

以行列号为节点，空缺元素为边，可以将原矩阵转换成一个二分图。行在一边，列在一边。
单独的节点表示 该行/列的所有元素已知，可以直接忽略。
节点度为1表示 该行/列只有一个未知元素，可以通过checksum推断，因此可以直接删掉。
剩下的图组成一个无向有环权重图。

原问题转换成 以最小代价删去一定的边，使得原图无环。
可以采用贪心算法。从小到大遍历边，如果在环内，就删掉。判断是否在环内可以用暴力DFS解决。不通过这个边，看是否有另外一条路径从该边的一个节点到另一个节点。

时间复杂度: 遍历所有剩下的边 * 判断环 = O(N ^ 2 * N ^ 2) = O(N^4).

贪心算法的正确性证明参考 [最小生成树 Kruskal 算法](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm).

### 最大生成树 Test Set 3

在解法2的基础上，事实上，我们可以通过最大生成树算法快速得到最后的状态。

时间复杂度: Prim O(N^2), Kruskal O(N^2 * log N).

```cpp
#include <bits/stdc++.h>

using namespace std;
using ll = int;
using pii = pair<int, int>;
using tii = tuple<int, int, int>;

class UF {
public:
    vector<int> fa;
    vector<int> sz;
    int n;
    int comp_cnt;
    
public:
    UF(int _n): n(_n), comp_cnt(_n), fa(_n), sz(_n, 1) {
        iota(fa.begin(), fa.end(), 0);
    }
    
    int findset(int x) {
        return fa[x] == x ? x : fa[x] = findset(fa[x]);
    }
    
    void unite(int x, int y) {
        x = findset(x);
        y = findset(y);
        if (x != y) {
            if (sz[x] < sz[y]) {
                swap(x, y);
            }
            fa[y] = x;
            sz[x] += sz[y];
            --comp_cnt;
        }
    }
    
    bool connected(int x, int y) {
        x = findset(x);
        y = findset(y);
        return x == y;
    }
};

ll solve()
{
    int N;
    cin >> N;
    // construct the 2-partical graph
    vector<vector<pii>> graph(2 * N);
    vector<tii> edges;
    ll x;
    for (int i = 0; i < N; ++i)
    {
        for (int j = 0; j < N; ++j)
        {
            cin >> x;
        }
    }
    for (int i = 0; i < N; ++i)
    {
        for (int j = 0; j < N; ++j)
        {
            cin >> x;
            if (x > 0)
            {
                graph[i].push_back({j + N, x});
                graph[j + N].push_back({i, x});
                edges.emplace_back(x, i, j + N);
            }
        }
    }
    for (int i = 0; i < N; ++i)
    {
        cin >> x;
    }
    for (int i = 0; i < N; ++i)
    {
        cin >> x;
    }

    sort(edges.begin(), edges.end(), greater<>());
    UF uf(2*N);
    ll cost = 0;
    for (const auto& e : edges) {
        if (uf.connected(get<1>(e), get<2>(e))) {
            cost += get<0>(e);
        } else {
            uf.unite(get<1>(e), get<2>(e));
        }
    }

    return cost;
}

int main()
{
    int T;
    cin >> T;
    for (int i = 0; i < T; ++i)
    {
        auto ans = solve();
        cout << "Case #" << i + 1 << ": " << ans << endl;
    }
    return 0;
}
```

我采用了Krusal, 因为写起来更好实现些。

时间复杂度: O(N^2 * log N^2),
空间复杂度: O(N^2).