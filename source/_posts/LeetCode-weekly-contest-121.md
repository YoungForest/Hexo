---
title: LeetCode weekly contest 121
date: 2019-01-27 16:05:48
tags:
- LeetCode
categories:
---

今天放假回家，下午3点半的火车。不过我还是百忙之中抽出时间参加了每周例行的weekly contest。 结果因为回家不够专注，效果很差，只做出一道签到题。第二题TLE(结果把一个变量改成引用就可以了，也算是吸取了教训，能用引用就用引用)，第3题没有足够的时间完成了(直到下午坐上火车，心无旁骛地终于独立完成了第三题。其实思路从一开始就是对的，只不过没有时间调试细节)。第四题干脆连题干都没有时间看完。

## 984. String Without AAA or BBB

Intution: 由于不能出现连续的a或b，我们可以试着直接构造出符合要求的字符串。多的字符出现2次，即插入一个少的字符，当剩余的2个字符一样多的时候，就一个出现一次就可以了。

```cpp
class Solution {
public:
    string strWithout3a3b(int A, int B) {
        string result;
        char large, small;
        int bigger, smaller;
        if (A > B) {
            large = 'a';
            small = 'b';
            bigger = A;
            smaller = B;
        } else {
            large = 'b';
            small = 'a';
            bigger = B;
            smaller = A;
        }
        for (; bigger > 0 && smaller > 0 && bigger > smaller; bigger-=2, smaller--) {
            result.push_back(large);
            result.push_back(large);
            result.push_back(small);
        }
        for (; bigger > 0 && smaller > 0; bigger--, smaller--) {
            result.push_back(large);
            result.push_back(small);
        }
        while (bigger > 0) {
            result.push_back(large);
            bigger--;
        }
        while (smaller > 0) {
            result.push_back(small);
            small--;
        }
        
        return result;
    }
};
```

## 981. Time Based Key-Value Store

Intution:
使用hashmap存储<key, vector<pair<int, string>> value>,
每次查找到key对应的vector后，针对pair的第一个值使用二分查找upper_bound timestamp.

注意：用引用，千万不要用普通变量存储hashmap[key]。

```cpp
class TimeMap {
private:
    /** Intution:
        使用hashmap存储<key, vector<pair<int, string>> value>,
        每次查找到key对应的vector后，针对pair的第一个值使用二分查找upper_bound timestamp
    */
    unordered_map<string, vector<pair<int, string>>> hashmap;
    class Cmp {
        public:
        bool operator() (pair<int, string> a, pair<int, string> b) {
            return a.first < b.first;
        }
    };
public:
    /** Initialize your data structure here. */
    TimeMap() {
        
    }
    
    void set(string key, string value, int timestamp) {
        hashmap[key].push_back({timestamp, value});
    }
    
    string get(string key, int timestamp) {
        auto& values = hashmap[key];    // 注意：用引用，千万不要用普通变量存储
        if (values.size() == 0) return "";
        auto val = upper_bound(values.begin(), values.end(), make_pair(timestamp, ""), Cmp());
        if (val == values.begin()) return "";
        return (--val)->second;
    }
};

/**
 * Your TimeMap object will be instantiated and called as such:
 * TimeMap* obj = new TimeMap();
 * obj->set(key,value,timestamp);
 * string param_2 = obj->get(key,timestamp);
 */
```

## 983. Minimum Cost For Tickets

Intution: 最优化问题，最优解依赖子问题的解，首先想到dp。
最优解结构：f(x) = min(f(x-1) + cost[0], f(x-7) + cost[1], f(x-30) + cost[2]),
其中，f(x)表示天数为x时的最小花费，由于x可能不存在于days中，此时，f(x)表示比x恰好大的天的最小花费。

