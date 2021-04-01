---
title: kick start 2019 round C
date: 2019-07-25 18:51:07
tags:
- Competitive Programming
categories:
- KickStart
---

赛后补的题解。
[题目链接](https://codingcompetitions.withgoogle.com/kickstart/round/0000000000050ff2)

主要参考的是 旷神 直播的解法，和官方 Analysis的解法。

## Wiggle Walk

比较容易想到的是暴力解法。模拟整个命令执行过程，标记每个格子是否之前走过。
时间复杂度: O(N ^ 2).

虽然实际上凑巧可以AC，但比较冒险。理论上会在大的测试集上TLE。

```cpp
#include <vector>
#include <iostream>
#include <string>

using namespace std;

pair<int, int> solve(const string& instructions, const int R, const int C, const int Sr, const int Sc) {
    int current_x = Sr, current_y = Sc;
    vector<vector<bool>> visited(R + 1, vector<bool> (C + 1, false));
    visited[current_x][current_y] = true;
    for (char c : instructions) {
        int dx, dy;
        switch (c)
        {
        case 'N':
            dx = -1;
            dy = 0;
            break;
        case 'E':
            dx = 0;
            dy = 1;
            break;
        case 'W':
            dx = 0;
            dy = -1;
            break;
        case 'S':
            dx = 1;
            dy = 0;
            break;
        default:
            cerr << "Bad instruction: " << c << endl;
            break;
        }
        do {
            current_x += dx;
            current_y += dy;
        } while (visited[current_x][current_y] == true);
        visited[current_x][current_y] = true;
    }
    return {current_x, current_y};
}

int main() {
    int T;
    cin >> T;
    for (int i = 0; i < T; ++i) {
        int N, R, C, Sr, Sc;
        cin >> N >> R >> C >> Sr >> Sc;
        string instructions;
        cin >> instructions;
        auto ans = solve(instructions, R, C, Sr, Sc);
        cout << "Case #" << i + 1 << ": " << ans.first << " " << ans.second << endl;
    }
    return 0;
}
```

需要找到快速跳过已经走过格子的方法。一种是题解里给的，记录interval的方式。时间复杂度: O(N log N). 每次查询interval需要O(log N).

```cpp
#include <iostream>
#include <set>
#include <string>
#include <vector>
#include <cassert>

using namespace std;

int getNext(set<pair<int, int>> &visited, const int x, int direction) {
  auto it = visited.lower_bound({x + 1, x + 1});
  assert(it != visited.begin());
  --it;
  if (direction > 0)
    return it->second;
  else
    return it->first - 1;
}

void visitRow(set<pair<int, int>> &row, int y) {
  auto it = row.lower_bound({y + 1, y + 1});
  if (it == row.begin()) {
    it = row.insert({y, y + 1}).first;
  } else {
    --it;
    if (it->first <= y && it->second > y) {
      return;
    } else if (it->second == y) {
      auto old = it;
      it = row.insert(it, {it->first, it->second + 1});
      it = row.erase(old);
    } else {
      it = row.insert({y, y + 1}).first;
    }
  }
  // merge interval
  if (next(it) != row.end() && next(it)->first == it->second) {
    int end = next(it)->second;
    int begin = it->first;
    row.erase(next(it));
    row.erase(it);
    row.insert({begin, end});
  }
}

void visit(vector<set<pair<int, int>>> &visitedR,
           vector<set<pair<int, int>>> &visitedC, const int x, int y) {
  auto &row = visitedR[x];
  visitRow(row, y);
  auto &column = visitedC[y];
  visitRow(column, x);
}

pair<int, int> solve(const string &instructions, const int R, const int C,
                     const int Sr, const int Sc) {
  int current_x = Sr, current_y = Sc;
  vector<set<pair<int, int>>> visitedR(R + 1);
  vector<set<pair<int, int>>> visitedC(C + 1);
  visit(visitedR, visitedC, current_x, current_y);
  for (char c : instructions) {
    switch (c) {
    case 'N':
      current_x = getNext(visitedC[current_y], current_x, -1);
      break;
    case 'E':
      current_y = getNext(visitedR[current_x], current_y, 1);
      break;
    case 'W':
      current_y = getNext(visitedR[current_x], current_y, -1);
      break;
    case 'S':
      current_x = getNext(visitedC[current_y], current_x, 1);
      break;
    default:
      cerr << "Bad instruction: " << c << endl;
      break;
    }
    visit(visitedR, visitedC, current_x, current_y);
  }
  return {current_x, current_y};
}

int main() {
  int T;
  cin >> T;
  for (int i = 0; i < T; ++i) {
    int N, R, C, Sr, Sc;
    cin >> N >> R >> C >> Sr >> Sc;
    string instructions;
    cin >> instructions;
    auto ans = solve(instructions, R, C, Sr, Sc);
    cout << "Case #" << i + 1 << ": " << ans.first << " " << ans.second << endl;
  }
  return 0;
}
```

另一种是 邝神 直播中的方法。用并查集，需要注意的是union时，方向是重要的。时间复杂度为 O(N).

```cpp
#include <cstdio>
#include <cstring>
#include <map>

using namespace std;

struct UF {
    int F[200010];
    int find(int x) {
        if (F[x] == -1) return x;
        return F[x] = find(F[x]);
    }
    void init() {
        memset(F, -1, sizeof(F));
    }
    void join(int x, int y) {
        int t1 = find(x);
        int t2 = find(y);
        if (t1 != t2) {
            F[t2] = t1;
        }
    }
};

UF N, E, W, S;

map<pair<int, int>, int> p2Id;
int tot;
map<int, pair<int, int>> id2P;
void init() {
    N.init();
    E.init();
    W.init();
    S.init();
    tot = 0;
    p2Id.clear();
    id2P.clear();
}

int getId(int x, int y) {
    pair<int, int> p = make_pair(x, y);
    if (!p2Id.count(p)) {
        p2Id[p] = tot;
        id2P[tot] = p;
        tot++;
    }
    return p2Id[p];
}

void gao(int x, int y) {
    int now = getId(x, y);

    int w = getId(x, y-1);
    int e = getId(x, y+1);
    int n = getId(x-1, y);
    int s = getId(x+1, y);
    W.join(w, now);
    E.join(e, now);
    N.join(n, now);
    S.join(s, now);
}

pair<int, int> getNext(int x, int y, char dir) {
    int now = getId(x, y);
    int nextId;
    if (dir == 'N') {
        nextId = N.find(now);
    } else if (dir == 'E') {
        nextId = E.find(now);
    } else if (dir == 'W') {
        nextId = W.find(now);
    } else if (dir == 'S') {
        nextId = S.find(now);
    }
    return id2P[nextId];
}

char str[50010];

int main() {
    int T;
    int iCase = 0;
    scanf("%d", &T);
    while (T--) {
        iCase++;
        int N, R, C, sx, sy;
        scanf("%d%d%d%d%d", &N, &R, &C, &sx, &sy);
        scanf("%s", str);
        init();
        gao(sx, sy);
        pair<int, int> now = make_pair(sx, sy);
        for (int i = 0; i < N; ++i) {
            now = getNext(now.first, now.second, str[i]);
            gao(now.first, now.second);
        }
        printf("Case #%d: %d %d\n", iCase, now.first, now.second);
    }
    return 0;
}
```

## Circuit Board

旷神用了比较暴力的解法。O(R * C^2).
记录每个格子之前相差K的格子数。
然后，枚举每列和K，扫描行，更新最大面积。

观察数据规模，和实际测试，都是能过的。Kick start的时间复杂度基本上也是`10^6`这个量级。

```cpp
#include <algorithm>
#include <cstdio>

using namespace std;

int a[310][310];
int diff[310][310][310];

int main() {
  int T;
  int iCase = 0;
  scanf("%d", &T);
  while (T--) {
    iCase++;
    int R, C, K;
    scanf("%d%d%d", &R, &C, &K);
    for (int i = 0; i < R; i++) {
      for (int j = 0; j < C; j++) {
        scanf("%d", &a[i][j]);
      }
    }
    for (int i = 0; i < R; i++) {
      for (int j = 0; j < C; ++j) {
        int Min = a[i][j];
        int Max = a[i][j];
        for (int k = j; k < C; ++k) {
          Min = min(a[i][k], Min);
          Max = max(a[i][k], Max);
          diff[i][j][k] = Max - Min;
        }
      }
    }
    int ans = 0;
    for (int j = 0; j < C; ++j) {
        for (int k = j; k < C; ++k) {
            int now = 0;
            for (int i = 0; i < R; ++i) {
                if (diff[i][j][k] <= K) {
                    ans = max(ans, (k - j + 1) * (i - now + 1));
                } else {
                    now = i + 1;
                }
            }
        }
    }
    printf("Case #%d: %d\n", iCase, ans);
  }
  return 0;
}
```

官方的解法是`O(N log N)`的。
借助线段树快速查询最大最小值，二分确定满足K的右边界，largest-rectangle-under-histogram 获取最大矩形面积。
十分考验就高级数据结构和算法的熟悉程度和快速实现能力。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <stack>
#include <cmath>

using namespace std;
// https://www.geeksforgeeks.org/min-max-range-queries-array/
// https://www.geeksforgeeks.org/largest-rectangle-under-histogram/

struct SegmentTree {
    vector<pair<int, int>> st;
    int n = 0;
    SegmentTree(const vector<int>& a) {
        n = a.size();
        int x = ceil(log2(n));
        int max_size = std::pow(2, x + 1) - 1;
        st.resize(max_size);

        constructSTUtil(a, 0, n-1, 0);
    }
    // A recursive function that constructs Segment Tree for array[ss..se].
    // si is index of current node in segment tree st
    void constructSTUtil(const vector<int>& arr, int ss, int se, int si) {
        // If there is one element in array, store it in current node of segment tree and return
        if (ss == se) {
            st[si].first = arr[ss];
            st[si].second = arr[ss];
            return;
        }
        // If there are more than one elements, then recurse for left and right
        // subtrees and store the minimum and maximum of two values in this nodee
        int mid = ss + (se - ss) / 2;
        constructSTUtil(arr, ss, mid, si*2+1);
        constructSTUtil(arr, mid+1, se, si*2+2);
        st[si].first = min(st[si*2+1].first, st[si*2+2].first);
        st[si].second = max(st[si*2+1].second, st[si*2+2].second);
    }
    /**
     * A recursive function to get the minimun and maximum value in a
     * given range of array indexes. The following are parameters for thie function.
     * 
     * st --> segment tree vector
     * index --> index of current node in the segment tree. Initially 0 is passed as root is always at index 0
     * ss && se --> Starting and ending indexes of the segment represented by current node, i.e. st[index]
     * qs && qe --> Starting and ending indexes of query range
     */
    pair<int, int> maxMinUtil(int ss, int se, int qs, int qe, int index) {
        // if segment of this node is a part of given range,
        // then return the minimum and maximum node of the segment
        if (ss >= qs && se <= qe) {
            return st[index];
        }
        // If segment of this node is outside the given range
        if (se < qs || ss > qe) {
            return {numeric_limits<int>::max(), numeric_limits<int>::min()};
        }
        // If a part of this segment overlaps with the given range
        int mid = ss + (se - ss) / 2;
        auto left = maxMinUtil(ss, mid, qs, qe, index*2+1);
        auto right = maxMinUtil(mid+1, se, qs, qe, index*2+2);
        return {min(left.first, right.first), max(left.second, right.second)};
    }
    pair<int, int> maxMin(int qs, int qe) {
        if (qs < 0 || qe > n - 1 || qs > qe) {
            cerr << "Invalid Input" << endl;
            return {numeric_limits<int>::max(), numeric_limits<int>::min()};
        }
        return maxMinUtil(0, n-1, qs, qe, 0);
    }
    int queryDiff(int qs, int qe) {
        auto ans = maxMin(qs, qe);
        return ans.second - ans.first;
    }
};

int solve(const vector<vector<int>>& board, int K) {
    int R = board.size();
    int C = board[0].size();
    vector<vector<int>> heigth(R, vector<int>(C));
    for (int i = 0; i < R; ++i) {
        auto maxMin = SegmentTree(board[i]);
        for (int j = 0; j < C; ++ j) {
            int lo = j, hi = C;
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (maxMin.queryDiff(j, mid) <= K) {
                    lo = mid + 1;
                } else {
                    hi = mid;
                }
            }
            heigth[i][j] = lo - j;
        }
    }
    int ans = 0;
    for (int j = 0; j < C; ++j) {
        stack<int> s;
        int i = 0;
        while (i < R) {
            if (s.empty() || heigth[s.top()][j] <= heigth[i][j]) {
                s.push(i);
                ++i;
            } else {
                int tp = s.top();
                s.pop();
                ans = max(ans, heigth[tp][j] * (s.empty() ? i : i - s.top() - 1));
            }
        }
        while (!s.empty()) {
            int tp = s.top();
            s.pop();
            ans = max(ans, heigth[tp][j] * (s.empty() ? i : i - s.top() - 1));
        }
    }
    return ans;
}
 
