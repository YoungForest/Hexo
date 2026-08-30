---
title: LeetCode weekly contest 215
date: 2020-11-15 16:59:45
description: 周赛复盘：实现有序流、比较字符与频次集合、把两端减法转为保留最长中段；第四题未完成。
tags:
- Competitive Programming
categories:
- LeetCode
translations:
  zh-CN: https://youngforest.github.io/2020/11/15/LeetCode-weekly-contest-215/
  en: https://youngforest.github.io/en/2020/11/15/LeetCode-weekly-contest-215/
---
<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/LeetCode-weekly-contest-215/zh-hero.webp" alt="有序包裹等待指针放行，两组彩珠交换位置后保持同样频次，从两端取石留下最长中段，最后的网格城仍锁在柜中" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 362 / 9683 | YoungForest | 12 | 0:35:02 | 0:04:21 | 0:13:42 | 0:30:02  1 | null |

## 5601. Design an Ordered Stream

签到题。按照题目要求，用一个数组和指针实现接口。

```cpp
class OrderedStream {
    vector<string> data;
    int ptr;
    int n;
public:
    OrderedStream(int _n) {
        data.resize(_n);
        ptr = 1;
        n = _n;
    }
    
    vector<string> insert(int id, string value) {
        data[id-1] = move(value);
        vector<string> ans;
        while (ptr <= n && !data[ptr-1].empty()) {
            ans.push_back(data[ptr-1]);
            ++ptr;
        }
        return ans;
    }
};

/**
 * Your OrderedStream object will be instantiated and called as such:
 * OrderedStream* obj = new OrderedStream(n);
 * vector<string> param_1 = obj->insert(id,value);
 */
 ```

时间复杂度: O(n),
空间复杂度: O(n).

## 5603. Determine if Two Strings Are Close

观察2个字符串接近的操作，发现其充分必要条件为：
组成字符相同，字符的个数排列相同。

```cpp
class Solution {
    vector<int> cnt(const string &a) {
        vector<int> ans(26, 0);
        for (char c : a) {
            ++ans[c - 'a'];
        }
        return ans;
    }
    string appear(const vector<int>& a) {
        string ans;
        for (int i = 0; i < 26; ++i) {
            if (a[i] != 0) ans.push_back('a' + i);
        }
        return ans;
    }
    vector<int> frequency(const vector<int>& a) {
        vector<int> ans;
        for (int i = 0; i < 26; ++i) {
            if (a[i] != 0) ans.push_back(a[i]);
        }
        sort(ans.begin(), ans.end());
        return ans;
    }
public:
    bool closeStrings(string word1, string word2) {
        if (word1.size() != word2.size()) return false;
        auto cnt1 = cnt(word1);
        auto cnt2 = cnt(word2);
        return appear(cnt1) == appear(cnt2) && frequency(cnt1) == frequency(cnt2);
    }
};
```

时间复杂度: O(N),
空间复杂度: O(1).

## 5602. Minimum Operations to Reduce X to Zero

观察：
1. 取头和取尾操作，其实是和顺序无关的，只和头尾各多少有关。
2. 头尾相加为x，可以转换成中间剩特定的值，找到最长的中间。

所以我们枚举每个中间的尾部即可。

```cpp
class Solution {
public:
    int minOperations(vector<int>& nums, int x) {
        const int n = nums.size();
        unordered_map<int, int> presum;
        presum[0] = -1;
        int s = 0;
        int maxJSubI = -1;
        int total = accumulate(nums.begin(), nums.end(), 0);
        int i = 0;
        for (; i < n; ++i) {
            s += nums[i];
            
            if (presum.find(s) == presum.end())  {
                presum[s] = i;
            }
            auto it = presum.find(s - (total - x));
            // cout << i << " " << s - (total - x) << endl;;
            if (it != presum.end()) {
                const int current = i - it->second;
                // cout << it->second << endl;
                maxJSubI = max(maxJSubI, current);
            }
        }
        if (maxJSubI == -1) return -1;
        else return n - maxJSubI;
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

## 5604. Maximize Grid Happiness

轮廓线DP。
