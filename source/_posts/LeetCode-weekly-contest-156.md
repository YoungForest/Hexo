---
title: LeetCode weekly contest 156
date: 2019-10-04 12:41:57
tags:
- LeetCode
categories:
- Programming
---

赛后补题。

## 1207. Unique Number of Occurrences

Record the number of occurrences of each value by `unordered_map`.
Check the unique using `unordered_set`.

Time complexity: O(N),
Space complexity: O(N).

```cpp
class Solution {
public:
    bool uniqueOccurrences(vector<int>& arr) {
        unordered_set<int> count;
        unordered_map<int, int> seen;
        for (int i : arr) {
            ++seen[i];
        }
        for (const auto& p : seen) {
            if (count.find(p.second) != count.end()) {
                return false;
            } else {
                count.insert(p.second);
            }
        }
        return true;
    }
};
```

## 1208. Get Equal Substrings Within Budget

Sliding window.
Use a sliding window to represent the available substring.

Time complexity: O(N),
space complexity: O(1).

```cpp
class Solution {
public:
    int equalSubstring(string s, string t, const int maxCost) {
        int left = 0, right = 0;
        // window: [left, right), length = right - left
        int cost = 0;
        int ans = 0;
        while (left < s.size()) {
            while (right < s.size() && cost + std::abs(s[right] - t[right]) <= maxCost) {
                cost += std::abs(s[right] - t[right]);
                ++right;
                ans = max(ans, right - left);
            }
            cost -= std::abs(s[left] - t[left]);
            ++left;
        }
        return ans;
    }
};
```

## 1209. Remove All Adjacent Duplicates in String II

One pass scan  and remove duplicates.

```cpp
class Solution {
public:
    string removeDuplicates(string s, int k) {
        string ans;
        vector<int> accu; // accumulate
        for (char c : s) {
            int new_accu;
            if (!ans.empty() && c == ans.back()) {
                new_accu = accu.back() + 1;
            } else {
                new_accu = 1;
            }
            if (new_accu >= k) {
                for (int i = 0; i < new_accu - 1; ++i) {
                    ans.pop_back();
                    accu.pop_back();
                }
            } else {
                ans.push_back(c);
                accu.push_back(new_accu);
            }
        }
        return ans;
    }
};
```

## 1210. Minimum Moves to Reach Target with Rotations

最小步数，而且n的大小在100以内，所以 可以用BFS解决。
本题的思路并不难，难点在于实现。由于不是直接的 BFS，实现 过程中 有 很多需要注意的点。

时间复杂度: O(N ^ 2),
空间复杂度: O(N ^ 2).

因为最近尝鲜学习了Rust这门新兴的语言，所以接下来的一些题目都会用rust而不是C++。目的是可以让自己有机会练习和熟悉这门新的语言。有时间和心情的同学也可以学一下这门新语言，如果之前的主语言是C++的话，学RUST真的很痛快。

```rust
use std::collections::HashSet;
use std::collections::VecDeque;

impl Solution {
    pub fn minimum_moves(grid: Vec<Vec<i32>>) -> i32 {
        // bfs
        let n = grid.len() as i32;
        assert_eq!(n >= 2, true);
        let m = grid[0].len() as i32;
        assert_eq!(n, m);
        let mut q = VecDeque::new();
        let mut seen = HashSet::new();
        let mut level = 1;
        q.push_back(((0, 0), (0, 1)));
        seen.insert(((0, 0), (0, 1)));
        while !q.is_empty() {
            let size = q.len();
            for _ in 0..size {
                let current = q.pop_front();
                match current {
                    Some(value) => {
                        let next_step: [((i32, i32), (i32, i32)); 4] = [
                            ((0, 1), (0, 1)),
                            ((1, 0), (1, 0)),
                            ((0, 0), (1, -1)),
                            ((0, 0), (-1, 1)),
                        ];
                        for i in 0..4 {
                            let m = next_step[i];
                            let new_tail = (value.0 .0 + m.0 .0, value.0 .1 + m.0 .1);
                            let new_head = (value.1 .0 + m.1 .0, value.1 .1 + m.1 .1);
                            if new_tail.0 < n
                                && new_tail.1 < n
                                && new_head.0 < n
                                && new_head.1 < n
                                && new_tail.0 >= 0
                                && new_tail.1 >= 0
                                && new_head.0 >= 0
                                && new_head.1 >= 0
                                && grid[new_tail.0 as usize][new_tail.1 as usize] == 0
                                && grid[new_head.0 as usize][new_head.1 as usize] == 0
                                && !seen.contains(&(new_tail, new_head))
                            {
                                if i == 0
                                    || i == 1
                                    || (value.0 .0 + 1 >= 0 // old_tail + 1 is in range
                                        && value.0 .0 + 1 < n
                                        && value.0 .1 + 1 >= 0
                                        && value.0 .1 + 1 < n
                                        && grid[(value.0 .0 + 1) as usize]  // old_tail + 1 is unblock
                                            [(value.0 .1 + 1) as usize]
                                            == 0
                                        && ((i == 2 && value.0 .0 == value.1 .0)
                                            || (i == 3 && value.0 .1 == value.1 .1)))
                                {
                                    if new_tail == (n - 1, n - 2) && new_head == (n - 1, n - 1) {
                                        return level;
                                    }
                                    q.push_back((new_tail, new_head));
                                    seen.insert((new_tail, new_head));
                                }
                            }
                        }
                    }
                    None => (),
                };
            }
            level += 1;
        }
        return -1;
    }
}
```