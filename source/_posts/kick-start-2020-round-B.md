---
title: kick start 2020 round B
date: 2020-04-19 20:39:28
tags:
- kick start
categories:
- Algorithm
---

| ID | score | rank | Bike Tour | Bus Routes | Robot Path Coding | Wandering Robot | Time |
|--|--|--|--|--|--|--|--|
| YoungForest | 74 | 524 | 5 + 7 | 10 + 13 | 11 + 16 | 14 + 0 | 1:35:18 |

去年一共参加了6轮kickstart，成功拿到Google今年的实习邀请。可惜的是，由于疫情的原因，谷歌中国的暑期实习项目全部取消了。今年为了秋招名额，仍需继续参加kickstart。今天的round B轮次虽然在早上7点，但仍然有很多同学参加。遗憾的是，最后一题的时间复杂度过高，大的Test set TLE了。

## Bike Tour

签到题。遍历一遍mountains, 寻找比前后都高的位置即可。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

int main() {
    int T;
    cin >> T;

    for (int iCase = 1; iCase <= T; ++iCase) {
        int N;
        cin >> N;
        vector<int> mountains(N);
        for (int i = 0; i < N; ++i) {
            cin >> mountains[i];
        }
        int ans = 0;
        for (int i = 1; i < N - 1; ++i) {
            if (mountains[i] > mountains[i - 1] &&
                mountains[i] > mountains[i + 1]) {
                ++ans;
            }
        }
        cout << "Case #" << iCase << ": " << ans << endl;
    }

    return 0;
}
```

## Bus Routes

贪心。从后向前，选择每趟公交最晚的那班。

时间复杂度：O(N), 我这里使用了尾递归的写法，和迭代一样，不需要额外的空间。
空间复杂度：O(N).

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
#include <functional>

using namespace std;

using ll = long long;

vector<ll> schedule(1005);

int main() {
    int T;
    cin >> T;

    for (int iCase = 1; iCase <= T; ++iCase) {
        int N;
        ll D;
        cin >> N >> D;
        for (int i = 0; i < N; ++i) {
            cin >> schedule[i];
        }
        function<ll(int, ll)> f = [&](int index, ll d) -> ll {
            if (index == 0) {
                return (d / schedule[index]) * schedule[index];
            } else {
                return f(index - 1, (d / schedule[index]) * schedule[index]);
            }
        };
        
        cout << "Case #" << iCase << ": " << f(N-1, D) << endl;
    }

    return 0;
}
```

## Robot Path Decoding

类似编译器支持函数调用，我们可以用一个栈存储父程序的状态。

时间复杂度：O(N),
空间复杂度: O(N).

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <stack>
#include <vector>

using namespace std;

using ll = long long;

const ll mod = 1e9;

