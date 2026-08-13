---
title: LeetCode weekly contest 245
date: 2021-06-13 17:28:42
tags:
- Competitive Programming
categories:
- LeetCode
translations:
  zh-CN: https://youngforest.github.io/2021/06/13/LeetCode-weekly-contest-245/
  en: https://youngforest.github.io/en/2021/06/13/LeetCode-weekly-contest-245/
---
| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (5) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 1904 / 12724 | YoungForest | 12 | 1:39:20 | 0:02:52 | 1:24:20 🐞 3 | 0:21:30 | null |

零神大数据：
1897,Redistribute Characters to Make All Strings Equal,redistribute-characters-to-make-all-strings-equal,1309.1422268153
1898,Maximum Number of Removable Characters,maximum-number-of-removable-characters,1912.8440554296
1899,Merge Triplets to Form Target Triplet,merge-triplets-to-form-target-triplet,1635.6879273926
1900,The Earliest and Latest Rounds Where Players Compete,the-earliest-and-latest-rounds-where-players-compete,2454.7653333657

今天的周赛翻车了。第二题一开始算错时间复杂度了，一直妄图找到更优算法。之后看到80人提交才重新审视二分暴力的时间复杂度，竟然是没问题的。实现过程中又遇到1次WA（判断子序列时，相等字符忘记更新`s`的下标了），2次TLE（标记remove下标不能用`unordered_set`, 而要用`vector`。算是被卡常数了)。这周又要残酷打卡了，幸运的是，因为前2周的成绩比较好，本周残酷榜更新后我的排名不降反升。

## 1897. Redistribute Characters to Make All Strings Equal

签到题。本质是判断所有的字符是否可以平均分配到n个单词中。

```cpp
class Solution {
public:
    bool makeEqual(vector<string>& words) {
        const int n = words.size();
        vector<int> cnt(26, 0);
        for (const auto& word : words) {
            for (char c : word) {
                ++cnt[c - 'a'];
            }
        }
        for (int i : cnt) {
            if (i % n != 0) return false;
        }
        return true;
    }
};
```

时间复杂度: O(sum(words[i].length)),
空间复杂度: O(1).

## 1898. Maximum Number of Removable Characters

最优化问题转判定问题（双指针判断是否是子序列），二分搜索。

```cpp
class Solution {
    using ll = int;
    vector<bool> mark = vector<bool>(1e5);
public:
    int maximumRemovals(string s, string p, vector<int>& removable) {
        const int n = removable.size();
        auto binary = [&](ll lo, ll hi, function<bool(const ll)> predicate) -> int {
            while (lo < hi) {
                ll mid = lo + (hi - lo) / 2;
                if (!predicate(mid)) {
                    hi = mid;
                } else {
                    lo = mid + 1;
                }
            }
            return lo;
        };
        // cout << s.size() << endl;
        // cout << n << endl;
        return binary(0, n + 1, [&](const ll x) -> bool {
            for (int i = 0; i < s.size(); ++i) {
                mark[i] = false;
            }
            for (int i = 0; i < x; ++i) {
                mark[removable[i]] = true;
            }
            int pi = 0, si = 0;
            while (pi < p.size()) {
                while (si < s.size() && (mark[si] || s[si] != p[pi])) ++si;
                if (si == s.size()) 
                {
                    // cout << x << ":false"  << endl;
                    return false;
                }
                // if (s[si] != p[pi]) cout << "impossible" << endl;
                ++si;
                ++pi;
            }
            // cout << x << ":true "<< si   << endl;
            return true;
        }) - 1;
    }
};
```

时间复杂度: O(log removable.length * (s.length + p.length)),
空间复杂度: O(s.length).

本题有个坑是说，标记`s`中哪些位置被标记时，不能用`unordered_set`（即使加`reserve`)，会超时。可以用`vector<bool>`。算是被卡常数了。

## 1899. Merge Triplets to Form Target Triplet

因为每次合并操作是去最大值，因此，只要有一个数大于`target`的`triplet`不能用。
所以把剩下可以用的都合并了，看能不能达到`target`。

```cpp
class Solution {
public:
    bool mergeTriplets(vector<vector<int>>& triplets, vector<int>& target) {
        vector<int> cnt(3, 0);
        for (int i = 0; i < 3; ++i) {
            for (const auto& v : triplets) {
                if (v[i] == target[i] && v[(i + 1) % 3] <= target[(i + 1) % 3] && v[(i + 2) % 3] <= target[(i + 2) % 3]) {
                    ++cnt[i];
                }
            }
        }
        for (int i = 0; i < 3; ++i) {
            if (cnt[i] == 0) return false;
        }
        return true;
    }
};
```

时间复杂度: O(triplets.length),
空间复杂度: O(1).

## 1900. The Earliest and Latest Rounds Where Players Compete

TNL~