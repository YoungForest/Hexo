---
title: LeetCode biweekly contest 49
date: 2021-04-04 19:52:35
tags:
- Competitive Programming
categories:
- LeetCode
---


| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 108 / 9082 | YoungForest | 18 | 1:37:36 | 0:03:39 |  0:09:01 |  0:14:28 | 1:27:36  2 |

最近因为放松了刷题，自己竞赛水平也有所降低。不过这算是我刻意为之的。之前疯狂刷题刷了1k+，后来遇到瓶颈，改为每天刷3题（国服每日一题，美服每日一题，残酷群每日一题。分别有积分和红包奖励），现在已经基本每日0题，只是坚持打周赛维持手感和获得快乐。
诚然刷题和比赛是很快乐的，让人上瘾，我早已欲罢不能。
但是因为面临毕业和毕业论文的压力，我刻意控制了自己刷题的时间和投入。
不知道你能不能理解，在写论文的时候，什么东西都能成为诱惑。而刷题这种我平日里就很喜欢的活动更是成为了巨大的诱惑和逃避之地。究其根本，写论文和做实验真的是太痛苦了。
甚至不需要是刷题，别的什么阻止我都足够了。比如 看书，看电影，刷论坛。
没办法，论文总是要强迫自己投入主要精力去做的。我不是一个意志力足够坚强的人。
因此，刷题被我刻意远离了。仅仅品尝每周竞赛的快乐就足够了。

因为水平的降低和自己国服rating太高（2400+），我现在已经基本转战美服了。美服账号rating不到2200，尚且有不小的上升空间。打起来压力也不会太大。
之前打国服，连跌2次，险些跌出2400俱乐部。
我打算先把美服也打上2400. 这样不把鸡蛋放在一个篮子里，自己的rating也更稳定些。

<!-- more -->

## 1812. Determine Color of a Chessboard Square

签到题。根据棋盘黑白交替的特性，推断对应坐标的颜色。

```cpp
class Solution {
public:
    bool squareIsWhite(string coordinates) {
        bool firstBlack = ((coordinates[0] - 'a') % 2) == 0;
        if (((coordinates[1] - '1') % 2 ) == 0) {
            return !firstBlack;
        } else {
            return firstBlack;
        }
    }
};
```

时间复杂度: O(1),
空间复杂度: O(1).

## 1813. Sentence Similarity III

Stright forward. 根据题意，a 相似于 b的话，需要从头和尾各相等，然后在中间碰头。

```python
class Solution:
    def areSentencesSimilar(self, sentence1: str, sentence2: str) -> bool:
        def similar(a, b):
            aa = a.split(' ')
            bb = b.split(' ')
            # a insert a sentence to b
            if len(aa) > len(bb): return False
            begin = 0
            while begin < len(aa) and aa[begin] == bb[begin]:
                begin += 1
            end = len(aa) - 1
            endB = len(bb) - 1
            while end >= begin and endB >= begin and aa[end] == bb[endB]:
                end -= 1
                endB -= 1
            return begin > end
            
            
        return similar(sentence1, sentence2) or similar(sentence2, sentence1)
```

时间复杂度: O(sentence.length),
空间复杂度: O(sentence.length).

## 1814. Count Nice Pairs in an Array

`nums[i] + rev(nums[j]) == nums[j] + rev(nums[i])` 可以转化为
`nums[i] - rev(nums[i]) == nums[j] - rev(nums[j])`. 问题因此转换为统计相等对。

```cpp
class Solution {
    const int MOD = 1e9 + 7;
    int rev(const int x) {
        string s = to_string(x);
        reverse(s.begin(), s.end());
        return stoi(s);
    }
public:
    int countNicePairs(vector<int>& nums) {
        unordered_map<int, int> cnt;
        int ans = 0;
        for (int x : nums) {
            const int k = x - rev(x);
            ans = (ans + cnt[k]) % MOD;
            ++cnt[k];
        }
        return ans;
    }
};
```
时间复杂度: O(32 * N),
空间复杂度: O(N).

## 1815. Maximum Number of Groups Getting Fresh Donuts

### 比赛时AC的错误贪心版本

由于题目的数据规模比较小，`1 <= batchSize <= 9`, `1 <= groups.length <= 30`。因此，我们可以断定，本题的时间复杂度要求不高，很可能是回溯搜索类的解法。事实证明，确实如此，Discuss区给出的答案基本都是 `DFS + DP`。

比赛时，虽然我也AC了，但说实话，解法并不对。

首先，问题可以转化成，按`%batchSize`分类，因为显然，余数相等的数是一样的。
然后在对其进行分组，使得组内和等于batchSize，求最大的组数。

我写出一种贪心的算法，认为首先一个数一组，然后2个数一组，..., groups.length 个数一组。这样的分组方式是“最优的”。然后再`WA`后，我也很快意识到，并不是这样的。这种分组顺序并不对。
枚举所有分组顺序的时间复杂度是`30!`，显然不可取。而且当时时间也只剩下10分钟了。因此，我试着想对于大多数情况，少数一组还是符合直觉的。关键是测试用例中有违反的，所以我试着交换一些分组顺序，而且想，越小的数影响越大。因此，我尝试了交换2，3；再交换3，4，竟然就`AC`了。也是神奇，运气好。

