---
title: LeetCode 周赛 264
date: 2021-10-24 17:20:15
tags:
- Competitive Programming
categories:
- LeetCode
description: LeetCode 周赛 264 复盘：全球前 500 完赛，涵盖单词校验、数位平衡、树节点得分与课程拓扑调度。
translations:
  zh-CN: https://youngforest.github.io/2021/10/24/LeetCode-weekly-contest-264/
  en: https://youngforest.github.io/en/2021/10/24/LeetCode-weekly-contest-264/
---

<figure class="editorial-illustration editorial-illustration--hero"><img src="/images/ai/LeetCode-weekly-contest-264/zh-hero.webp" width="1536" height="864" alt="Forest 穿过六周训练闸门，依次校准单词筛、平衡珠、节点树和课程轨道四座装置" decoding="async" fetchpriority="high"></figure>

| 排名 | 用户名 | 得分 | 完成时间 | Q1 (3) | Q2 (4) | Q3 (5) | Q4 (6) |
|--|--|--|--|--|--|--|--|
| 323 / 12700 | YoungForest | 18 | 1:00:46 | 0:11:32 🐞1 | 0:27:23 | 0:42:54 🐞1 | 0:50:46 |

经过六周残酷群每日一题的痛苦打卡，我终于从每天都要做题的要求中解脱了。解脱条件是在周赛中进入全球前 500，并完成全部四道题。恭喜自己。

<!-- more -->

## 2047. 句子中的有效单词数

签到题。

这次比平时更难一些，需要仔细处理边界情况。例如，单独的 `-` 不是有效单词。

```python
class Solution:
    def countValidWords(self, sentence: str) -> int:
        def isPunctuation(c):
            return c == '!' or c == '.' or c == ','
        def isLower(c):
            return ord(c) >= ord('a') and ord(c) <= ord('z')
        def check(word):
            # It only contains lowercase letters, hyphens, and/or punctuation (no digits).
            # There is at most one hyphen '-'. If present, it should be surrounded by lowercase characters ("a-b" is valid, but "-ab" and "ab-" are not valid).
            # There is at most one punctuation mark. If present, it should be at the end of the token.
            hyphenCount = 0
            punctuationCount = 0
            for c in word:
                if c == '-':
                    hyphenCount += 1
                if c.isdigit():
                    return False
                if isPunctuation(c):
                    punctuationCount += 1
            if hyphenCount > 1 or punctuationCount > 1: return False
            if punctuationCount == 1 and not isPunctuation(word[-1]): return False
            if hyphenCount == 1:
                l = word.split('-')
                if len(l) != 2: return False
                if not (len(l[0]) >= 1 and isLower(l[0][-1])) or not (len(l[1]) >= 1 and isLower(l[1][0])): return False
            return True
        ans = 0
        words = sentence.split()
        for word in words:
            # print (word)
            if check(word):
                # print('Yes')
                ans += 1
        return ans
```

时间复杂度：O(N)。

空间复杂度：O(N)。

使用 `re`，也就是正则表达式，可以得到更简单的解法。

```python
import re

class Solution:
    def countValidWords(self, sentence: str) -> int:
        pattern = re.compile('(^[a-z]+(-[a-z]+)?)?[,.!]?$')
        word_count = 0
        for word in sentence.split():
            if pattern.match(word):
                word_count = word_count + 1

        return word_count
```

时间复杂度：O(N)。

空间复杂度：O(N)。

## 2048. 下一个更大的数值平衡数

很多人通过暴力枚举得到了 Accepted：遍历每个大于 n 的数，检查它是否为数值平衡数。

我在比赛中提出了更好的解法。因为 `0 <= n <= 10^6`，可以手动枚举所有数值平衡数，再找到下一个更大的数。可能的平衡数数量是有限的。这里的一个技巧是使用 `permutations` 遍历字符串的所有排列。

