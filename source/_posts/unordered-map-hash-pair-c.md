---
title: pair 作为 unordered_map unordered_set 的键值 C++
date: 2020-05-27 11:57:01
tags:
- C++
- hash
- unordered_map
categories:
- Programming
---

今天在做[一道AtCoder的题目](https://atcoder.jp/contests/abc168/tasks/abc168_e)，有个test case一直TLE。研究这个测试用例和其他用例的区别，苦思不得其解。后来把unordered_map换成map就过了。虽然在小数据集上hashmap和treemap区别不大，但数据量大的话，hashmap还是好些。所以最佳实践是，在不需要排序特性时，就用hashmap。
而且之前也从来没有遇到过hashmap比treemap效果差这么多的原因。最后花了一上午时间，才定位到是我的 pair 的hash函数实现太糟糕了。因为C++ STL中并没有pair的hash特化，所以如果想把pair当作键用在unordered_map中的话，就需要自己实现hash函数。我直接从网上抄了一个实现, 直接将 `std::hash<T>()(pair.first) ^ std::hash<U>()(pair.second)`。为了避免误人子弟，我就不贴代码了。正是抄的这个实现害苦我了，hash函数碰撞严重，导致效率低下。令人惊讶的是，这种错误的实现遍布全网，无论是中文的还是英文的。我从犄角旮旯（[stackoverflow问题](https://stackoverflow.com/questions/20590656/error-for-hash-function-of-pair-of-ints)的评论区中）里才找到问题所在和正确的实现。所以特意总结此博文，避免更多的同学踩坑。
>std::hash<T>()(x.first) ^ std::hash<T>()(x.second); - that's a spectacularly collision-prone way to hash a pair, as every pair with two identical value hashes to 0, and every pair {a, b} hashes the same as {b, a}. For vaguely demanding use, much better to find a hash_combine function and employ that.

惊讶的是，一看到这个评论，我就像中电一样。忽然记起，多年前，当我还是一只小白时，读《C++ 标准库（第二版）》时，作者就已经给出了绝佳的解决方案。我匆忙翻出珍藏的《C++ 标准库（第二版）》的unordered_map对应章节，“7.9.2 Creating and Controlling Unordered Container"，把任意结构hash化的代码搬出来，模版如下：

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

修改了hash_pair的实现后，我如愿地AC了。一个hash函数的错误，我花了一上午时间解决。并由此从多年前的学习经验中获益。当时我苦读《C++标准库》时，并没有对这段代码特别注意。由此可见，多读书总是没坏处的。

平时因为Google搜索很方便，遇到问题总是倾向于简单地 复制粘贴。通常情况下，问题就解决了。这样固然可以更快地完成任务，效果也不错。但这种不求甚解的思想对自己的成长是十分不利的。所以需要遇到问题深入钻研（当然是在时间足够的情况下），多读一些经典的书。很多问题和解决方案，经典的书本都已给出了。读书也更能启发自己思考和成长。本次的pair的 unordered_map实践就是最好的证明。