int main() {
  int T;
  cin >> T;
  for (int i = 1; i <= T; ++i) {
      int R, C, K;
      cin >> R >> C >> K;
      vector<vector<int>> board(R, vector<int>(C));
      for (int j = 0; j < R; ++j) {
          for (int k = 0; k < C; ++k) {
              cin >> board[j][k];
          }
      }
      int ans = solve(board, K);
      cout << "Case #" << i << ": " << ans << endl;
  }
  return 0;
}
```


## Catch Some

经典的DP问题。
每种颜色的衬衫肯定只穿一次。因为2次所走的路肯定大于一次，而且观察到的狗的数量是一样的。
每种颜色有2个最小花费，一种是需要返回到原点的，另一种是不需要。
dp[i][j][0/1]表示使用了 (第i种颜色，观察了j个狗，不返回/返回到原点) 所需的最小花费。

```cpp
#include <algorithm>
#include <vector>
#include <cstdio>

using namespace std;

int P[1010], A[1010];
int dp[1010][1010][2];
const int INF = 0x3f3f3f3f;

vector<int> vec[1010];

int main() {
    int T;
    int iCase = 0;
    scanf("%d", &T);
    while (T--) {
        iCase++;
        int n, k;
        scanf("%d%d", &n, &k);
        for (int i = 0; i < n; ++i) {
            scanf("%d", &P[i]);
        }
        for (int i = 0; i < n; ++i) {
            scanf("%d", &A[i]);
        }
        for (int i = 1; i <= 1000; ++i) {
            vec[i].clear();
        }
        for (int i = 0; i < n; ++i) {
            vec[A[i]].push_back(P[i]);
        }
        for (int i = 1; i <= 1000; ++i) {
            sort(vec[i].begin(), vec[i].end());
        } 
        for (int i = 0; i <= 1000; ++i) {
            for (int j = 0; j <= n; ++j) {
                dp[i][j][0] = dp[i][j][1] = INF;
            }
        }
        dp[0][0][0] = dp[0][0][1] = 0;
        for (int i = 0; i < 1000; ++i) {
            for (int j = 0; j <= n;++j) {
                if (dp[i][j][0] == INF && dp[i][j][1] == INF) {
                    continue;
                }
                int sz = vec[i+1].size();
                for (int x = 0; x <= sz; ++x) {
                    int tmp = x == 0 ? 0 : vec[i+1][x-1];
                    dp[i+1][j+x][0] = min(dp[i+1][j+x][0], dp[i][j][0] + 2 * tmp);
                    dp[i+1][j+x][1] = min(dp[i+1][j+x][1], dp[i][j][0] + tmp);
                    dp[i+1][j+x][1] = min(dp[i+1][j+x][1], dp[i][j][1] + 2 * tmp);
                }
            }
        }
        printf("Case #%d: %d\n", iCase, dp[1000][k][1]);
    }
}
```

## 后记

总结一下kick start的常考考点：
- DP/背包
- 二分
- 线段树