---
title: LeetCode weekly contest 151
date: 2019-08-31 20:25:38
tags:
- LeetCode
categories:
- Programming
---

这周去字节跳动参加夏令营了，周日还需要上课，所以就鸽了周赛。那你怎么能参加kick start呢？毕竟本月的round E是所谓的黄金轮次，对面试获取名额很重要，所以我选择翘掉夏令营。

夏令营结束后，按约补题。不得不说，LeetCode比Kick start的难度还是要低不少的。感觉Kick start的签到题难度是Medium，后2题是Hard。

## 1169. Invalid Transactions

考察字符串处理。由于transactions.lenght < 1000, 所以及时是暴力方法也是可以的。事实上，我实现的优化方法在最坏情况下，并没有变好。

时间复杂度: O(N^2).
空间复杂度: O(N).

```cpp
class Solution {
public:
    vector<string> invalidTransactions(vector<string>& transactions) {
        unordered_map<string, vector<tuple<int, int, string>>> name_trasactions;
        for (const auto& s : transactions) {
            stringstream ss(s);
            string tmp;
            vector<string> v;
            while (getline(ss, tmp, ',')) {
                v.push_back(tmp);
            }
            name_trasactions[v[0]].push_back({stoi(v[1]), stoi(v[2]), v[3]});
        }
        unordered_set<string> ans;
        for (auto& p : name_trasactions) {
            sort(p.second.begin(), p.second.end());
            int l = 0, r = 0;
            for (; r < p.second.size(); ++r) {
                if (get<1>(p.second[r]) > 1000) {
                    ans.insert(p.first + "," + to_string(get<0>(p.second[r])) + "," + to_string(get<1>(p.second[r]))+ "," + get<2>(p.second[r]));
                }
                while (get<0>(p.second[r]) - get<0>(p.second[l]) > 60) {
                    ++l;
                }
                for (int i = l; i < r; ++i) {
                    if (get<2>(p.second[r]) != get<2>(p.second[i])) {
                        ans.insert(p.first + "," + to_string(get<0>(p.second[r])) + "," + to_string(get<1>(p.second[r]))+ "," + get<2>(p.second[r]));
                        ans.insert(p.first + "," + to_string(get<0>(p.second[i])) + "," + to_string(get<1>(p.second[i]))+ "," + get<2>(p.second[i]));
                    }
                }
            }
        }
        return vector<string>(ans.begin(), ans.end());
    }
};
```

## 1170. Compare Strings by Frequency of the Smallest Character

简单的二分查找。

时间复杂度: O(queries.length * queries[i].length * log words.length),
空间复杂度: O(queries.length + words.length).

```cpp
class Solution {
    int f(const string& s) {
        char mi = 'z' + 1;
        int count = 0;
        for (char c : s) {
            if (c == mi) {
                ++count;
            } else if (c < mi) {
                mi = c;
                count = 1;
            }
        }
        return count;
    }
public:
    vector<int> numSmallerByFrequency(vector<string>& queries, vector<string>& words) {
        vector<int> a;
        for (const auto& w : words) {
            a.push_back(f(w));
        }
        sort(a.begin(), a.end());
        vector<int> ans;
        for (const auto& q : queries) {
            int c = f(q);
            auto it = upper_bound(a.begin(), a.end(), c);
            ans.push_back(distance(it, a.end()));
        }
        return ans;
    }
};
```

## 1171. Remove Zero Sum Consecutive Nodes from Linked List

考察链表操作。为了快速找到对应元素和删除元素，我们需要使用一个hash table来存储前缀和和节点的映射关系。

时间复杂度: O(N),
空间复杂度: O(N).

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* removeZeroSumSublists(ListNode* head) {
        ListNode dummy(0);
        dummy.next = head;
        ListNode* current = head;
        unordered_map<int, ListNode*> m;
        int sum = 0;
        m[0] = &dummy;
        while (current) {
            sum += current->val;
            if (m.find(sum) != m.end()) {
                auto delete_head = m[sum]->next;
                m[sum]->next = current->next;
                current->next = nullptr;
                int delete_sum = sum;
                while (delete_head) {
                    auto tmp = delete_head;
                    delete_sum += tmp->val;
                    if (delete_sum != sum)
                        m.erase(delete_sum);
                    delete_head = delete_head->next;
                    delete tmp;
                }
                current = m[sum]->next;
            } else {
                m[sum] = current;
                current = current->next;
            }
            
        }
        return dummy.next;
    }
};
```

## 1172. Dinner Plate Stacks

用多个栈来模拟一个栈。
实现不复杂，但是需要考虑比较多的边界条件。每个函数如何使栈的状态发生改变。

时间复杂度: O(1).
空间复杂度: O(N).

```cpp
class DinnerPlates {
    vector<stack<int>> stacks;
    set<int> condidates;
    int capacity;
public:
    DinnerPlates(int capacity_) : capacity(capacity_) {
    }
    
    void push(int val) {
        if (condidates.empty()) {
            condidates.insert(stacks.size());
            stacks.push_back(stack<int>());
        }
        int target = *condidates.begin();
        stacks[target].push(val);
        if (stacks[target].size() == capacity) {
            condidates.erase(target);
        }
    }
    
    int pop() {
        if (stacks.empty())
            return -1;
        int ret = stacks.back().top();
        stacks.back().pop();
        while (!stacks.empty() && stacks.back().empty()) {
            stacks.pop_back();
            condidates.erase(stacks.size());
        }
        if (!stacks.empty() && stacks.back().size() < capacity) {
            condidates.insert(stacks.size() - 1);
        }
        return ret;
    }
    
    int popAtStack(int index) {
        if (index >= stacks.size())
            return -1;
        if (stacks[index].empty())
            return -1;
        if (index == stacks.size() - 1)
            return pop();
        int ret = stacks[index].top();
        stacks[index].pop();
        condidates.insert(index);
        return ret;
    }
};

/**
 * Your DinnerPlates object will be instantiated and called as such:
 * DinnerPlates* obj = new DinnerPlates(capacity);
 * obj->push(val);
 * int param_2 = obj->pop();
 * int param_3 = obj->popAtStack(index);
 */
```
