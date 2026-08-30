---
title: LeetCode weekly contest 257
date: 2021-09-06 23:15:10
description: 四道题枚举顺序四元组、排序统计弱角色、动态规划走遍房间，并按质因数连接并查集完成最大公约数排序。
tags:
- Competitive Programming
categories:
- LeetCode
translations:
  zh-CN: https://youngforest.github.io/2021/09/06/LeetCode-weekly-contest-257/
  en: https://youngforest.github.io/en/2021/09/06/LeetCode-weekly-contest-257/
---
| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 222 / 12542 | YoungForest | 18 | 1:32:31 | 0:06:21  🐞1 | 0:12:18 |  0:24:28 | 1:17:31  🐞2 |

久违的不用打卡了。之前打了3周卡，实在是遭不住了呀。工作之后，花在刷题上的精力和时间都少了很多。很多卡都是让npy打的，或者干脆抄一份。一份付出一份回报。学如逆水行舟，不进则退。我周赛成绩下降确实是自己实力下降了。虽然我并不打算改变，并且慢慢接受了这个事实。但是我会坚持打周赛和呆在残酷群里，保持基本的做题手感即可，不需要对自己有太高要求。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/LeetCode-weekly-contest-257/zh-hero.webp" alt="四道顺序闸门挑选珠子，攻防盾牌排序识别弱者，房间走廊折返后前进，质因数齿轮把排序石块连成集合" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

最近除了工作，花了很多时间在投资理财上。

