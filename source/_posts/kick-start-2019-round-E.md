---
title: kick start 2019 round E
date: 2019-08-29 19:12:03
tags:
- Competitive Programming
categories:
- KickStart
---

## Cherries Mesh

Minimum spanning tree.
尤其要注意Union-find的实现中，find要采用path compression的方法才能实现O(1).
否则会超时。


```cpp
#include <iostream>
#include <vector>

using namespace std;

struct UF {
	vector<int> parents;
	UF(int n) {
		parents.resize(n);
		for (int i = 0; i < n; ++i) {
			parents[i] = i;
		}
	}

	int find(int x) {
		return parents[x] == x ? x : (parents[x] = find(parents[x]));
	}

	void unio(int x, int y) {
		int px = find(x);
		int py = find(y);
		parents[px] = py;
	}
};

int main() {
	int T;
	cin >> T;
	for (int i = 0; i < T; ++i) {
		int N, M;
		cin >> N >> M;
		UF uf(N);
		int ans = 0;
		for (int j = 0; j < M; ++j) {
			int l, r;
			cin >> l >> r;
			--l;
			--r;
			if (uf.find(l) == uf.find(r)) {
				continue;
			}
			uf.unio(l, r);
			ans += 1;
		}
		ans += (N - 1 - ans) * 2;
		cout << "Case #" << i + 1 << ": " << ans << endl;
	}
	return 0;
}
```

## Code-Eat Switcher

### Test set 1:

S = 1 或 2。列不等式就可以求解。
当S = 2时，有2个变量，不等式求解过程类似线性规划。

比赛的时候思路是对的，但是因为S = 1时，返回值写错了，一直没有AC。当时一直在调S = 2时的逻辑，完全没有想到S = 1时会出错。

```cpp
#include <vector>
#include <iostream>
#include <unordered_map>
#include <map>
#include <cmath>

using namespace std;

bool solve(const vector<pair<int, int>>& energy, const int S, double code, double eat) {
    if (S == 1) {
        double Ci = energy[0].first;
        double Ei = energy[0].second;
        return code / Ci + eat / Ei <= 1;
    } else if (S == 2) {
        double C1 = energy[0].first, C2 = energy[1].first;
        double E1 = energy[0].second, E2 = energy[1].second;
        if (C1 / C2 == E1 / E2) {
            vector<pair<int, int>> tmp = {make_pair(energy[0].first + energy[1].first, energy[0].second + energy[1].second)};
            return solve(tmp, 1, code, eat);
        }
        double C = code, E = eat;
        double x = (C / C2 - 1 + E / E2 - E1 / E2) / (C1 / C2 - E1 / E2);
        double y = C / C2 - x * C1 / C2;
        // cout << "result: " << x << ", " << y << "|" << x * C1 + y * C2 << ", " << (1 - x) * E1 + (1 - y) * E2 << " | " << 
        // 1 - E / E2 + E1 / E2 - x * E1 / E2
        // << endl;
        if (x > 1) {
            return 1 - E / E2 + E1 / E2 - 1 * E1 / E2 >= C / C2 - 1 * C1 / C2;
        }
        if (y > 1) {
            return (1 - E / E2 + E1 / E2 - 1) * (E2 / E1) >= (C / C2 - 1) * (C2 / C1);
        }
        if (x < 0) {
            return 1 - E / E2 + E1 / E2 >= C / C2;
        }
        if (y < 0) {
            return (1 - E / E2 + E1 / E2) * (E2 / E1) >= (C / C2) * (C2 / C1);
        }
        return true;
        // return x >= 0 && y >= 0 && x <= 1 && y <= 1;
    } else {
        return false;
    }
}

int main()
{
	int T;
	cin >> T;
	for (int i = 0; i < T; ++i)
	{
		int D, S;
        cin >> D >> S;
        string ans;
        vector<pair<int, int>> energy(S);
        for (int i = 0; i < S; ++i) {
            cin >> energy[i].first >> energy[i].second;
        }
        for (int i = 0; i < D; ++i) {
            int A, B;
            cin >> A >> B;
            bool yes = solve(energy, S, A, B);
            if (yes) {
                ans.push_back('Y');
            } else {
                ans.push_back('N');
            }
        }
		cout << "Case #" << i + 1 << ": " << ans << endl;
	}
	return 0;
}
```

### Test Set 2

