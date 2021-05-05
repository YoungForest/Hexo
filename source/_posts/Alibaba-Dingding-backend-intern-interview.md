---
title: 阿里钉钉 服务器开发 暑期实习生 面试
date: 2020-03-04 19:34:08
tags:
- Alibaba
- intern
categories:
- interview
---

通过钉钉电话视频面试，手撕代码通过阿里在线平台完成。

算法题2道：

1\. 实现一个双向链表的数据结构。

2\. twoSum。寻找数组中2数和等于target的下标。

难度属于LeetCode Easy吧。但是面试时，需要自己和面试官询问沟通好理解题目。并且面试官很注重代码的整洁和效率。比如 函数参数的检查，实现本身的预设。

```cpp
//评测题目: 实现一个简单的双向链表，要求完成 node和list的构造函数，以及 list类的void push_back(node*), void remove(node*) 方法

class node{
public:
	node* prev;
	node* next;

public:
    node() {
      prev = nullptr;
      next = nullptr;
    }
};

class list{
private:
	node* head;
	node* tail;
public:
	list() {
      head = nullptr;
      tail = nullptr;
    }
	
	void push_back(node* n) {
      // 假设n不在list中
    	if (n) {
          if (tail) {
          	tail->next = n;
          } else {
            head = n;
          }
          n->prev = tail;
          tail = n;
        }
    }
	void remove(node* n) {
      if (n == nullptr) return;
      auto current = head;
      while (current) {
        if (current == n) {
          // find
          if (current->prev && current->next) {
            auto p = current->prev;
            auto n = current->next;
            p->next = n;
            n->prev = p;
          } else if (current->prev) {
            tail = current->prev;
            tail->next = nullptr;
            current->prev = nullptr;
          } else if (current->next) {
            head = current->next;
            head->prev = nullptr;
            current->next = nullptr;
          } else {
            head = nullptr;
            tail = nullptr;
          }
          break;
        }
        current = current->next;
      }
      
    }
};

//给定一个vecotr<int>v和一个目标target，找到v中两个数字的和等于target，返回数字在原数组中的下标（多个解的返回任意一个即可），无解返回空vector。
//Example:  v=[7,11,2,15],target=9,
//因为nums[0]+nums[2]=7+2=9, 
//return[0,2].
vector<int> helper(vector<int>& v,int target) {
	vector<int> copy = v;
    sort(copy.begin(), copy.end());
    int left = 0, right = v.size() - 1;
    while (left < right) {
        int current_sum = copy[left] + copy[right];
    	if (current_sum == target) {
          return {copy[left], copy[right]};
        } else if (current_sum < target) {
          ++left;
        } else {
          --right;
        }
    }
    return {};
}
vector<int> twoSum(vector<int>& v,int target) {
    if (v.size() <= 1) return {};
	auto values = helper(v, target);
  	if (values.empty()) return {};
    vector<int> ans(2);
    int index =  0;
  	
      if (values[0] == values[1]) {
        for (int i = 0; i < v.size(); ++i) {
          if (v[i]  == values[0])  {
            ans[index] = i;
            ++index;
            if (index == 2)
              break;
          }
        }
      } else {
        for (int i = 0; i < v.size(); ++i) {
          if (v[i] == values[0]) {
            ans[0] = i;
          } else if (v[i] == values[1]) {
            ans[1] = i;
          }
        }
      }
    }
  
    return ans;
}
```

我的主语言是C++，所以问了很多C++相关的题目。

从我的简历里，看了我的[GitHub主页](https://github.com/YoungForest)。询问了最想介绍的项目。我介绍了自己大三时实现的[编译器](https://github.com/YoungForest/C0Compiler)。然后询问了编译的一些过程和数据结构，如 词法分析、语法分析、中间代码生成、目标代码生成、优化，符号表、DAG图优化等。

C++中输入`>>`和模版嵌套时'>>`在编译时如何区分。我答应该是语法分析时就可以区别开。然后聊了些这个故事的历史，之前模版的`>>`必需写成`> >`才能编译通过。

C++ HashMap容器的实现，和hash值如何映射到桶中。
STL 中vector的扩容实现。
new 和 malloc的区别。
move语义和右值引用。
weak_ptr, shared_ptr, unique_ptr的区别。

平时对什么感兴趣，高级的数据结构:
Order tree, 线段树。

快排和堆排的实现。最小堆的维护。

进程和线程的区别。

锁的种类 和 读写控制。

Linux内存管理机制。

常用的shell命令。文件操作、进程信息(top, ps)、堆栈信息(lldb).

TCP丢包处理。这题我答的不好，大三下学的计算机网络很多知识都忘记了。

24点的智力游戏，4 4 10 10， （10 * 10 - 4) / 4。
我一开始以为是编程问题，答曰回溯。后来才发现是纯考智力。

职业规划。
