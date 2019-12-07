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

