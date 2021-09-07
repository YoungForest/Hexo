---
title: 'Best implement to use pair as key to std::unordered_map in C++'
date: 2020-05-27 12:29:34
tags:
- C++
- hash
- unordered_map
- English
categories:
- Programming
---

Reference: [C++ Standard Library: A tutorial and reference, Second version](https://www.mica.edu.vn/perso/Vu-Hai/EE3490/Ref/The%20C++Standard%20Library%20-%202nd%20Edition.pdf) Chapter 7.9.2: Creating and Controlling unordered Container

All solutions I found in Google use `XOR` to generate hashcode of `pair`, which is totally bad. see [why-is-xor-the-default-way-to-combine-hashes](https://stackoverflow.com/questions/5889238/why-is-xor-the-default-way-to-combine-hashes). However, the book has given us the best solution, using `hash_combine`, which is taken from `Boost`. The solution is much better than XOR when I tested it in Online Judge([Atcoder](https://atcoder.jp/contests/abc168/tasks/abc168_e)). I organized the code as a template as follow. You can copy and paste it as much as you can. And it is convenient to change it to fit any custom struct/class.

```cpp
#include <functional>
// from boost (functional/hash):
// see http://www.boost.org/doc/libs/1_35_0/doc/html/hash/combine.html template
template <typename T>
inline void hash_combine(std::size_t &seed, const T &val) {
    seed ^= std::hash<T>()(val) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
}
// auxiliary generic functions to create a hash value using a seed
template <typename T> inline void hash_val(std::size_t &seed, const T &val) {
    hash_combine(seed, val);
}
template <typename T, typename... Types>
inline void hash_val(std::size_t &seed, const T &val, const Types &... args) {
    hash_combine(seed, val);
    hash_val(seed, args...);
}

template <typename... Types>
inline std::size_t hash_val(const Types &... args) {
    std::size_t seed = 0;
    hash_val(seed, args...);
    return seed;
}

struct pair_hash {
    template <class T1, class T2>
    std::size_t operator()(const std::pair<T1, T2> &p) const {
        return hash_val(p.first, p.second);
    }
};

#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    unordered_map<pair<ll, ll>, ll, pair_hash> slopeCount;
    unordered_set<pair<ll, ll>, pair_hash> seen;
    return 0;
}
```

There is a hash implementation for `Tuple`. I updated the answer in[StackOverflow](https://stackoverflow.com/a/62035742/6393787)。Please go there if you need hash tuple.