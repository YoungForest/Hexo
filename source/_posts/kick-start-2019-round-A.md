---
title: Kick start 2019 round A
date: 2019-03-24 13:29:15
tags:
- Competitive Programming
categories:
- KickStart
---

[题目链接]

这是我首次参加Kick start比赛。之前本科的时候，和舍友tls 参加过它的前身Code Jam。今年才正式准备Kick start的一系列比赛。原因是这是Google选拔软件工程师的途径，而Google是我的Dream Company。
我于5月22日在清华参加了Google的校园宣讲会。在宣讲会上，前辈们也分外强调准备和参加Kick start的重要性。GG作为一家很左的公司，分外强调公平。而Kick start就是实现招聘公平的一个工具。毕竟相比其他公司的过分注重内推，Kick start给了弱势学校的学生一个机会。

由于平台故障，最后25min无法提交。虽然我提前一个小时放弃比赛了，但是晚上收到邮件告知这个bug。如果没有这个Bug的话，我的排名可能还要后退。
最后的排名是 600/3305.
得分分别为
| | Training  | Parcels | Contention | Total |
|--|--|--|--|--|
| 我的 | 20 | 15 | 0 | 35 |
| 总分 | 20 | 35 | 45 | 100 |

也就是说，我过了签到题和第二题的small case。
题目的难度总体比LeetCode要难的多，最后只有2个人拿到了满分。

## 1. Training

从一个N人的队伍中，挑出P人。要求这P个人的训练时长最小，训练时长为 技能点最大的人的技能点 - 每个人的技能点 之和。
Intuition：
先排序。然后用一个长度为P的窗口，不断滑动，求的最小值。

时间复杂度：O(N log N), 因为排序。
空间复杂度：O(N).

```cpp
#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int solution(vector<int> &skills, int N, int P) {
    sort(skills.begin(), skills.end());

    int need_hour = 0;
    for (int i = 0; i < P - 1; i++) {
        need_hour += skills[P - 1] - skills[i];
    }
    int ret = need_hour;
    int left = 0, right = P - 1;
    while (right < N) {
        right++;
        need_hour += (P - 1) * (skills[right] - skills[right - 1]);
        need_hour -= skills[right - 1] - skills[left];
        left++;
        ret = min(ret, need_hour);
    }
    
    return ret;
}

int main() {
    int T;
    cin >> T;
    
    for (int i = 0; i < T; i++) {
        int N, P;
        cin >> N >> P;
        vector<int> skills;
        for (int j = 0; j < N; j++) {
            int s;
            cin >> s;
            skills.push_back(s);
        }
        cout << "Case #" << i + 1 << ": " << solution(skills, N, P) << endl;
    }
}
```

## 2. Parcels

给定一个R * C的网格。网格中分布着一些邮局，你只能新建造一个邮局。使得所有格子到达最近邮局的最大距离（定义为曼哈顿距离）最短。

Intuition：
我只想到了一种暴力的解法，过了small case。
从邮局出发，更新所有格子的距离。
新加邮局时，枚举所有可能的位置。
时间复杂度: O((R * C)^2)
空间复杂度: O(R * C).

```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>

using namespace std;

// 这里函数名其实应该是 dfs
void bfs(vector<vector<int>>& distance, int R, int C, int i, int j, int depth) {
	distance[i][j] = depth;
	vector<int> di = { -1, 0, 1, 0 };
	vector<int> dj = { 0, 1, 0, -1 };
	for (int k = 0; k < 4; k++) {
		int ni = i + di[k];
		int nj = j + dj[k];
		if (ni < R && nj < C && ni >= 0 && nj >= 0 && distance[ni][nj] > depth + 1) {
			bfs(distance, R, C, ni, nj, depth + 1);
		}
	}
}

int solution(vector<string> &grids, int R, int C) {

	vector<vector<int>> distance(R, vector<int>(C, numeric_limits<int>::max()));
	for (int i = 0; i < R; i++) {
		for (int j = 0; j < C; j++) {
			if (grids[i][j] == '1') {
				bfs(distance, R, C, i, j, 0);
			}
		}
	}

	int ret = numeric_limits<int>::max();
	for (int i = 0; i < R; i++) {
		for (int j = 0; j < C; j++) {
			if (grids[i][j] == '0') {
				auto distance_copy = distance;
				bfs(distance_copy, R, C, i, j, 0);
				int max_distance = 0;
				for (int k = 0; k < R; k++) {
					max_distance = max(max_distance, *max_element(distance_copy[k].begin(), distance_copy[k].end()));
				}
				ret = min(ret, max_distance);
			}
		}
	}

	return (ret == numeric_limits<int>::max()) ? 0 : ret;
}

int main() {
	int T;
	cin >> T;

	for (int i = 0; i < T; i++) {
		int R, C;
		cin >> R >> C;
		vector<string> grids(R);
		for (int j = 0; j < R; j++) {
			cin >> grids[j];
		}
		cout << "Case #" << i + 1 << ": " << solution(grids, R, C) << endl;
	}
}
```

