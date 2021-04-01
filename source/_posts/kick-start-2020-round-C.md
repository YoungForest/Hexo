---
title: kick start 2020 round C
date: 2020-05-18 10:55:44
tags:
- Competitive Programming
categories:
- KickStart
---

| ID | score | rank | Bike Tour | Bus Routes | Robot Path Coding | Wandering Robot | Time |
|--|--|--|--|--|--|--|--|
| YoungForest | 74 | 524 | 5 + 7 | 10 + 13 | 11 + 16 | 14 + 0 | 1:35:18 |

上个月因为Round B结果还不错，收到了Google CN HR的Congraduation邮件。本月再接再厉，为了进入Google的梦想而努力。

## A. Countdown

One pass. 寻找countdown的模式。由于开始数字一定为K，所以countdown的过程中如果失败了的话，可以直接从失败的位置继续寻找。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    int T;
    cin >> T;

    for (int iCase = 1; iCase <= T; ++iCase) {
        int N, K;
        cin >> N >> K;
        vector<int> mountains(N);
        for (int i = 0; i < N; ++i) {
            cin >> mountains[i];
        }
        int ans = 0;
        for (int i = 0; i < N; ) {
            if (mountains[i] == K) {
                int need = K - 1;
                int j = 1;
                while (i + j < N && need >= 1 && mountains[i+j] == need) {
                    ++j;
                    --need;
                }
                if (need == 0) ++ans;
                i = i + j;
            } else {
                ++i;
            }
        }
        cout << "Case #" << iCase << ": " << ans << endl;
    }

    return 0;
}
```

## B. Stable Wall

题目本身比较难懂。但实质就是一个拓扑排序的问题，下面的必须先放。
这里需要注意一个corner case：只有一行的情况。
因为我第一版的代码，更新`seen`是在判断上下层关系时更新的。如果只有一行的话，就会忽略第一行的字母。
把`seen`单独拿出来更新就可以了。

时间复杂度: O(R * C * 26),
空间复杂度: O(R * C + 26).

```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    int T;
    cin >> T;

    for (int iCase = 1; iCase <= T; ++iCase) {
        int R, C;
        cin >> R >> C;
        vector<string> rows(R);
        for (int i = 0; i < R; ++i) {
            cin >> rows[i];
        }
        string ans;
        // 拓扑排序
        unordered_map<char, unordered_set<char>> out;
        unordered_map<char, unordered_set<char>> in;
        unordered_set<char> seen;
        queue<char> zeroIn;
        for (int i = 0; i < R; ++i) {
            for (int j = 0; j < C; ++j) {
                seen.insert(rows[i][j]);
            }
        }
        for (int i = 0; i + 1 < R; ++i) {
            for (int j = 0; j < C; ++j) {
                char down = rows[i + 1][j];
                char up = rows[i][j];
                if (down == up)
                    continue;
                out[down].insert(up);
                in[up].insert(down);
            }
        }
        for (char c : seen) {
            if (in[c].empty()) {
                zeroIn.push(c);
            }
        }
        while (!zeroIn.empty()) {
            char base = zeroIn.front();
            zeroIn.pop();
            ans.push_back(base);
            for (char up : out[base]) {
                in[up].erase(base);
                if (in[up].empty()) {
                    zeroIn.push(up);
                }
            }
        }
        cout << "Case #" << iCase << ": "
             << (ans.size() == seen.size() ? ans : "-1") << endl;
    }

    return 0;
}
```

## C. Perfect Subarray

使用前缀和来快速求子数组和。然后用hashmap存储之前的前缀和。对于当前的前缀和遍历所有的平方数，寻找之前的前缀和。由于该题目会卡常数，所以需要用到一些竞赛用的技巧。
如：

- unordered_map可以用reserve直接扩充为最大可能的大小；
- 用数组代替hashmap, 下标有负数时，整体偏移一个常数.

时间复杂度: O(N * sqrt(MAXSUM)) = O(N * 3000),
空间复杂度: O(N + MAXSUM).

```cpp
#include <bits/stdc++.h>

using namespace std;

using ll = long long;
const ll MAXSQRT = 3163;
const int mxN = 1e5 + 5;
int seen[2*110*mxN];