```cpp
class Solution {
public:
    int maxHappyGroups(int batchSize, vector<int>& groups) {
        vector<int> cntOrigin(batchSize, 0);
        for (int x : groups) {
            ++cntOrigin[x % batchSize];
        }
        vector<int> v(groups.size());
        iota(v.begin(), v.end(), 1);
        auto tryOne = [&]() -> int {
            auto cnt = cntOrigin;
        int ans = 0;
        auto updateAns = [&](vector<int>& useCnt) -> void {
            int minOne = numeric_limits<int>::max();
            for (int i = 0; i < useCnt.size(); ++i) {
                if (useCnt[i] == 0) continue;
                minOne = min(minOne, cnt[i] / useCnt[i]);
            }
            for (int i = 0; i < useCnt.size(); ++i) {
                if (useCnt[i] == 0) continue;
                cnt[i] -= useCnt[i] * minOne;
            }
            ans += minOne;
        };
        function<void(const int, const int, vector<int>&)> backtracking = [&](const int remain, const int s, vector<int>& useCnt) -> void {
            if (remain == 0) {
                if (s % batchSize == 0) {
                    updateAns(useCnt);
                }
                return;
            } else {
                for (int i = 0; i < batchSize; ++i) {
                    if (cnt[i] == 0) continue;
                    ++useCnt[i];
                    backtracking(remain - 1, s + i, useCnt);
                    --useCnt[i];
                }
                return;
            }
        };
        
        for (int r : v) {
            // pick r elements from 0, 1, ..., batchSize - 1
            // allow duplicate
            if (accumulate(cnt.begin(), cnt.end(), 0) < r) break;
            vector<int> useCnt(batchSize, 0);
            backtracking(r, 0, useCnt);
        }
        if (accumulate(cnt.begin(), cnt.end(), 0) > 0) {
            ++ans;
        }
        return ans;
        };
        
        int ans = tryOne();
        swap(v[2],v[3]);
        ans = max(ans, tryOne());
        return ans;
    }
};
```

时间复杂度: 因为回溯有很多剪枝，我也不确定真正的时间复杂度是多少。算是枚举了所有可能的组合，一定小于O(2^(group.size() + 1))的。大概可能在O(2^9)左右。
空间复杂度: O(group.length + batchSize).

### 赛后学习的正确 DFS + DP 版本

[Discuss 中C++ 版本题解](https://leetcode.com/problems/maximum-number-of-groups-getting-fresh-donuts/discuss/1140961/C%2B%2B-Greedy-%2B-Backtracking-Video-explanation-with-and-English)
简而言之，是每次尝试使用可用的任意group（减一），在其中找最大的。

也可以去看[花花的视频讲解](https://www.bilibili.com/video/BV1CU4y187tk)，讲的还不错。

我的实现：

```cpp
struct VectorHasher {
  size_t operator()(const vector<int>& V) const {
    size_t hash = V.size();
    for (auto i : V)
      hash ^= i + 0x9e3779b9 + (hash << 6) + (hash >> 2);
    return hash;
  }
};
class Solution {
public:
    int maxHappyGroups(int batchSize, vector<int>& groups) {
        vector<int> cnt(batchSize, 0);
        for (int x : groups) {
            ++cnt[x % batchSize];
        }
        unordered_map<vector<int>, int, VectorHasher> memo;
        function<int(const int)> dfs = [&](const int s) -> int {
            auto it = memo.find(cnt);
            if (it != memo.end()) return it->second;
            int ans = 0;
            for (int i = 1; i < batchSize; ++i) {
                if (cnt[i] == 0) continue;
                --cnt[i];
                ans = max(ans, dfs((s + i) % batchSize) + (s == 0 ? 1 : 0));
                ++cnt[i];
            }
            return memo[cnt] = ans;
        };
        
        return cnt[0] + dfs(0);
    }
};
```

时间复杂度: O(cnt 个非0元素之积 * batchSize);
空间复杂度: O(cnt 个非0元素之积). (其实就是cache的空间大小).

在花花的视频里，他认为最坏的情况发生在cnt 均匀分布的时候。此时
时间复杂度: O(k * (n / k) ^ k) = 2,359,296,
空间复杂度: O((n / k) ^ k) = 262144.
其中 k = batchSize, n = groups.size().

因此，在最坏情况下也是可以AC的。

## Rejudge

LeetCode 每次比赛后并不会马上更新rating，而是要等3、4天。中间有个一查重和rejudge的过程，有些题目因为比赛时test cases 太弱。不对/超时的算法可能蒙混过关，比如我的第4题。白高兴了，rejudge后果然fail了。不过真心是我自己的算法不对，怪不得别人。
rejudge只是还一个真想，对于比赛公平其实很重要。虽然本次我是rejudge的受害者，但大多数时候，我都是受益者。我也是十分支持rejudge的。只是希望LeetCode今后可以提高比赛时题目和测试用例的质量，赛后评测和更新rating的速度更快些，别让大家等4、5天。都快下周周赛了。

更新后的成绩：

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 108 / 9082 | YoungForest | 18 | 1:37:36 | 0:03:39 |  0:09:01 |  0:14:28 | 1:27:36  2 |