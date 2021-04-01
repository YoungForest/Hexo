---
title: kick start 2019 round B
date: 2019-07-24 11:04:30
tags:
- Competitive Programming
categories:
- KickStart
---

赛后补的题解。
[题目链接](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000050eda)

## Building Palindromes

给定长度为N的一个字符串，和Q个Query。每个query是一个range，可以得到字串。判断子串重新排列后是否回文。因为可以任意重排，所以子串中字符的顺序不重要，重要的是每个字符出现的频数。频数为奇数的字符数目为0或1，即可重排为回文串。
因为N和Q的规模较大，`10^5`。平方算法会超时。这里借用前缀和的思路，快速计算子串字符频数。
时间复杂度为线性。

```cpp
#include <vector>
#include <iostream>
#include <unordered_map>
#include <algorithm>

using namespace std;

int main(int argc, char const *argv[])
{
    int T;
    cin >> T;
    for (int i = 1; i <= T; ++i) {
        int N, Q;
        cin >> N >> Q;
        string s;
        cin >> s;
        vector<vector<int>> prefix(N+1);
        prefix[0] = vector<int>(26, 0);
        for (int j = 1; j <= N; ++j) {
            prefix[j] = prefix[j-1];
            ++prefix[j][s[j-1] - 'A'];
        }
        int ans = 0;
        for (int j = 0; j < Q; ++j) {
            int L, R;
            cin >> L >> R;
            const auto& l = prefix[L-1], r = prefix[R];
            int odd = 0;
            for (int k = 0; k < 26; ++k) {
                if ((r[k] - l[k]) % 2 == 1)
                    ++odd;
            }
            if (odd <= 1)
                ++ans;
        }
        cout << "Case #" << i << ": " << ans << endl;
    }
    return 0;
}
```

## Energy Stones