int main() {
    int T;
    cin >> T;
    const int mid = 105 * mxN + 2;
    for (int iCase = 1; iCase <= T; ++iCase) {
        int N;
        cin >> N;
        ll ans = 0;
        int presum = 0;
	    memset(seen, 0, sizeof seen);
        seen[presum + mid] = 1;
        for (int i = 0; i < N; ++i) {
            int A;
            cin >> A;
            presum += A;
            for (int squareI = 0; squareI <= MAXSQRT; ++squareI) {
                ans += seen[mid + presum - squareI*squareI];
            }
            ++seen[mid + presum];
        }
        cout << "Case #" << iCase << ": " << ans << endl;
    }

    return 0;
}
```

## D. Candies

题目operation有2种，分别为求区间和和更新某个值。十分适合用线段树解决。因为sweet score的定义不同于普通的求和，所以我们可以通过2个线段树的到sweet score. 分别维护 +1, -1, +1, ... 和 +1, -2, +3, ...。然后queryRange时，后者减去前者的某个倍数，再乘以+1/-1即可。

在此，感谢[花花的线段树模版](https://www.youtube.com/watch?v=rYBtViWXYeI)，让我可以快速A掉此题。

时间复杂度: O(N log N),
空间复杂度: O(N).

```cpp
#include <bits/stdc++.h>

using namespace std;

using ll = long long;

class SegmentTreeNode {
private:
    unique_ptr<SegmentTreeNode> left = nullptr, right = nullptr;
    ll start = 0, end = 0;
    ll val = 0;
public:
    SegmentTreeNode(ll value, ll start_, ll end_): val(value), start(start_), end(end_) {}
    SegmentTreeNode(ll start_, ll end_): start(start_), end(end_) {}
    static unique_ptr<SegmentTreeNode> buildTree(const vector<ll>& nums, ll i, ll j) {
        if (i == j) {
            return make_unique<SegmentTreeNode>(nums[i], i, j);
        } else {
            ll mid = i + (j - i) / 2;
            auto ret = make_unique<SegmentTreeNode>(i, j);
            ret->left = buildTree(nums, i, mid);
            ret->right = buildTree(nums, mid + 1, j);
            ret->val = ret->left->val + ret->right->val;
            return ret;
        }
    }
    ll queryRange(ll i, ll j) const {
        if (i == start && j == end) {
            return val;
        } else {
            ll mid = start + (end - start) / 2;
            if (j <= mid) {
                return left->queryRange(i, j);
            } else if (i > mid) {
                return right->queryRange(i, j);
            } else {
                return left->queryRange(i, mid) + right->queryRange(mid + 1, j);
            }
        }
    }
    void update(ll index, ll value) {
        if (start == index && index == end) {
            val = value;
        } else {
            ll mid = start + (end - start) / 2;
            if (mid >= index) {
                left->update(index, value);
            } else {
                right->update(index, value);
            }
            val = left->val + right->val;
        }
    }
};

int main() {
    ll T;
    cin >> T;

    for (ll iCase = 1; iCase <= T; ++iCase) {
        ll N, Q;
        cin >> N >> Q;
        vector<ll> nums(N);
        for (ll i = 0; i < N; ++i) {
            cin >> nums[i];
        }
        for (ll i = 0; i < N; ++i) {
            if (i % 2 == 1)
                nums[i] *= -1;
        }
        auto positiveNegtive = SegmentTreeNode::buildTree(nums, 0, nums.size() - 1);
        for (ll i = 0; i < N; ++i) {
            nums[i] *= (i+1);
        }
        auto multiTree = SegmentTreeNode::buildTree(nums, 0, nums.size() - 1);
        ll ans = 0;
        for (ll q = 0; q < Q; ++q) {
            string op;
            cin >> op;
            ll start, end;
            cin >> start >> end;
            if (op == "Q") {
                ans += ((start % 2 == 0) ? -1 : 1 ) * (multiTree->queryRange(start-1,end -1) - (start - 1) * positiveNegtive->queryRange(start-1, end-1));
            } else {
                ans += 0;
                positiveNegtive->update(start-1, ((start % 2 == 0) ? -1 : 1) * end);
                multiTree->update(start-1, ((start % 2 == 0) ? -1 : 1) * start * end);
            }
        }

        cout << "Case #" << iCase << ": " << ans << endl;
    }

    return 0;
}
```