```python
class Solution:
    def nextBeautifulNumber(self, n: int) -> int:
        # 1digit: 1
        # 2digit: 22
        # 3digit: 333 or 1+2
        # 4digit: 1+3 or 4
        # 5digit: 5 or 1+4 or 2+3
        # 6digit: 6 or 1+5 or 2+4 or 1+2+3
        # 7digit: 7 or 1+6 or 1+2+4 1224444
        if n == 10**6: return 1224444
        ans = 1224444
        s = str(n)
        # 6! 720
        def check(l):
            ans = float('inf')
            origin = ''
            for i in l:
                origin += str(i) * i
            perms = [''.join(p) for p in permutations(origin)]
            for s in perms:
                i = int(s)
                if i > n:
                    ans = min(ans, i)
            return ans

        ans = min(ans, check([6]))
        ans = min(ans, check([1, 5]))
        ans = min(ans, check([2, 4]))
        ans = min(ans, check([1, 2, 3]))
        ans = min(ans, check([5]))
        ans = min(ans, check([1, 4]))
        ans = min(ans, check([2, 3]))
        ans = min(ans, check([4]))
        ans = min(ans, check([1, 3]))
        ans = min(ans, check([3]))
        ans = min(ans, check([1, 2]))
        ans = min(ans, check([2]))
        ans = min(ans, check([1]))
        return ans
```

时间复杂度：O(13 * 6!)。

空间复杂度：O(6!)。

## 2049. 统计最高分的节点数目

1. 可以用 `DFS` 计算每棵子树的大小。
2. 计算每个节点的得分。删除一个节点时有三种可能状态：两个子节点、一个子节点、没有子节点。根节点是一个边界情况，因为它没有父节点。
3. 找出最高得分及其出现次数。

一个需要注意的边界情况是乘积可能溢出 `int`。最大可能达到 `10^5 * 10^5`，使用 `long long` 可以轻松避免这个运行时错误。

```cpp
template <typename T>
ostream& operator <<(ostream& out, const vector<T>& a) {
  out << "["; bool first = true;
  for (auto& v : a) { out << (first ? "" : ", "); out << v; first = 0;} out << "]";
  return out;
}
using ll = long long;
class Solution {
public:
    int countHighestScoreNodes(vector<int>& parents) {
        const int n = parents.size();
        vector<vector<int>> children(n);
        for (int i = 1; i < n; ++i) {
            const int parent = parents[i];
            children[parent].push_back(i);
        }
        const int root = 0;
        vector<vector<ll>> subtreeSize(n);
        function<ll(const int)> dfs = [&](const int root) -> ll {
            ll ans = 1;
            for (int child : children[root]) {
                const ll childSize = dfs(child);
                subtreeSize[root].push_back(childSize);
                ans += childSize;
            }
            return ans;
        };
        const ll totalSize = dfs(0);
        vector<ll> scores(n);
        for (int i = 0; i < n; ++i) {
            if (children[i].size() == 0) {
                scores[i] = totalSize - 1;
            } else if (children[i].size() == 1) {
                if (totalSize - 1 == subtreeSize[i][0]) {
                    scores[i] = subtreeSize[i][0];
                } else {
                    scores[i] = subtreeSize[i][0] * (totalSize - 1 - subtreeSize[i][0]);
                }
            } else {
                if (totalSize - 1 - subtreeSize[i][0] - subtreeSize[i][1] == 0) {
                    scores[i] = subtreeSize[i][0] * subtreeSize[i][1];
                } else {
                    scores[i] = subtreeSize[i][0] * subtreeSize[i][1] * (totalSize - 1 - subtreeSize[i][0] - subtreeSize[i][1]);
                }
            }
        }
        // cout << scores << endl;
        const ll highestScore = *max_element(scores.begin(), scores.end());
        return count(scores.begin(), scores.end(), highestScore);
    }
};
```

时间复杂度：O(n)。

空间复杂度：O(n)。

## 2050. 并行课程 III

典型的拓扑排序。

使用 `priority_queue`，可以按照时间递增顺序遍历每门课程的结束事件。

```cpp
class Solution {
public:
    int minimumTime(int n, vector<vector<int>>& relations, vector<int>& time) {
        vector<int> indegree(n, 0);
        vector<vector<int>> out(n);
        for (const auto& r : relations) {
            const int p = r[0] - 1;
            const int n = r[1] - 1;
            indegree[n]++;
            out[p].push_back(n);
        }
        using pii = pair<int, int>; // end time, course number
        priority_queue<pii, vector<pii>, greater<>> events;
        for (int i = 0; i < n; ++i) {
            if (indegree[i] == 0) {
                events.push({time[i], i});
            }
        }
        int ans = 0;
        while (!events.empty()) {
            auto [currentTime, courseNumber] = events.top();
            ans = currentTime;
            events.pop();
            for (int to : out[courseNumber]) {
                indegree[to]--;
                if (indegree[to] == 0) {
                    events.push({currentTime + time[to], to});
                }
            }
        }
        return ans;
    }
};
```

时间复杂度：O(N * logN)。

空间复杂度：O(N)。