赛后学习官方的ANALYSIS，正确的解法是：

首先考虑如下的子问题：给定一个最大距离K，我们是否可以通过增加一个邮局，使得最大距离小于等于K？
这是一个判定问题。
可以利用我的解法，但是只需要关心那些最大距离大于K的格子。利用这点不同，最后算法的效率会大幅提高。
有了判定问题的解法，我们可以二分搜索出最优解。这也是一种讲 最优化问题 转化为 判定问题的方法。

总的做法如下：
1. 首先求的所有格子到最近邮局的距离。可以通过BFS，从所有邮局开始搜索。因为每个格子访问一次，所以时间复杂度为`O(R * C)`.
2. 对于所有到邮局距离超过K的格子，我们需要找到是否存在一个格子到这些格子的距离小于等于K。为了有效的实现这个步骤，注意到曼哈顿距离计算的等价公式为：`dist((x1, y1), (x2, y2)) = max(abs(x1 + y1 - (x2 + y2)), abs(x1 - y1 - (x2 - y2)))`. 固定点`(x2, y2)`, 最大的曼哈顿距离在 `x1 + y1` 或 `x1 - y1` 最大或最小时达到。对于所有最大到邮局距离超过K的格子，我们都计算`x1 + y1` 或 `x1 - y1` 最大 和 最小值，得到4个值。然后，再尝试所有可以放邮局的格子。每个格子我们都可以在常数时间内判定。所以此步骤的时间复杂度为`RC + RC = O(RC)`。
3. 二分搜索。总的时间复杂度为`O(RC log(R+C))`.

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <queue>
#include <set>
#include <string>
#include <utility>
#include <vector>

using namespace std;

class Solution {
  vector<set<pair<int, int>>> manhatten; // [i] 表示距离为i的点的集合
  vector<int> max_x_sub_y;
  vector<int> min_x_sub_y;
  vector<int> max_x_add_y;
  vector<int> min_x_add_y;
  void bfs(vector<string> &grids, int R, int C) {
    vector<vector<bool>> visited(R, vector<bool>(C, false));
    queue<pair<int, int>> q;
    for (int i = 0; i < R; ++i) {
      for (int j = 0; j < C; ++j) {
        if (grids[i][j] == '1') {
          visited[i][j] = true;
          q.push({i, j});
        }
      }
    }
    int level = 0;
    while (!q.empty()) {
      int s = q.size();
      for (int i = 0; i < s; ++i) {
        auto current = q.front();
        manhatten[level].insert(current);
        q.pop();
        vector<int> di = {-1, 0, 1, 0};
        vector<int> dj = {0, -1, 0, 1};
        for (int k = 0; k < 4; ++k) {
          int ni = current.first + di[k];
          int nj = current.second + dj[k];
          if (ni >= 0 && ni < R && nj >= 0 && nj < C &&
              visited[ni][nj] == false) {
            visited[ni][nj] = true;
            q.push({ni, nj});
          }
        }
      }
      ++level;
    }
  }

