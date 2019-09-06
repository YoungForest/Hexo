---
title: LeetCode 134 Gas Station
date: 2019-09-06 16:56:01
tags:
- Algorithm
categories:
- LeetCode
---

[题目描述](https://leetcode.com/problems/gas-station/description/)

本题是我2月份Google实习生电话面试遇到的一道题目。我当时做的很混乱，一面直接挂了。今天看到[同学发的讲解](https://zhuanlan.zhihu.com/p/81412559)，决定重新尝试一下这道题目。毕竟自己这半年来刷了有500+道题目，算法实力有一定的增长。我只看到了讲解的题目，并没有看内容，算是自己半年后可以独立解决这个问题了吧。AC后，我竟然都哭了，为当时实力不济而伤心。不知道之后还有那么好的机会吗？
这半年也参加了3次Kick start，除了第一次的A轮收到简历通知外，D轮和E轮都挂了。
就像我之前反复讲的，我很想去Google，微软这样的外企，自己也为之付出了半年的努力。希望努力会有回报吧！如果可以拿到明年暑期的Google或微软的暑期实习，我就奖励自己一次端午节假期去韩国的自由行。有青梅竹马在那里，可以去找她。

本题的思路是这样的:

首先暴力的O(N^2)解法很简单.
枚举所有的起点，从起点出发模拟循环的过程。
可以用2个前缀和数组gas_prefix和cost_prefix追踪油量和花费，保证油量永远大于等于花费。

然后尝试进一步的优化，思考不同起点之间的信息是否可以互相利用。
观察有, 如果在第i个加油站油量小于花费了，则从起点到i（包含）的加油站都不必作为起点尝试了。因为如果`起点 < j <= i`，则`j`作为起点，到`i`时的gas_prefix = 旧起点的gas_prefix - 旧起点到j的gas_prefix, 同理cost_prefix = 旧起点的cost_prefix- 旧起点到j的cost_prefix. 因为旧起点到j是成功的，所以有`旧起点到j的gas_prefix >= 旧起点到j的cost_prefix`, 所以gas_prefix还是小于 cost_prefix。j就不用尝试了，可以直接跳过。
所以我们有了在O(N)的复杂度下的解法，起点直接跳到失败节点之后。

同学的解法是通过反证法证明这一优化正确性的，也是很好的方法。

```cpp
class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        const int n = gas.size();
        vector<int> gas_prefix(n);
        vector<int> cost_prefix(n);
        for (int begin_index = 0; begin_index < n; ) {
            int i = 0;
            for (; i < n; ++i) {
                if (i == 0) {
                    gas_prefix[i] = gas[(begin_index + i) % n];
                    cost_prefix[i] = cost[(begin_index + i) % n];
                } else {
                    gas_prefix[i] = gas_prefix[i - 1] + gas[(begin_index + i) % n];
                    cost_prefix[i] = cost_prefix[i - 1] + cost[(begin_index + i) % n];
                }
                if (gas_prefix[i] < cost_prefix[i]) {
                    begin_index += i + 1;
                    break;
                }
            }
            if (i == n) {
                return begin_index;
            }
        }
        return -1;
    }
};
```