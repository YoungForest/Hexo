---
title: kick start 2019 round E
date: 2019-08-29 19:12:03
tags:
- kick start
categories:
- Algorithm
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

Test set 1
```cpp
#include <iostream>
#include <utility>
#include <vector>

using namespace std;

bool solve(const vector<pair<int, int>> &ce, int S, double A, double B) {
    if (S == 1) {
        double Ci = ce[0].first;
        double Ei = ce[0].second;
        return Ci / A <= Ei / B;
    } else {
        for (int x = 0; x <= ce[0].first && x <= A; ++x) {
            auto x2 = A - x;
            if (x2 <= ce[1].first &&
                B <= (((1 - static_cast<double>(x) / ce[0].first) *
                       ce[0].second) +
                      ((1 - static_cast<double>(x2) / ce[1].first) *
                       ce[1].second))) {
                return true;
            }
        }
        return false;
    }
}

int main(int argc, char const *argv[]) {
    int T;
    cin >> T;
    for (int i = 1; i <= T; ++i) {
        int D, S;
        cin >> D >> S;
        vector<pair<int, int>> ce(S);
        for (int j = 0; j < S; ++j) {
            cin >> ce[j].first >> ce[j].second;
        }
        cout << "Case #" << i << ": ";
        for (int j = 0; j < D; ++j) {
            int A, B;
            cin >> A >> B;
            if (solve(ce, S, A, B)) {
                cout << 'Y';
            } else {
                cout << 'N';
            }
        }
        cout << endl;
    }
    return 0;
}
```

## Street Checkers

```cpp

```