int main() {
    int T;
    cin >> T;

    for (int iCase = 1; iCase <= T; ++iCase) {
        string instructions;
        cin >> instructions;
        pair<ll, ll> shift = {0, 0};
        stack<ll> st;
        stack<pair<ll, ll>> st_shift;
        char digit = '1';
        for (char c : instructions) {
            switch (c) {
            case '(':
                st.push(digit - '0');
                st_shift.push(shift);
                shift = {0, 0};
                break;
            case ')': {
                ll X = st.top();
                auto before_shift = st_shift.top();
                st.pop();
                st_shift.pop();
                before_shift.first =
                    (before_shift.first + X * shift.first + 12 * mod) % mod;
                before_shift.second =
                    (before_shift.second + X * shift.second + 12 * mod) % mod;
                shift = before_shift;
            } break;
            case 'N':
                shift.second = (shift.second - 1 + mod) % mod;
                break;
            case 'S':
                shift.second = (shift.second + 1) % mod;
                break;
            case 'E':
                shift.first = (shift.first + 1) % mod;
                break;
            case 'W':
                shift.first = (shift.first - 1 + mod) % mod;
                break;
            default:
                break;
            }
            digit = c;
        }

        cout << "Case #" << iCase << ": " << shift.first + 1 << " " << shift.second + 1
             << endl;
    }

    return 0;
}
```

## Wandering Robot

本题比赛时我只做出了小的case，大的数据会TLE。
思路比较简单，用DP计算走到每个格子的概率。
`dp[i][j] = 0.5 * dp[i-1][j] + 0.5 * dp[i][j-1]`.
然后算走到hole上边和左边的概率和，*0.5就是掉到洞里的概率。为了避免处理下边界和右边界的特殊情况，当hole触底时，我们可以通过向左扩展hole，把一定落在hole中的概率提前拦截。当hole触右时，也是类似的处理。

时间复杂度：(W * T), 
空间复杂度：O(W).

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <stack>
#include <vector>

using namespace std;

using ll = long long;

const ll mod = 1e9;
const int MAX_WIDTH = 1e5 + 5;

int main() {
    int T;
    cin >> T;
    vector<double> dp(MAX_WIDTH);

    for (int iCase = 1; iCase <= T; ++iCase) {
        int W, H, L, U, R, D;
        cin >> W >> H >> L >> U >> R >> D;
        --L;
        --U;
        double ans = 0;
        if (D == H && R == W) {
            ans = 1;
        } else {
            if (D == H) {
                // 触底
                L = 0;
            }
            if (R == W) {
                // 触右
                U = 0;
            }
            if (U == 0 && L == 0) {
                ans = 1;
            } else {
                for (int i = 0; i < D; ++i) {
                    for (int j = 0; j < MAX_WIDTH; ++j) {
                        if (i > 0 && j > 0) {
                            dp[j] = 0.5 * dp[j] + 0.5 * dp[j - 1];
                        } else if (j > 0) {
                            dp[j] = 0.5 * dp[j - 1];
                        } else if (i > 0) {
                            dp[j] = 0.5 * dp[j];
                        } else {
                            dp[j] = 1;
                        }
                    }
                    if (L > 0 && i >= U && i < D) {
                        ans += 0.5 * dp[L - 1];
                    }
                    if (U > 0 && i == U - 1) {
                        for (int j = L; j < R; ++j) {
                            ans += 0.5 * dp[j];
                        }
                    }
                }
            }
        }
        cout << "Case #" << iCase << ": " << (1 - ans) << endl;
    }

    return 0;
}
```

一个重要的观察是，可以通过组合数的方式求解prop(i, j): 从零点走到(i, j)的概率，0-index.
prop(i, j) = 0.5 ^ (the length path to (i, j)) * 可能路径的数量
= 0.5 ^ (i + j) * Combination(i + j, j)

为了快速计算组合数，我们可以预计算log(x!), 然后利用公式:

$$ 2^{log_2(n! / (k! \times (n-k)!) / 2^n)} = 2^{log_2 n! - log_2 k! - log_2 (n-k)! - n} $$

时间复杂度: O(W + H),
空间复杂度: O(W).

```cpp
#include <algorithm>
#include <cmath>
#include <functional>
#include <iostream>
#include <stack>
#include <vector>

using namespace std;

using ll = long long;

const ll mod = 1e9;
const int MAX_WIDTH = 1e5 + 5;

double logfactor[2 * MAX_WIDTH];

double CombinationDivide2N(ll n, ll m) {
    return powl(2, logfactor[n] - logfactor[m] - logfactor[n-m] - n);
}

int main() {
    int T;
    cin >> T;
    // preprocess log(x!)
    logfactor[0] = 0;
    for (int i = 1; i < 2 * MAX_WIDTH; ++i) {
        logfactor[i] = logfactor[i-1] + log2l(i);
    }

    auto dp = [&](int i, int j) -> double {
        return CombinationDivide2N(i + j, j);
    };
    for (int iCase = 1; iCase <= T; ++iCase) {
        int W, H, L, U, R, D;
        cin >> W >> H >> L >> U >> R >> D;
        --L;
        --U;
        double ans = 0;
        if (W > MAX_WIDTH || H > MAX_WIDTH) {
            ans = 1;
        } else if (D == H && R == W) {
            ans = 1;
        } else {
            if (D == H) {
                // 触底
                L = 0;
            }
            if (R == W) {
                // 触右
                U = 0;
            }
            if (U == 0 && L == 0) {
                ans = 1;
            } else {
                if (U > 0) {
                    for (int i = L; i < R; ++i) {
                        ans += 0.5 * dp(i, U - 1);
                    }
                }
                if (L > 0) {
                    for (int i = U; i < D; ++i) {
                        ans += 0.5 * dp(L - 1, i);
                    }
                }
            }
        }
        cout << "Case #" << iCase << ": " << (1 - ans) << endl;
    }

    return 0;
}
```