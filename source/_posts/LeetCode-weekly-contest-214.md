---
title: LeetCode weekly contest 214
date: 2020-11-08 18:20:06
tags:
- Competitive Programming
categories:
- LeetCode
---

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 393 / 9769 | YoungForest | 18 | 1:36:40 | 0:05:13 | 0:11:24 | 0:44:59 |  1:26:40  2 |

残酷群排名维持在14名了，看来这就是我的水平收敛的位置了。最近由于写毕业大论文比较忙，另一方面秋招也结束了，打卡题都没打了。11月才恢复开始打美服和国服每日一题，拿积分换衣服。残酷群由于基本可以免打卡，就一个月都没打了。

## 5561. Get Maximum in Generated Array

签到题。按照递推公式填写每一个元素。

```cpp
class Solution {
public:
    int getMaximumGenerated(int n) {
        vector<int> nums(n + 1);
        int ans = 0;
        nums[0] = 0;
        if (nums.size() <= 1) return 0;
        nums[1] = 1;
        ans = 1;
        for (int i = 2; i <= n; ++i) {
            if (i % 2 == 0) {
                nums[i] = nums[i / 2];
            } else {
                nums[i] = nums[i / 2] + nums[i / 2 + 1];
            }
            ans = max(ans, nums[i]);
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

## 5562. Minimum Deletions to Make Character Frequencies Unique

贪心。不断删除字符，直到有空缺的位置。

```cpp
class Solution {
public:
    int minDeletions(string s) {
        vector<int> cnt(26, 0);
        for (char c : s) {
            ++cnt[c - 'a'];
        }
        set<int> count;
        int ans = 0;
        for (int a : cnt) {
            if (a != 0) {
                while (a != 0 && count.find(a) != count.end()) {
                    ++ans;
                    --a;
                }
                count.insert(a);
            }
        }
        return ans;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(26).

## 5563. Sell Diminishing-Valued Colored Balls

贪心。每次都试图先拿球数最多的颜色。拿的过程中并不是要一个一个拿，而是可以一次拿尽可能多的。
用一个优先队列维护最多的颜色数目，用等差数列求和求解拿的cost。

```cpp
class Solution {
    using ll = long long;
    const ll MOD = 1e9 + 7;
    using pii = pair<int, int>;
public:
    int maxProfit(vector<int>& inventory, int o) {
        ll orders = o;
        // greedy
        ll ans = 0;
        map<ll, ll, greater<ll>> cnt;
        for (ll i : inventory) {
            ++cnt[i];
        }
        cnt[0] = 0;
        while (orders > 0) {
            auto first = *cnt.begin();
            if (first.first == 0) return -1;
            auto second = *next(cnt.begin());
            cnt.erase(cnt.begin());
            cnt.erase(cnt.begin());
            ll balls = (first.first - second.first) * first.second;
            pii newSecond = {second.first, second.second + first.second};
            ll reduce = min(orders, balls);
            orders -= reduce;
            // cout << first.first << " " << first.second << " " << reduce << endl;
            const ll batch = reduce / first.second;
            const ll remain = reduce % first.second;
            ans = (ans + (first.first * batch - batch*(batch-1) / 2) * first.second) % MOD;
            ans = (ans + (first.first - batch) * remain) % MOD;
            // for (int i = 0; i * first.second < reduce; ++i) {
            //     // cout <<  min(first.second, reduce - i) << " " <<  (first.first - i) << endl;
            //     ans = (ans + min(first.second, reduce - i * first.second) * (first.first - i)) % MOD;
            // }
            // cout << ans << endl;
            cnt.insert(newSecond);
        }
        return ans;
    }
};
```

时间复杂度: O(N log N), N = inventory.size()
空间复杂度: O(N).

时间复杂度并不是那么明显，可以考虑cnt的size每次减一这个事实。所以while循环最多被执行N次。

## 5564. Create Sorted Array through Instructions

核心在于需要这样一个数据结构，可以求解一定范围的元素的数量。可以使用 线段树、树状数组（BIT）、rank tree 等。比赛时我首先使用了GNU pbds实现的rank tree的板子，但是超时了。按理说复杂度是没问题的。
然后，其实[国服前一天的每日一题](https://leetcode-cn.com/problems/count-of-range-sum/solution/qu-jian-he-de-ge-shu-by-leetcode-solution/)也用到同样的数据结构，去抄了treap的板子。由于不了解接口，光调试就花了半个小时。所幸最后5分钟AC了，这周又可以不用打卡残酷群了（已经一个月没打了）。
需要注意板子接口中`rank`是1开头索引的。

```cpp
class BalancedTree {
private:
    struct BalancedNode {
        long long val;
        long long seed;
        int count;
        int size;
        BalancedNode* left;
        BalancedNode* right;

        BalancedNode(long long _val, long long _seed): val(_val), seed(_seed), count(1), size(1), left(nullptr), right(nullptr) {}

        BalancedNode* left_rotate() {
            int prev_size = size;
            int curr_size = (left ? left->size : 0) + (right->left ? right->left->size : 0) + count;
            BalancedNode* root = right;
            right = root->left;
            root->left = this;
            root->size = prev_size;
            size = curr_size;
            return root;
        }

        BalancedNode* right_rotate() {
            int prev_size = size;
            int curr_size = (right ? right->size : 0) + (left->right ? left->right->size : 0) + count;
            BalancedNode* root = left;
            left = root->right;
            root->right = this;
            root->size = prev_size;
            size = curr_size;
            return root;
        }
    };

private:
    BalancedNode* root;
    int size;
    mt19937 gen;
    uniform_int_distribution<long long> dis;

private:
    BalancedNode* insert(BalancedNode* node, long long x) {
        if (!node) {
            return new BalancedNode(x, dis(gen));
        }
        ++node->size;
        if (x < node->val) {
            node->left = insert(node->left, x);
            if (node->left->seed > node->seed) {
                node = node->right_rotate();
            }
        }
        else if (x > node->val) {
            node->right = insert(node->right, x);
            if (node->right->seed > node->seed) {
                node = node->left_rotate();
            }
        }
        else {
            ++node->count;
        }
        return node;
    }

public:
    BalancedTree(): root(nullptr), size(0), gen(random_device{}()), dis(LLONG_MIN, LLONG_MAX) {}

    long long get_size() const {
        return size;
    }

    void insert(long long x) {
        ++size;
        root = insert(root, x);
    }

    long long lower_bound(long long x) const {
        BalancedNode* node = root;
        long long ans = LLONG_MAX;
        while (node) {
            if (x == node->val) {
                return x;
            }
            if (x < node->val) {
                ans = node->val;
                node = node->left;
            }
            else {
                node = node->right;
            }
        }
        return ans;
    }

    long long upper_bound(long long x) const {
        BalancedNode* node = root;
        long long ans = LLONG_MAX;
        while (node) {
            if (x < node->val) {
                ans = node->val;
                node = node->left;
            }
            else {
                node = node->right;
            }
        }
        return ans;
    }

    pair<int, int> rank(long long x) const {
        BalancedNode* node = root;
        int ans = 0;
        while (node) {
            if (x < node->val) {
                node = node->left;
            }
            else {
                ans += (node->left ? node->left->size : 0) + node->count;
                if (x == node->val) {
                    return {ans - node->count + 1, ans};
                }
                node = node->right;
            }
        }
        return {INT_MIN, INT_MAX};
    }
};

class Solution {
    const int MOD = 1e9 + 7;
    using ll = long long;
public:
    int createSortedArray(vector<int>& instructions) {
        BalancedTree* treap = new BalancedTree();
        int ret = 0;
        for (long long i: instructions) {
            // numLeft is the smallest >= i
            long long numLeft = treap->lower_bound(i);
            // cout << "numLeft: " << numLeft << endl;
            // rankLeft is the rank of numLeft, starting from 0
            ll rankLeft = (numLeft == LLONG_MAX ? treap->get_size(): treap->rank(numLeft).first - 1);
            // numRight is the smallest > i
            long long numRight = treap->upper_bound(i);
            // cout << "numRight: " << numRight << endl;
            // rankLeft is the rank of numLeft, starting from 0
            ll rankRight = (numRight == LLONG_MAX ? treap->get_size(): treap->rank(numRight).first - 1);
            // cout << rankLeft - 1 << " " << treap->get_size() - rankRight << endl;
            ret = (ret + min(treap->get_size() - rankRight, rankLeft)) % MOD;
            treap->insert(i);
        }
        return ret;
    }
};
```

时间复杂度: O(N log N),
空间复杂度: O(N).