本题的思想是 贪心 + 动态规划 (一种[0-1背包](https://en.wikipedia.org/wiki/Knapsack_problem))。更多背包问题，可以参考[背包九讲](https://comzyh.com/upload/PDF/Pack-PDF-Comzyh.pdf)。
难点在于，背包遍历的顺序需要用贪心的思路去排序的。

对于S相同的小的测试集而言，L大的先去遍历。可以是的损失的能量最少。
对于S不同的大的测试集而言，2个石头`i`, `j`的顺序由`S_i * L_j`决定，如果`S_i * L_j < S_j * L_i`，则先去`i`损失的能量更少。

贪心的正确性也很容易去证明。如果我们有一个吃石头的序列，则 必然是按照能量损失较小的顺序去吃的。否则交换一下顺序，可以获得更大的能量。

时间复杂度: O(N * N * S_i).
空间复杂度: O(N * N * S_i), 可以进一步优化到O(N * S_i)

```cpp
#include <algorithm>
#include <iostream>
#include <tuple>
#include <vector>

using namespace std;

struct Stone {
  int s, e, l;
  bool operator<(const Stone &p) const { return s * p.l < l * p.s; }
};

int main(int argc, char const *argv[]) {
  int T;
  cin >> T;
  for (int iCase = 1; iCase <= T; ++iCase) {
    int N;
    cin >> N;
    vector<Stone> data(N + 1);
    int S_sum = 0;
    for (int i = 1; i <= N; ++i) {
      cin >> data[i].s >> data[i].e >> data[i].l;
      S_sum += data[i].s;
    }
    sort(data.begin() + 1, data.end());
    vector<vector<int>> dp(N + 1, vector<int>(S_sum + 1));
    for (int i = 1; i <= N; ++i) {
      for (int time = 0; time <= S_sum; ++time) {
        if (time < data[i].s) {
          dp[i][time] = dp[i - 1][time];
        } else {
          dp[i][time] =
              max(dp[i - 1][time],
                  dp[i - 1][time - data[i].s] +
                      max(0, data[i].e - data[i].l * (time - data[i].s)));
        }
      }
    }
    int ans = 0;
    for (int time = 0; time <= S_sum; ++time) {
      ans = max(ans, dp[N][time]);
    }
    cout << "Case #" << iCase << ": " << ans << endl;
  }
  return 0;
}
```

## Diverse Subarray

本题和第一题一样，都需要用到前缀和，但这一转换其实并不是很明显。
需要先把 types序列 转换成 增减事件序列，此时可以看出，增减事件的前缀和即是最后的我们需要优化的礼物数。
然后，为了快速获取最大前缀和，可以使用 [线段树](// https://www.geeksforgeeks.org/maximum-prefix-sum-given-range/) 这一工具。实现`O(log N)`效率的查询一个Range中最大的前缀和，和`O(log N)`更新线段树。

总的时间复杂度: O(N log N)
- 初始化线段树 O(N log N)
- 对于N个起点，更新、查询 线段树 O(log N)

```cpp
#include <algorithm>
#include <iostream>
#include <limits>
#include <unordered_map>
#include <vector>

using namespace std;

struct SegmentTree {
  struct Node {
    int sum = numeric_limits<int>::min();
    int prefix = numeric_limits<int>::min();
    bool isValid() const {
      return sum != numeric_limits<int>::min() &&
             prefix != numeric_limits<int>::min();
    }
    Node &operator=(const Node &rhs) {
      this->sum = rhs.sum;
      this->prefix = rhs.prefix;
      return *this;
    }
  };
  const int MAX_N = 1 << 17;

  // 存储线段树的全局数组
  vector<Node> dat;
  int n;
  // 初始化
  SegmentTree(int n_, int a[]) {
    // 为简单起见，把元素个数扩大到2的幂
    n = 1;
    while (n < n_)
      n *= 2;

    // 把所有的值都设为INT_MAX
    dat.resize(2 * n);
    for (int i = 0; i < n_; ++i) {
      update(i, a[i]);
    }
  }

  void print() const {
    for (const auto &d : dat) {
      cout << "{" << d.sum << ", " << d.prefix << "}, ";
    }
    cout << endl;
  }

  // 把第k个值(0-indexed)更新为a
  void update(int k, int a) {
    // 叶子节点
    k += n - 1;
    dat[k].sum = a;
    dat[k].prefix = a;
    // 向上更新
    while (k > 0) {
      k = (k - 1) / 2;
      if (!dat[2 * k + 2].isValid())
        dat[k] = dat[2 * k + 1];
      else {
        dat[k].sum = dat[2 * k + 1].sum + dat[2 * k + 2].sum;
        dat[k].prefix = max(dat[2 * k + 1].prefix,
                            dat[2 * k + 1].sum + dat[2 * k + 2].prefix);
      }
    }
  }

  // 求[beg, end)的最小值
  // 后面的参数是为了计算起来方便而转入的。
  // k 是节点的编号, l, r表示这个节点对应的是[l, r)区间。
  // 在外部调用时，用query(index, beg, end, 0, n)
  Node query(int index, const int beg, const int end, int l, int r) const {
    // cout << "(" << index << ", " << l << ", " << r << ");" << endl;
    Node ret;
    // 如果[beg, end) 和 [l, r)不相交，则返回INT_MAX
    if (r <= beg || end <= l)
      return ret;
    // 如果[beg, end)完全包含[l, r), 则返回当前节点的值
    if (beg <= l && r <= end)
      return dat[index];
    int mid = l + (r - l) / 2;
    auto vl = query(index * 2 + 1, beg, end, l, mid);
    auto vr = query(index * 2 + 2, beg, end, mid, r);
    if (!vr.isValid()) {
      ret = vl;
    } else if (!vl.isValid()) {
      ret = vr;
    } else {
      ret.sum = vl.sum + vr.sum;
      ret.prefix = max(vl.prefix, vl.sum + vr.prefix);
    }
    return ret;
  }

  Node queryMin(const int a, const int b) const { return query(0, a, b, 0, n); }
};

// https://www.geeksforgeeks.org/maximum-prefix-sum-given-range/
int main(int argc, char const *argv[]) {
  int T;
  cin >> T;
  for (int iCase = 1; iCase <= T; ++iCase) {
    int N, S;
    cin >> N >> S;
    vector<int> A(N), events(N);
    unordered_map<int, vector<int>> types; // type, <index>
    for (int i = 0; i < N; ++i) {
      cin >> A[i];
      types[A[i]].push_back(i);
      if (types[A[i]].size() <= S) {
        events[i] = 1;
      } else if (types[A[i]].size() == S + 1) {
        events[i] = -S;
      } else {
        events[i] = 0;
      }
    }
    SegmentTree st(N, events.data());
    int ans = numeric_limits<int>::min();
    for (int i = 0; i < N; ++i) {
      auto r = st.queryMin(i, N);
      ans = max(ans, r.prefix);
      auto &v = types[A[i]];
      auto it = lower_bound(v.begin(), v.end(), i);
      if (it + S < v.end()) {
        st.update(*(it + S), 1);
        if (it + S + 1 < v.end())
          st.update(*(it + S + 1), -S);
      }
    }
    cout << "Case #" << iCase << ": " << ans << endl;
  }
  return 0;
}
```

## 后记

练习了2场Kick Start，并实际参与1场。我发现自己的水平里Google的要求还差的远呢。Google的对算法的要求直逼ACM，竞赛选手会有很大优势的。我虽然水平有限，但还有时间可以进步。
过去有6年的比赛题，每年8轮。足够练习2个月时间了。

周末一场2019 Round D，我会参加练手。争取拿到第1题的全部分数 和 后2题的小 case的分数。
加油，Forest！