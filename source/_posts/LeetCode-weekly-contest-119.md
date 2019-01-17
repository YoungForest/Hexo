---
title: LeetCode weekly contest 119
date: 2019-01-13 10:56:25
tags:
- LeetCode
categories:
---

这次contest做的比较惨，排名大致是1486 / 3845。出现的问题有：
- 第二题，比较简单。由于是easy的题目，直接brute force了，结果TLE一次。之前由于粗心，for循环条件中的变量还写错了一次。导致2次罚时。
- 第三题，也不是很难，但最后并没有想到O(n)的解法。只想到了O(n ^ 2)的。想到了要算前缀和，也注意到了divisible这一关键词。但并没有联想到前缀和相等就可以这一关键点。
- 第四题，想到了dp。卡在了"找寻后面数组中刚刚大一点的数"这步，即没想到用**TreeMap**解决。归根结底是因为对基础的数据结构不熟悉。

## 973. K Closest Points to Origin

直接用C++中的Map即可，用key进行排序。

```cpp
class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int K) {
        map<int, vector<vector<int>>> distance;
        for (const auto point: points) {
            distance[point[0]*point[0] + point[1]*point[1]].push_back(point);
        }
        vector<vector<int>> results;
        int i = 0;
        for (const auto d: distance) {
            for (const auto point: d.second) {
                results.push_back(point);
                i++;
                if (i >= K) {
                    return results;
                }
            }
        }
        
        return results;
    }
};
```


## 976. Largest Perimeter Triangle

只用找最大的3个可以组成三角形的数就可以了。

```cpp
class Solution {
public:
    int largestPerimeter(vector<int>& A) {
        int result = 0;
        sort(A.begin(), A.end());
        for (int i = A.size() - 3; i >= 0; i--) {
            if (A[i] + A[i+1] > A[i+2]) {
                result = A[i] + A[i+1] + A[i+2];
                break;
            }
        }
        
        return result;
    }
};
```

## 974. Subarray Sums Divisible by K

```cpp
class Solution {
public:
    int subarraysDivByK(vector<int>& A, int K) {
        unordered_map<int, int> prefix_sum;
        int sum = 0;
        int result = 0;
        prefix_sum[0] = 1;
        for (int i = 0; i < A.size(); i++) {
            sum = (sum + A[i] % K + K) % K;
            result += prefix_sum[sum];
            prefix_sum[sum]++;
        }
        
        return result;
    }
};
```

## 975. Odd Even Jump

C++中，map的默认实现就是Tree Map.

```cpp
class Solution {
public:
    int oddEvenJumps(vector<int>& A) {
        vector<bool> odd_reach(A.size(), false);
        vector<bool> even_reach(A.size(), false);
        int result = 0;
        map<int, int> treemap;
        
        odd_reach[A.size() - 1] = true;
        even_reach[A.size() - 1] = true;
        result++;
        treemap[A[A.size() - 1]] = A.size() - 1;
        
        for (int i = A.size() - 2; i >= 0; --i) {
            auto larger = treemap.lower_bound(A[i]);
            auto smaller = treemap.upper_bound(A[i]);
            
            if (larger != treemap.end()) {
                odd_reach[i] = even_reach[larger->second];
            }
            if (smaller != treemap.begin()) {
                even_reach[i] = odd_reach[(--smaller)->second];
            }
            if (odd_reach[i]) result++;
            treemap[A[i]] = i;
        }
        
        return result;
    }
};
```