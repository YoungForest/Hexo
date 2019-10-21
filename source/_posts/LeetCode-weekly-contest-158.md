---
title: LeetCode weekly  contest 158
date: 2019-10-14 10:09:33
tags:
- LeetCode
categories:
- Programming
---

## 1221. Split a String in Balanced Strings

理解balanced的定义，发现只需要找到 L 和 R 出现个数相等的位置即可。

Time complexity: O(N),
Space complexity: O(1).

```rust
impl Solution {
    pub fn balanced_string_split(s: String) -> i32 {
        let mut ans = 0;
        let mut l = 0;
        let mut r = 0;
        for c in s.chars() {
            match c {
                'L' => { l += 1},
                'R' => { r += 1},
                _ => (),
            }
            if l == r {
                ans += 1;
            }
        }
        ans
    }
}
```

## 1222. Queens That Can Attack the King

虽然理解题目稍微复杂些，但算法其实很直接，从King往外找，而不是从queue开始找。

时间复杂度: O(queens.len() + chessboard.len()),
空间复杂度: O(queens.len()).

```rust
pub fn queens_attackthe_king(queens: Vec<Vec<i32>>, king: Vec<i32>) -> Vec<Vec<i32>> {
    let mut qs: HashSet<(i32, i32)> = HashSet::new();
    for queen in queens.iter() {
        qs.insert((queen[0], queen[1]));
    }
    let mut ans: Vec<Vec<i32>> = Vec::new();
    let direction = vec![
        (0, 1),
        (1, 1),
        (1, 0),
        (1, -1),
        (0, -1),
        (-1, -1),
        (-1, 0),
        (-1, 1),
    ];
    let k = (king[0], king[1]);
    for (x, y) in direction.iter() {
        let mut target: (i32, i32) = k;
        loop {
            target.0 += x;
            target.1 += y;
            if target.0 >= 0 && target.0 < 8 && target.1 >= 0 && target.1 < 8 {
                if qs.contains(&target) {
                    ans.push(vec![target.0, target.1]);
                    break;
                }
            } else {
                break;
            }
        }
    }
    ans
}
```

## 1223. Dice Roll Simulation

```rust
use std::collections::HashMap;

impl Solution {
    const MOD_NUMBER: i32 = 1000000007;

    pub fn answer(
        mut memo: &mut HashMap<(i32, usize, i32), i32>,
        roll_max: &Vec<i32>,
        n: i32,
        previous_number: usize,
        previous_consecutive: i32,
    ) -> i32 {
        if n == 0 {
            return 1;
        }
        match memo.get(&(n, previous_number, previous_consecutive)) {
            Some(value) => {
                return *value;
            }
            None => {
                let mut ans = 0;
                for i in 0..6 {
                    if i == previous_number {
                        if previous_consecutive == roll_max[previous_number] {
                            continue;
                        } else {
                            ans = (ans
                                + Solution::answer(&mut memo, &roll_max, n - 1, i, previous_consecutive + 1))
                                % Solution::MOD_NUMBER;
                        }
                    } else {
                        ans = (ans + Solution::answer(&mut memo, &roll_max, n - 1, i, 1)) % Solution::MOD_NUMBER;
                    }
                }
                memo.insert((n, previous_number, previous_consecutive), ans);
                return ans;
            }
        }
    }
    pub fn die_simulator(n: i32, roll_max: Vec<i32>) -> i32 {
        let mut memo: HashMap<(i32, usize, i32), i32> = HashMap::new();
        Solution::answer(&mut memo, &roll_max, n, 0, 0)
    }
}
```

## 1224. Maximum Equal Frequency

