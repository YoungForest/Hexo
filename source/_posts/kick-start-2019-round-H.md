---
title: kick start 2019 round H
date: 2019-11-25 22:11:22
tags:
- kick start
categories:
- Algorithm
---

由于欧洲这边夏令时的原因，处于UTC +1.00，所以本次比赛我是特意早上6点起来打的。打完后休息了一个小时，又和小伙伴去根特玩了一天。晚上回来的时候，才想起来Machine Learning的assignment 2当天截止，又疯狂地赶起了Deadline。事实证明，没有认真学习还是搞不定作业的。马马虎虎交上去了，总比不交好些。空白的题目，大方地告诉助教我就是不会。

本次比赛是Kick start 2019的最后一个轮次，我还是很想参加的。今年我共参加了6轮kick start。虽然A轮就拿到了面试的邀请，但仍然不可马虎。各次的排名如下所示:

| 轮次 | A | D | E | F | G | H |
|-----|---|---|---|---|---|---|
|Rank |600| 765 | 1566 | 1341 | 462 | 330 |
| Score|35| 27 | 22 | 11 | 42 | 41 |

除了F轮，我当时在巴黎玩，趁晚上在青旅的功夫瞎做的外。其他轮次还是可以说是全力以赴的。
总的名次是先下降后上升，并不能体现实力的变化，更多的是心态的改变。因为D轮次比较重要，当时也有同学一起竞争，不忍心与他比赛时交流。E轮次时，当时是在字节跳动的夏令营，和一个妹子一起做的。本身还是很想打好的，但由于并查集没有实现find的折叠，导致 超时。这也是之前没有注意到的盲点。其他3次结果相对好的轮次反而是没有包袱，更放松的时候。

最近还意外地收获了Google北京 A day with Google的邀请。无奈我不再北京，只能拒绝了。另外，我还通过邮件向Google反映了Google所有招聘相关的Form中My University中都没有 Beihang University的选项（我猜测这可能是因为北航在美国商务部的黑名单上的原因）。Google很快解决了，我航以后再也不是野鸡大学了。

本次做出签到题和第3题的小测试集1，算是正常发挥吧。

## A. H-index

第一次做误解了题意，以为是求最后的H-index就可以了。简单地写了个二分查找用判定问题求最大值的解法。
后来才发现是需要求每次论文的结果，之后又因编写了几个bug的问题影响了耗时。

Intuition：
随着论文的发表，H-index是单调递增的。利用这一特性，每次发表论文后，尝试去增加H-index.
这里我利用里C++ STL set中有序的特点和基于节点的container再插入新节点后iterator的不变性，高效地实现了尝试增加H-index的操作。

时间复杂度: O(N log N),
空间复杂度: O(N).

```cpp
#include <algorithm>
#include <iostream>
#include <set>
#include <vector>

using namespace std;

int MAX_N = 1e5 + 5;

void solve(const vector<int> &A, int N) {
    multiset<int, std::greater<int>> s;
    int ans = 0;
    auto it = s.begin();
    for (int i = 0; i < N; ++i) {
        int come = A[i];
        if (come > 0) {
            s.insert(come);
            if (s.size() == 1) {
                it = s.begin();
                if (come >= 1) {
                    ans = 1;
                }
            }
            else if (come > *it) {
                --it;
                // cout << " --it " << *it << " ";
                // if (next(it) != s.end()) {
                //     cout << " next(it): " << *(next(it)) << " ";
                // }
            }
            if (it != s.end() && next(it) != s.end() && *next(it) >= ans + 1) {
                ++ans;
                ++it;
            }
        }
        cout << ans << " ";
    }
}

int main() {
    int T;
    cin >> T;
    vector<int> A(MAX_N);
    for (int iCase = 0; iCase < T; ++iCase) {
        int N;
        cin >> N;
        for (int i = 0; i < N; ++i) {
            cin >> A[i];
        }
        cout << "Case #" << iCase + 1 << ": ";
        solve(A, N);
        cout << endl;
    }
}
```

## B. Diagonal Puzzle

比赛时试图通过回溯枚举所有的翻转找到最小解，时间复杂度O(2 ^ (4 * N))。没想到连最小的数据集都超时了。所以，题解都是通过赛后从官方的Analysis中看来得。