  bool possible(vector<string> &grids, int K, int R, int C) {
    int grids_count_larger_than_K =
        accumulate(manhatten.cbegin() + K + 1, manhatten.cend(), 0,
                   [](const auto &lhs, const auto &rhs) -> int {
                     return lhs + rhs.size();
                   });
    if (grids_count_larger_than_K == 0)
      return true;
    int max_x_sub_y_K =
        *max_element(max_x_sub_y.cbegin() + K + 1, max_x_sub_y.cend());
    int min_x_sub_y_K =
        *min_element(min_x_sub_y.cbegin() + K + 1, min_x_sub_y.cend());
    int max_x_add_y_K =
        *max_element(max_x_add_y.cbegin() + K + 1, max_x_add_y.cend());
    int min_x_add_y_K =
        *min_element(min_x_add_y.cbegin() + K + 1, min_x_add_y.cend());

    for (int i = 0; i < R; ++i) {
      for (int j = 0; j < C; ++j) {
        if (grids[i][j] == '0') {
          int distance = numeric_limits<int>::min();
          distance = max(distance, abs(i - j - max_x_sub_y_K));
          distance = max(distance, abs(i - j - min_x_sub_y_K));
          distance = max(distance, abs(i + j - max_x_add_y_K));
          distance = max(distance, abs(i + j - min_x_add_y_K));
          if (distance <= K)
            return true;
        }
      }
    }
    return false;
  }

public:
  int solution(vector<string> &grids, int R, int C) {
    manhatten.resize(R + C);
    bfs(grids, R, C);
    max_x_sub_y.resize(R + C);
    min_x_sub_y.resize(R + C);
    max_x_add_y.resize(R + C);
    min_x_add_y.resize(R + C);
    for (int i = 0; i < manhatten.size(); ++i) {
      max_x_sub_y[i] = numeric_limits<int>::min();
      min_x_sub_y[i] = numeric_limits<int>::max();
      max_x_add_y[i] = numeric_limits<int>::min();
      min_x_add_y[i] = numeric_limits<int>::max();
      for (const auto &point : manhatten[i]) {
        max_x_sub_y[i] = max(max_x_sub_y[i], point.first - point.second);
        min_x_sub_y[i] = min(min_x_sub_y[i], point.first - point.second);
        max_x_add_y[i] = max(max_x_add_y[i], point.first + point.second);
        min_x_add_y[i] = min(min_x_add_y[i], point.first + point.second);
      }
    }

    int lo = 0, hi = R + C;
    auto binary = [&grids, R, C, this](int K) -> bool {
      return this->possible(grids, K, R, C);
    };
    // [lo, hi)
    while (lo < hi) {
      int mid = lo + (hi - lo) / 2;
      if (!binary(mid)) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    return lo;
  }
};

int main() {
  int T;
  cin >> T;

  for (int i = 0; i < T; i++) {
    int R, C;
    cin >> R >> C;
    vector<string> grids(R);
    for (int j = 0; j < R; j++) {
      cin >> grids[j];
    }
    cout << "Case #" << i + 1 << ": " << Solution().solution(grids, R, C)
         << endl;
  }
}
```
<!-- 
进一步优化到O(RC)。在第2步中，我们可以计算得到所有格子的最大最小值。然后，遍历所有可能的格子，得到最大邮局的位置和距离。 -->

## 3. Contention

题意：
给定Q个Bookings，N个seats, 每个booking用L和R表示，意思是索取从L到R的座位，包括L和R。
后面的booking，如果前面的座位被占用的话，就只占用可以占用的那些座位。
求一个最大的K，使得存在一个Bookings的序列。每个Booking都被满足最少K个座位。

数据范围: Q 30000, N 10^6

官方分析：

观测有：给定一个booking序列，最后一个booking可以获得的seats数不依赖于前面的booking的顺序。
所以，我们可以每次确定最后一个booking，然后不断向前挪。答案是Q步中，最小的座位预定数。

另一个观察：每次向前挪的时候，我们可以从剩余的booking中贪心地选择最后一个请求：选择那个我们可以获得最多seats的请求。贪心的直觉证明是：最后的答案在向前挪的时候是非递增的。

该题难度还是很大的，赛中只有2人做出来。我花了半天也还是无法很好地理解。所以题解暂时搁置了。