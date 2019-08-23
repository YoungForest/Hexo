---
title: LeetCode biweekly contest 5
date: 2019-07-27 23:06:57
tags:
- LeetCode
categories:
- Programming
---

距离上次参加biweekly contest已经2个月了，编号也从1直接跳到5了。
本次contest十分简单，都是算法里的经典的题目，属于必会的。我做完4题后还有近1个小时。

## 1133. Largest Unique Number
签到题。遍历一遍数组，然后计数。然后从大向小找符合要求的数。

时间复杂度: O(N log N),
空间复杂度: O(N).

```cpp
class Solution {
public:
    int largestUniqueNumber(vector<int>& A) {
        map<int, int> count;
        for (int a : A) {
            ++count[a];
        }
        for (auto it = count.crbegin(); it != count.crend(); ++it) {
            if (it->second == 1)
                return it->first;
        }
        return -1;
    }
};
```

## 1134. Armstrong Number

感觉还是一道Easy的题目。根据题意做即可，考察取数中每一个位。

时间复杂度: O(log N), N的位数。
空间复杂度: O(log N).

```cpp
class Solution {
    int pow(int x, int y) {
        if (y == 0)
            return 1;
        else
            return x * pow(x, y - 1);
    }
public:
    bool isArmstrong(int N) {
        const int number = N;
        vector<int> digits;
        while (N > 0) {
            digits.push_back(N % 10);
            N /= 10;
        }
        int s = 0;
        int power = digits.size();
        for (auto digit : digits) {
            s += pow(digit, power);
        }
        
        return s == number;
    }
};
```

## 1135. Connecting Cities With Minimum Cost
[最小生成树](https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/)

时间复杂度: O(E logE, E logV).
空间复杂度: O(E, V)

```cpp
class Solution {
    struct UF {
        vector<int> parent;
        int count;
        
        UF(int n) {
            parent.resize(n);
            for (int i = 0; i < n; ++i) {
                parent[i] = i;
            }
            count = n;
        }
        // A utility function to find the subset of an element i  
        int find(int i)  
        {  
            if (parent[i] == i)  
                return i;  
            return find(parent[i]);  
        }  

        // A utility function to do union of two subsets  
        void Union(int x, int y)  
        {  
            int xset = find(x);  
            int yset = find(y);  
            if(xset != yset) 
            {  
                parent[xset] = yset;
                --count;
            }  
        }    
    };
public:
    int minimumCost(int N, vector<vector<int>>& conections) {
        UF uf(N);
        sort(conections.begin(), conections.end(), [](const auto& lhs, const auto&rhs) -> bool {
            return lhs[2] < rhs[2];
        });
        int ans = 0;
        for (const auto& edge : conections) {
            int a = edge[0] - 1, b = edge[1] - 1, cost = edge[2];
            if (uf.find(a) != uf.find(b)) {
                uf.Union(a, b);
                ans += cost;
                if (uf.count == 1)
                    return ans;
            }
        }
        return -1;
    }
};
```

## 1136. Parallel Courses

拓扑排序。数据结构的基础题目。

```cpp
class Solution {
public:
    int minimumSemesters(int N, vector<vector<int>>& relations) {
        unordered_map<int, vector<int>> in;
        unordered_map<int, int> out;
        unordered_set<int> q;
        for (int i = 1; i <= N; ++i) {
            q.insert(i);
        }
        for (const auto& edge : relations) {
            int X = edge[0], Y = edge[1];
            in[X].push_back(Y);
            ++out[Y];
            q.erase(Y);
        }
        int ans = 0;
        int finish_course = 0;
        while (!q.empty()) {
            unordered_set<int> next_q;
            for (int i : q) {
                ++finish_course;
                for (int from : in[i]) {
                    --out[from];
                    if (out[from] == 0) {
                        out.erase(from);
                        next_q.insert(from);
                    }
                }
                in.erase(i);
            }
            ++ans;
            q = std::move(next_q);
        }
        if (finish_course == N)
            return ans;
        else
            return -1;
    }
};
```