一方面学习相关知识。比如 关注了 喜欢玩基金的小瑜哥 的B站和微信公众号，还有 **认真的天马** 的B站和微信公众号。
关注了有大半年时间了。小瑜哥妥妥的韭菜一枚，关注他有3点原因：他每日更新复盘视频，十分坚持和勤劳；视频内容很开心（准确地说，看他亏钱很开心），可以当作娱乐区UP看；他犯了很多韭菜的误区和大忌，我们可以从他的失败中学习教训，而不需要自己去失败。
天马 是妥妥的知识型和保守型UP主，比较符合我的需求和观点。他微信公众号也是日更，每天早上8点准时更新。更新文章末尾有估值表，通过其可以买低估、卖高估。他的文章和视频也是以干货为主，值得反复学习和观看。
同时关注了 YouTube 的 “NaNa说美股“。主要讲的都是美股大盘的变动。我之前买过200元 纳指100 和 标普500. 涨了一些就卖了。错过了后面的行情。美股确实是长牛，和 A股没法比。现在虽然继续涨，但已经历史新高了，我也不敢再买了。
同时阅读投资书籍。之前读了[《小狗钱钱》](https://book.douban.com/subject/3576486/)，最近读完了[《小乌龟的投资智慧》](https://book.douban.com/subject/26948036/)和[《股票大作手回忆录》](https://book.douban.com/subject/5382213/)。我在[豆瓣](https://www.douban.com/people/141835199/)均写简短的书评。
其中《小乌龟》是我觉得最有用的一本书，尤其是对于长期（10年以上）的投资。打算以后准备退休钱的时候按照其投资。现在因为要准备买房出国的事儿，暂时还没有足够的长期资金。短期基本都要用。

另一方面进行实践。把自己的资产分为4个部分 灵活取用（现金，货币基金）、保守的债卷基金 和 固收（定期）、偏风险的股票基金（以宽基指数 和 行业指数 为主）。
半年前写过一个[自己的投资故事](https://youngforest.github.io/2021/03/22/investment/)，现在，我可以大胆的说我的知识和经验更加丰富和专业了。虽然并没有收益多少，但工作之后随着本金的增加，投资理财变得更加重要了。
现在我总的股票仓位较低，大概不到 1/3，以其他3种保守投资为主。

## 1995. Count Special Quadruplets

签到题。暴力枚举即可。不过因为着急，没仔细看题，忽略了index 递增的要求，擅自加了排序，导致WA一发。

```python
class Solution:
    def countQuadruplets(self, nums: List[int]) -> int:
        seen = set()
        n = len(nums)
        # print(nums)
        for i in range(n):
            for j in range(i + 1, n):
                for k in range(j + 1, n):
                    for l in range(k + 1, n):
                        if nums[i] + nums[j] + nums[k] == nums[l]:
                            # print((i, j, k, l))
                            seen.add((i, j, k, l))
        return len(seen)
```

时间复杂度: O(n^4),
空间复杂度: O(n)。

## 1996. The Number of Weak Characters in the Game

做这题的时候，我就觉的它有些像[354. Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)。
先排序，按照一维递减，另一维递增的方式。
然后遍历，因为前面的都保证第一维大于等于当前了，只需要看前面第二维最大的就可以了。这也是为什么第二维排序要递增的原因，在第一维相等的时候，第二位大的要排后面，才不会影响遍历时的比较过程。

```cpp
class Solution {
public:
    int numberOfWeakCharacters(vector<vector<int>>& p) {
        sort(p.begin(), p.end(), [](const auto& lhs, const auto& rhs) -> bool {
            if (lhs[0] != rhs[0]) {
                return lhs[0] > rhs[0];
            } else {
                return lhs[1] < rhs[1];
            }
        });
        int ans = 0;
        int maxDefense = 0;
        for (const auto& c : p) {
            if (maxDefense > c[1]) {
                ++ans;
            }
            maxDefense = max(maxDefense, c[1]);
        }
        return ans;
    }
};
```

时间复杂度: O(nlogn),
空间复杂度: O(log n).

## 1997. First Day Where You Have Been in All the Rooms

本题幸运的发现了问题的本质，很快并且代码行数很少地解决了问题。
否则最后一题可能没时间Debug了。

注意到`0 <= nextVisit[i] <= i`，因此奇数次的时候必然是要往回走/呆在原地。
偶数次只能向前走一步。意味着当我们第一次（其实可以扩展到奇数次）走到位置`i`时，之前的所有格子都必然走过偶数次。
因此状态转移方程是：
`dp(i) = dp(i - 1) + 1 + (dp(i - 1) - dp(nextVisit[i-1])) + 1`,
即 第一次走到前一个位置，走一步，退回到nextVisit[i-1]，再次走到前一个位置，再多走一步到当前位置。

```python
class Solution:
    def firstDayBeenInAllRooms(self, nextVisit: List[int]) -> int:
        MOD = 10**9 + 7
        @cache
        def dp(i):
            if i == 0: return 0
            return (dp(i-1) * 2 + 2 - dp(nextVisit[i-1])) % MOD
        n = len(nextVisit)
        return dp(n-1)
```

时间复杂度: O(N),
空间复杂度: O(N).

## 1998. GCD Sort of an Array

观察交换规则，可以发现交换的位置其实是一个并查集，2个元素可以通过第3个元素互换。
问题转换成，原始位置要换到排序后的位置，需要经过一系列元素的交换，这些元素必须在同一个集（component）里。
在同一个集的充分必要条件是 gcd 大于 1。

因此，一个直接的想法（但是显然会TLE）是：
1. 两两算gcd, 更新union-find；
2. 排序原始数组，找到对应的排序后的位置；
3. 根据dfs原则，判断哪些元素必须在同一集，然后用之前算好的union-find去验证。

时间复杂度为: O(N^2 + N log N + N).

复杂度瓶颈在第一步的计算union-find这里。我们尝试优化它。
观察数据规模：`2 <= nums[i] <= 10^5`，意味着我们可以计算每个元素的因子，然后把相同因子的元素通过因子unite起来。这里有个坑，我们不仅需要连接小因子，还需要把相应的大因子连接起来。可以把并查集的数组扩大，扩大后的位置用来表示因子，用一个+n偏移表示。
时间复杂度降为 O(N * sqrt(num)), 这里大概是`10^7`, 其实还是可能会超时的。这也是我本题7次罚时的原因，在TLE的边缘疯狂试探。
残酷群友提示：第四题和952. Largest Component Size by Common Factor 很像，要按因数去优化，不然会tle到死。不过我通过把局部数组移到类变量，这种常数优化AC了。
不过这种按因数优化的方式还是很值得学习的，可以把获得因数的复杂度从O(sqrt(num))降为O(log num)：https://leetcode.com/problems/gcd-sort-of-an-array/discuss/1445180/C%2B%2BPython-Union-Find-and-Sieve-and-Sorting-Clean-and-Concise

```cpp
class Solution {
    class UF {
public:
    vector<int> sz;
    int n;
    int comp_cnt;
    vector<int> fa;
public:
    UF(int _n): n(_n), comp_cnt(_n), fa(_n), sz(_n, 1) {
        iota(fa.begin(), fa.end(), 0);
    }
    
    int findset(int x) {
        return fa[x] == x ? x : fa[x] = findset(fa[x]);
    }
    
    void unite(int x, int y) {
        x = findset(x);
        y = findset(y);
        if (x != y) {
            if (sz[x] < sz[y]) {
                swap(x, y);
            }
            fa[y] = x;
            sz[x] += sz[y];
            --comp_cnt;
        }
    }
    
    bool connected(int x, int y) {
        x = findset(x);
        y = findset(y);
        return x == y;
    }
};
    using pii = pair<int, int>;
    array<pii, 50000> index;
    array<int, 50000> reverseIndex;
    array<bool, 50000> visited;

public:
    bool gcdSort(vector<int>& nums) {
        // time: n log n + n ^ 2
        // (10**5)**0.5
        // = 316.22776601683796
        const int n = nums.size();
        for (int i = 0; i < n; ++i) {
            index[i] = {nums[i], i};
        }
        sort(index.begin(), index.begin() + n);
        for (int i = 0; i < n; ++i) {
            reverseIndex[index[i].second] = i;
        }
        const int maxX = *max_element(nums.begin(), nums.end());
        UF uf(n + maxX + 10);
        for (int a = 0; a < n; ++a) {
            uf.unite(a, n + nums[a]);
            for (int b = 2; b * b <= nums[a]; ++b) {
                if (nums[a] % b == 0) {
                    uf.unite(a, n + b);
                    // 有可能是倍数
                    if ((nums[a] / b) > 1) uf.unite(a, n + (nums[a] / b)); 
                }
            }
        }
        // N ^ 2, TLE
        // for (int a = 0; a < n; ++a) {
        //     for (int b = a + 1; b < n; ++b) {
        //         if (gcd(nums[a], nums[b]) > 1) {
        //             uf.unite(a, b);
        //         }
        //     }
        // }
        for (int i = 0; i < n; ++i) {
            visited[i] = false;
        }
        for (int i = 0; i < n; ++i) {
            if (!visited[i]) {
                vector<int> group;
                while (!visited[i]) {
                    visited[i] = true;
                    group.push_back(i);
                    i = reverseIndex[i];
                }
                const int root = uf.findset(group[0]);
                for (int i = 1; i < group.size(); ++i) {
                    if (root != uf.findset(group[i])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
};
```

时间复杂度: O(N * sqrt(N) + N log N),
空间复杂度: O(N + max(nums[i])).