观察有，对于每个slot，每获得1份eating能量，就会少收获$C_i / E_i$份coding能量。所以如果$C_i / E_i < C_j / E_j$的话，更好的选择永远时i。
根据这个观察，我们把slot根据$C_i / E_i$排序，计算E的前缀和和C的后缀和。每天使用二分查找找到满足eating的分界点，再判断是否满足coding。

```cpp
#include <cmath>
#include <iostream>
#include <map>
#include <unordered_map>
#include <vector>
#include <algorithm>

using namespace std;

bool solve(const vector<pair<int, int>> &energy, const int S,
           const vector<int> &prefix, const vector<int> &suffix, int code,
           int eat) {
    auto it = lower_bound(prefix.begin(), prefix.end(), eat);
    int index = distance(prefix.begin(), it);
    if (index == S) {
        return false;
    }
    double need;
    if (index == 0) {
        need = eat;
    } else {
        need = eat - prefix[index - 1];
    }
    double f = need / energy[index].second;
    double code_have;
    if (index == S - 1) {
        code_have = 0;
    } else {
        code_have = suffix[index + 1];
    }
    double code_need = code - code_have;
    return (1 - f) * energy[index].first >= code_need;
}

int main() {
    int T;
    cin >> T;
    for (int i = 0; i < T; ++i) {
        int D, S;
        cin >> D >> S;
        string ans;
        vector<pair<int, int>> energy(S);
        for (int i = 0; i < S; ++i) {
            cin >> energy[i].first >> energy[i].second;
        }
        sort(energy.begin(), energy.end(),
             [](const auto &lhs, const auto &rhs) -> bool {
                 return lhs.first / static_cast<double>(lhs.second) <
                        rhs.first / static_cast<double>(rhs.second);
             });
        // build prefix cumulative for eating
        vector<int> prefix(S);
        int current = 0;
        for (int i = 0; i < S; ++i) {
            current += energy[i].second;
            prefix[i] = current;
        }
        // build suffix cumulative for coding
        vector<int> suffix(S);
        current = 0;
        for (int i = S - 1; i >= 0; --i) {
            current += energy[i].first;
            suffix[i] = current;
        }
        // binary search for each day
        for (int i = 0; i < D; ++i) {
            int A, B;
            cin >> A >> B;
            bool yes = solve(energy, S, prefix, suffix, A, B);
            if (yes) {
                ans.push_back('Y');
            } else {
                ans.push_back('N');
            }
        }
        cout << "Case #" << i + 1 << ": " << ans << endl;
    }
    return 0;
}
```

## Street Checkers

一个数X是否是interesting的，可以转化为 |(# of odd divisors) - (# of even divisors)| <= 2.
对于R < 10^6的数据集，我们可以把所有小于10^6的数，进行预处理获得其约束的个数，时间复杂度为O(sqrt(X))，然后建立[1, X]中interesting数目的prefix sum。对于query [L, R]，我们就可以O(1)获得答案了。总的时间复杂度为$O(R_{max} \sqrt{R_{max}} + T)$, 预处理 + T个测试用例.

对于大的数据集，我们还需要继续观察。
任何奇数的约数仍然是奇数。每个整数X都能写成$X = A \times 2 ^ p$, 其中 A是一个奇数，X是非负整数。
因此，我们可以把X的所有约数分为组, 其中$d_1$,$d_2$,...,$d_k$是A的约数。

$\{d_1, d_1 * 2, d_1 * 2^2, \dots, d_1 * 2^p\}$
$\{d_2, d_2 * 2, d_2 * 2^2, \dots, d_2 * 2^p\}$
$\dots$
$\{d_k, d_k * 2, d_k * 2^2, \dots, d_k * 2^p\}$

可以发现，奇约数的个数为k, (k >= 1, 至少有个奇约数为1)。
偶约数为k * X.
奇偶之差为 $|k(X-1)| \le 2$.
解为：
- Case 1: X = 0, k = 1 or 2
- Case 2: X = 1, k can be any value
- Case 3: X = 2, k = 1 or 2
- Case 4: X = 3, k = 1

- Case 1 表示 1 或 一个奇质数。
- Case 2 表示，A可以为任意奇数，则原数的形式为 $ 2*(2n + 1) = 4 * n + 2$, 可以通过O(1)算出。
- Case 3 表示, A 为 1 或 任意奇质数。也就是[L / 4, R / 4]中的奇质数个数。
- Case 4 只表示一个数 8.
求质数的个数可以使用[Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes).

时间复杂度: $O(T * (R - L + 1) * log(\sqrt{R}))$

```cpp

```