### 小测试集

没必要枚举所有的翻转。我们可以只枚举同一个方向的翻转，然后检查是否另一个方向每条线上都同色。
与主对角线平行的翻转有`2 * N - 1`个，与主对角线垂直的也有`2 * N - 1`个。
检查同色的复杂度为`O(N ^ 2)`.
所以总的时间复杂度为`O(2 ^ (2 * N - 1) * N ^ 2)`.

### 大测试集

本解法基于一个有趣的观察，如果我们确定主对角线和反主对角线的翻转，为了确定最后全为白色，其余翻转可以因此确定。当N为奇数时，是主对角线和次反主对角线。`N == 6， 7`时的情况如下所示。

```
\..../ \......
.\../. .\..../
..\/.. ..\../.
../\.. ...\/..
./..\. .../\..
/....\ ../..\.
       ./....\
```

所以，我们可以枚举主对角线的翻转 情况 ，共4种，然后根据对角线上 的 其他元素的颜色，确定其他翻转 。最后检查是否符合全是白的要求。
时间复杂度: `O(4 * N ^ 2)`.

此解法其实和我之前经常做的翻灯的题目很像，翻转一个灯，同时会翻转其周围的4个灯。最后求全部灭掉灯的步数。
只需要枚举第一行的翻转，为了改变当前行的灯的状态，我们只能翻转下一行的灯，其余行会因此确定。
题目在LeetCode上可以找到：[LeetCode 1284. Minimum Number of Flips to Convert Binary Matrix to Zero Matrix](https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix/description/).
我的解法是从[acwing](https://www.acwing.com/problem/content/97/)获得的，还可以 看大雪菜的视频学习。

#### 另一种解法

将此问题转换成[2-coloring](https://en.wikipedia.org/wiki/Graph_coloring#Vertex_coloring)的一种变形。每个格子都由2条线共享。如果格子是白的，2条线之一需要被翻转。如果格子是黑的，不需要翻转，或 都翻转。
我们考虑每条对角线是图中的节点，格子是边。
如果格子是黑的，对应的边连接的2个节点必须是相同颜色的。反之，必须是不同颜色的。
可以通过DFS解决2-coloring的图问题。
枚举root的颜色，DFS确定邻居的颜色，如果邻居的颜色已确定，则检查即可。更少的颜色就代表着翻的个数。

边数 为 `O(N^2)`, DFS的解法复杂度为`O(|Edges|)`。
总的时间复杂度为`O(N ^ 2)`.

```cpp
#include <iostream>
#include <memory>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <vector>

using namespace std;
using ll = long long;

struct Line {
    ll difference;
    bool positive;
    vector<weak_ptr<Line>> same_color_neighbors, different_color_neighbors;
    Line(ll d, bool p) : difference(d), positive(p) {}
};

bool dfs(shared_ptr<Line> root, set<shared_ptr<Line>> &white,
         set<shared_ptr<Line>> &black) {
    if (root == nullptr)
        return false;
    ;
    bool w = white.find(root) != white.end();
    for (auto node : root->different_color_neighbors) {
        if (auto node_shared_ptr = node.lock()) {
            if (white.find(node_shared_ptr) == white.end() &&
                black.find(node_shared_ptr) == black.end()) {
                auto &color = w ? black : white;
                color.insert(node_shared_ptr);
                if (!dfs(node_shared_ptr, white, black))
                    return false;
            } else if (white.find(node_shared_ptr) != white.end()) {
                if (w) {
                    return false;
                }
            } else {
                if (!w) {
                    return false;
                }
            }
        }
    }
    for (auto node : root->same_color_neighbors) {
        if (auto node_shared_ptr = node.lock()) {
            if (white.find(node_shared_ptr) == white.end() &&
                black.find(node_shared_ptr) == black.end()) {
                auto &color = w ? white : black;
                color.insert(node_shared_ptr);
                if (!dfs(node_shared_ptr, white, black))
                    return false;
            } else if (white.find(node_shared_ptr) != white.end()) {
                if (!w)
                    return false;
            } else {
                if (w)
                    return false;
            }
        }
    }

    return true;
}

ll solve(vector<vector<bool>> &puzzle) {
    unordered_map<int, shared_ptr<Line>> positive, negative;
    const int n = puzzle.size();
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            int j_sub_i = j - i;
            int j_add_i = j + i;
            if (positive[j_sub_i] == nullptr) {
                positive[j_sub_i] = make_shared<Line>(j_sub_i, true);
            }
            if (negative[j_add_i] == nullptr) {
                negative[j_add_i] = make_shared<Line>(j_add_i, false);
            }
            if (puzzle[i][j]) { // black
                positive[j_sub_i]->same_color_neighbors.push_back(
                    negative[j_add_i]);
                negative[j_add_i]->same_color_neighbors.push_back(
                    positive[j_sub_i]);
            } else {
                positive[j_sub_i]->different_color_neighbors.push_back(
                    negative[j_add_i]);
                negative[j_add_i]->different_color_neighbors.push_back(
                    positive[j_sub_i]);
            }
        }
    }
    set<shared_ptr<Line>> seen;
    ll ans = 0;
    for (auto &direction : {positive, negative}) {
        for (auto p : direction) {
            auto node = p.second;
            if (seen.find(node) == seen.end()) {
                set<shared_ptr<Line>> white, black;
                white.insert(node);
                if (!dfs(node, white, black)) {
                    return -1;
                }
                ans += min(white.size(), black.size());
                seen.insert(white.begin(), white.end());
                seen.insert(black.begin(), black.end());
            }
        }
    }
    return ans;
}

int main(int argc, char const *argv[]) {
    ll T;
    cin >> T;
    for (int iCase = 1; iCase <= T; ++iCase) {
        ll n;
        cin >> n;
        vector<vector<bool>> pullze(n, vector<bool>(n));
        for (int i = 0; i < n; ++i) {
            string row;
            cin >> row;
            for (int j = 0; j < n; ++j) {
                if (row[j] == '#')
                    pullze[i][j] = true;
                else
                    pullze[i][j] = false;
            }
        }
        ll ans = solve(pullze);
        cout << "Case #" << iCase << ": " << ans << endl;
    }
    return 0;
}
```
实现过程中，需要注意的点有：
- 如何存储和构造Graph。
- DFS解法时，需要遍历所有的节点。因为整个图是可以分为多个联通子图的。只从一个root开始dfs得到的染色不完整。


## C. Elevanagram

小测试集时，`0 <= A_i <= 20`，可以使用回溯法，尝试所有的正负号分配方式。

时间复杂度：O(A_i ^ 9), 算上剪枝，复杂度会更低些。
空间复杂度：O(9).

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <set>
#include <vector>

using namespace std;
using ll = long long;
ll plus_max;
ll s;

bool backtracking(const vector<ll> &A, ll index, ll plus, ll accu) {
    if (plus > plus_max) {
        return false;
    } else if (plus == plus_max) {
        return ((accu - (s - accu)) % 11) == 0;
    } else if (index == 0) {
        ll need_plus = plus_max - plus;
        if (need_plus > A[0]) {
            return false;
        } else {
            accu += need_plus;
            return ((accu - (s - accu)) % 11) == 0;
        }
    } else {
        ll num = index + 1;
        for (ll i = min(A[index], plus_max - plus); i >= 0; --i) {
            if (backtracking(A, index - 1, plus + i, accu + num * i)) {
                return true;
            }
        }
        return false;
    }
}

void solve(const vector<ll> &A) {
    s = std::accumulate(A.begin(), A.end(), 0);
    plus_max = s / 2 + s % 2;
    s = 0;
    for (int i = 0; i < 9; ++i) {
        s += A[i] * (i + 1);
    }

    if (backtracking(A, 8, 0, 0)) {
        cout << "YES";
    } else {
        cout << "NO";
    }
}

int main() {
    int T;
    cin >> T;
    vector<ll> A(9);
    for (int iCase = 0; iCase < T; ++iCase) {
        for (int i = 0; i < 9; ++i) {
            cin >> A[i];
        }
        cout << "Case #" << iCase + 1 << ": ";
        solve(A);
        cout << endl;
    }
}
```