```cpp
class Solution {
    int getDp(vector<int>& days, vector<int>& dp, int day) {
        auto result = upper_bound(days.begin(), days.end(), day);
        // cout << day << " " << int(result - days.begin()) << " " << endl;
        if (result == days.begin())
            return 0;
        else {
            // cout << "return : " << *(result-1) << endl;
            // cout << "return : " << dp[0] << endl;
            return dp[result - days.begin() - 1];
        }
    }
public:
    int mincostTickets(vector<int>& days, vector<int>& costs) {
        vector<int> dp(days.size(), 0);
        for (int i = 0; i < days.size(); i++) {
            int day = days[i];
            dp[i] = getDp(days, dp, day - 1) + costs[0];
            dp[i] = min(dp[i], getDp(days, dp, day - 7) + costs[1]);
            dp[i] = min(dp[i], getDp(days, dp, day - 30) + costs[2]);
            // cout << "dp : " << i << " " << dp[i] << endl;
        }
        
        return dp[dp.size() - 1];
    }
};
```

## 983. Minimum Cost For Tickets

暴力方法是3层循环枚举所有的组合，判断是否符合按位与为0的条件。时间复杂度: O(n^3)。
结果TLE。

可以想到的优化:

1. 先求出所有 A[i] & A[j]的组合，再根据缺少的0位搜索构造出可能的A[k], 寻找A[k]是否存在。
时间复杂度：O(n^2 * 2^16)
结果TLE。

```cpp
class Solution {
    int search(unordered_map<int, int>& hashtable, vector<int>& add, int level, int base) {
        if (level == add.size()) return hashtable[base];
        return search(hashtable, add, level + 1, base) + search(hashtable, add, level + 1, base + add[level]);
    }
    int getComplementCount(unordered_map<int, int>& hashtable, int a) {
        vector<int> add;
        for (int i = 0; i < 16; i++) {
            if (!((a >> i) & 1)) {
                // 如果第i位为0
                add.push_back(1 << i);
            }
        }
        
        // cout << a << " : ";
        // for (auto i: add) {
        //     cout << i << " ";
        // }
        // cout << endl;
        return search(hashtable, add, 0, 0);
    }
public:
    int countTriplets(vector<int>& A) {
        unordered_map<int, int> hashtable;
        for (auto a: A) {
            hashtable[a]++;
        }
        int result = 0;
        for (auto a: A) {
            for (auto b: A) {
                result += getComplementCount(hashtable, a & b);
            }
        }
        
        return result;
    }
};
```

2. 每次寻找到可能的A[k]后保存起来，下次遇到相等的A[i] & A[j]就可以直接用了。
时间复杂度：O(n^3)。
结果AC。因为A[i] & A[j]重复的很多，所以实际运行时，比较接近 Omega(n^2)。

```cpp
class Solution {
public:
    int countTriplets(vector<int>& A) {
        unordered_map<int, int> hashtable;
        int result = 0;
        for (auto a: A) {
            for (auto b: A) {
                int x = a & b;
                if (hashtable.find(x) == hashtable.end()) {
                    for (auto c: A) {
                        if ((c & x) == 0)
                            hashtable[x]++;
                    }
                }
                result += hashtable[x];
            }
        }
        
        return result;
    }
};
```

## 后记
结束该contest后的第二天，我在家里参加了Google的1st Phone Interview。由于保密协议的限制，并不能分享具体的题目。
只能再次分享一些面试的体会吧。面试题目整体不难，比较接近Medium。但45分钟要解决2道题目，从思考到讨论再到编码，而且电话面试的通话质量也很差，真的是很难的一件事情。最后结果第二题最后急匆匆写完了，也没有做到bug-free就匆忙结束了已经超时的面试。我现在在LeetCode上做算法题也有170道了，其中一半以上是Medium+难度的。但仍然不足以应对Google的面试。排除掉客观原因，我失败的主观原因有：
- 解决问题和编码的速度不够快，没有形成基本的模式(也可以说是套路);
- 对面试的期待比较高，造成一定程度的紧张；
- 电话面试经验不足，更喜欢On site面试。

我暂时想到的应对策略：
- 以后每次做题都计时，量化 思考、编码、测试、debug的时间
- 总结算法题的类型和套路，每种套路的代码模版要非常熟练
- 以兴趣为导向（我喜欢读书），多读读和编程/算法/面试相关的书籍 充实自己
- 提高交流能力，多多练习，可以用语言、文字、图 清楚地表达自己的想法

加油Forest！