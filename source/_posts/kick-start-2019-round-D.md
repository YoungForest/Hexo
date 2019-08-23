---
title: kick start 2019 round D
date: 2019-07-28 16:19:32
tags:
- kick start
categories:
- Algorithm
---


排名: 765 / 1866.

## X or What

本题是找规律的题目，考察最xor的熟悉程度。事实上，我曾经很接近于正确解法了。但一头心思钻到 interval 题目用线段树求解的经验上，试图寻找节点记录什么信息。结果越走越偏。

总结起来规律是这样的:
题目中给了xor-even的定义。
我们根据xor的性质有：
- odd xor odd -> even
- odd xor even -> odd
- even xor even -> even

想要最后xor-even，interval中的odd必须是偶数个。一个非常直接的思路就出来了。统计odd的数量，如果是偶数，那么最长的interval就是整个数组的长度。如果是奇数，则去掉头或尾，找最长的。

```cpp
#include <set>
#include <cstdio>

using namespace std;

const int N = 1e5 + 5;
int n, q;
int a[N], v[N];
int p[N];

int even(int i) {
  int count = 0;
  while (i > 0) {
    count += i % 2;
    i /= 2;
  }
  return count;
}

void read_input() {
  scanf("%d %d", &n, &q);
  for (int i = 0; i < n; ++i) {
    int x;
    scanf("%d", &x);
    a[i] = even(x) & 1;
  }
  for (int i = 0; i < q; ++i) {
      int x;
    scanf("%d %d", p+i, &x);
    v[i] = even(x) & 1;
  }
}

void solve() {
  set<int> idx[2];
  for (int i = 0; i < n; ++i) {
    idx[a[i]].insert(i);
  }
  for (int i = 0; i < q; ++i) {
    if (a[p[i]] != v[i]) {
      idx[a[p[i]]].erase(p[i]);
      a[p[i]] = v[i];
      idx[a[p[i]]].insert(p[i]);
    }
    if (i)
      printf(" ");
    if (idx[1].size() % 2 == 0) {
      printf("%d", n);
    }
    else {
      int ans = max(*idx[1].rbegin(), n-*idx[1].begin()-1);
      printf("%d", ans);
    }
  }
  printf("\n");
}

int main() {
#ifdef LOCAL
  time_t starttime = clock();
#endif
  int tt;
  scanf("%d", &tt);
  for (int tc = 1; tc <= tt; tc++) {
    printf("Case #%d: ", tc);
    read_input();
    solve();
#ifdef LOCAL
    cerr << "~ TC#" << tc << " done! execution time: " <<
      (double)(clock()-starttime) / CLOCKS_PER_SEC << " s" << endl;
#endif
  }
  return 0;
}
```

## 