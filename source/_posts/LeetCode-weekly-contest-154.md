---
title: LeetCode weekly contest 154
date: 2019-09-18 10:08:36
tags:
- Competitive Programming
categories:
- LeetCode
---

上周末在比利时，比赛时间是凌晨的4点半到6点，时间不合适，所以就没有参加。发现只有双周赛的时间是周六的下午4点半到6点，稍微合适些。ranking 2000的目标今年怕是要鸽了。最好的情况下，参与比赛的数目也只有国内的1/3.

## 1189. Maximum Number of Balloons

统计每个字母的频数即可。需要注意的是，l和o 需要2次才能组成一个ballon。

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
public:
    int maxNumberOfBalloons(string text) {
        const string once = "ban";
        const string twice = "lo";
        vector<int> count(26, 0);
        for (char c : text) {
            ++count[c - 'a'];
        }
        int ans = numeric_limits<int>::max();
        for (char c : once) {
            ans = min(ans, count[c - 'a']);
        }
        for (char c : twice) {
            ans = min(ans, count[c - 'a'] / 2);
        }
        return ans;
    }
};
```

## 1190. Reverse Substrings Between Each Pair of Parentheses

因为字符串的最大长度为2000，使用暴力法即可。用一个栈来进行括号匹配。

时间复杂度: O(N ^ 2),
空间负责度: O(N).

```cpp
class Solution {
public:
    string reverseParentheses(string s) {
        stack<int> st;
        for (int i = 0; i < s.size(); ++i) {
            auto& c = s[i];
            if (c == ')') {
                int begin = st.top();
                st.pop();
                reverse(s.begin() + begin, s.begin() + i);
            } else if (c == '(') {
                st.push(i);
            }
        }
        string ans;
        for (char c : s) {
            if (c != ')' && c != '(') {
                ans.push_back(c);
            }
        }
        return ans;
    }
};
```

看过discuss之后，发现时间复杂度为O(N)的Solution。
第一遍找到所有匹配的括号，第二遍构造结果字符串。每一个括号像一道传送门一样，改变前进方向的同时，跳到对应的括号那里。

```cpp
string reverseParentheses(string s) {
    int n = s.length();
    vector<int> opened, pair(n);
    for (int i = 0; i < n; ++i) {
        if (s[i] == '(')
            opened.push_back(i);
        if (s[i] == ')') {
            int j = opened.back();
            opened.pop_back();
            pair[i] = j;
            pair[j] = i;
        }
    }
    string res;
    for (int i = 0, d = 1; i < n; i += d) {
        if (s[i] == '(' || s[i] == ')')
            i = pair[i], d = -d;
        else
            res += s[i];
    }
    return res;
}
```

## 1191. K-Concatenation Maximum Sum

子数组最大和问题。该题目的特殊之处在于数组可以重复k次。
仔细观察可以发现，当整个数组的和小于等于0时,根据贪心的思路，最后答案必定是数组重复2次组成的答案，即 本身的子数组，或 最大的前缀和 + 最大的后缀和。
当整个数组的和大于0时，答案为k-2个数组和 + 最大的前缀和 + 最大的后缀和

时间复杂度: O(N),
空间复杂度: O(1).

```cpp
class Solution {
    using ll = long long;
    const ll mod = 1e9 + 7;
public:
    int kConcatenationMaxSum(vector<int>& arr, int k) {
        ll head = 0, tail = 0;
        ll global_max = 0, local_max = 0;
        ll prefix = 0, total_sum = 0;
        for (ll i = 0; i < arr.size(); ++i) {
            if (arr[i] + prefix < 0) {
                prefix = 0;
            } else {
                prefix = arr[i] + prefix;
                local_max = max(local_max, prefix);
            }
            total_sum += arr[i];
            head = max(head, total_sum);
            tail = min(tail, total_sum);
        }
        tail = total_sum - tail;
        tail = prefix;
        if (total_sum > 0) {
            global_max = tail + head + total_sum * (k - 2);
        } else {
            global_max = head + tail;
        }
        
        global_max = max(global_max, local_max);
        return global_max % mod;
    }
};
```

## 1192. Critical Connections in a Network


