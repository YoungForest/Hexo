---
title: Queue and Stack
date: 2019-02-17 17:33:33
tags:
- LeetCode
categories:
- Programming
---
今天我们一起学习2种重要的数据结构：队列 和 栈。
本文根据LeetCode上的Explore教程 [Introduction to Data Structure - Queue & Stack](https://leetcode.com/explore/featured/card/queue-stack/) 整理而成。

## Introduction

最常用的Collection是数组(Array)，其最常使用的获取数据的操作是随机获取(Random access), 在C++中一般称作 subscribe。
但是有时，我们想要限制处理数据的顺序。最常见的限制是：先进先出(First in first out), 后进先出(Last in first out)。分别对应2种数据结构 队列(Queue) 和 栈(Stack)。

我们从 定义、实现 和 每种数据结构的内置操作 分别学习 队列 和 栈。
学习目标：
1. 理解数据处理顺序FIFO和LIFO的原则；
2. 手动实现数据结构；
3. 熟悉语言内置的Queue和Stack；
4. 解决基础的Queue-related问题，尤其是BFS；
5. 解决基础的Stack-related问题；
6. 理解系统的栈如何帮助你，在解决dfs和其他递归问题的时候。

## Queue: First-in-first-out Data Structure

### 定义

先进先出 最普遍的比喻是排队(也就是队列), 最早进入队列的人最早被服务到。
所以队列总共只有2个modify 方法：
- enqueue
- dequeue

### 实现

Queue并不是基础的数据结构，我们可以用内置的数组来实现它。在C++中，Queue是container adapter, 并不是真正的container，其内部其实是deque。

实现实例：
```cpp
#include <iostream>

class MyQueue {
    private:
        // store elements
        vector<int> data;       
        // a pointer to indicate the start position
        int p_start;            
    public:
        MyQueue() {p_start = 0;}
        /** Insert an element into the queue. Return true if the operation is successful. */
        bool enQueue(int x) {
            data.push_back(x);
            return true;
        }
        /** Delete an element from the queue. Return true if the operation is successful. */
        bool deQueue() {
            if (isEmpty()) {
                return false;
            }
            p_start++;
            return true;
        };
        /** Get the front item from the queue. */
        int Front() {
            return data[p_start];
        };
        /** Checks whether the queue is empty or not. */
        bool isEmpty()  {
            return p_start >= data.size();
        }
};

int main() {
    MyQueue q;
    q.enQueue(5);
    q.enQueue(3);
    if (!q.isEmpty()) {
        cout << q.Front() << endl;
    }
    q.deQueue();
    if (!q.isEmpty()) {
        cout << q.Front() << endl;
    }
    q.deQueue();
    if (!q.isEmpty()) {
        cout << q.Front() << endl;
    }
}
```

### 循环队列 Circular Queue

在之前的实现中，p_start之前的内存空间是被浪费掉的。为了充分利用，我们可以在内部使用循环利用array。

Circular Queue也叫做"Ring Buffer"。

Ring Buffer的实现：
```cpp
class MyCircularQueue {
    vector<int> data;
    int head;
    int size;
public:
    /** Initialize your data structure here. Set the size of the queue to be k. */
    MyCircularQueue(int k) {
        data.insert(data.begin(), k, 0);
        head = 0;
        size = 0;
    }
    
    /** Insert an element into the circular queue. Return true if the operation is successful. */
    bool enQueue(int value) {
        if (isFull())
            return false;
        
        data[(head + size) % data.size()] = value;
        size++;
        return true;
    }
    
    /** Delete an element from the circular queue. Return true if the operation is successful. */
    bool deQueue() {
        if (isEmpty())
            return false;
        
        head = (head + 1) % data.size();
        size--;
        return true;
    }
    
    /** Get the front item from the queue. */
    int Front() {
        if (isEmpty()) return -1;
        return data[head];
    }
    
    /** Get the last item from the queue. */
    int Rear() {
        if (isEmpty()) return -1;
        return data[(head + size - 1) % data.size()];
    }
    
    /** Checks whether the circular queue is empty or not. */
    bool isEmpty() {
        return size == 0;
    }
    
    /** Checks whether the circular queue is full or not. */
    bool isFull() {
        return size == data.size();
    }
};

/**
 * Your MyCircularQueue object will be instantiated and called as such:
 * MyCircularQueue* obj = new MyCircularQueue(k);
 * bool param_1 = obj->enQueue(value);
 * bool param_2 = obj->deQueue();
 * int param_3 = obj->Front();
 * int param_4 = obj->Rear();
 * bool param_5 = obj->isEmpty();
 * bool param_6 = obj->isFull();
 */
```

### Queue的应用

最典型的应用，BFS。
BFS(Breadth-first Search)一般用来发现从根节点到目标节点的最短距离。

应用BFS的场景：
- do traversal
- find the shortest path

场景中常使用的数据结构：
- 图
- 树

在具体应用中，BFS里的节点可能是**真正的节点**或**状态**，边可能是**真正的边**或**状态间的转移**。

BFS的模版，一定要背下来，以后面试或做题提高速度和bug-free的可能。

#### template 1

```java
/**
 * Return the length of the shortest path between root and target node.
 */
int BFS(Node root, Node target) {
    Queue<Node> queue;  // store all nodes which are waiting to be processed
    int step = 0;       // number of steps neeeded from root to current node
    // initialize
    add root to queue;
    // BFS
    while (queue is not empty) {
        step = step + 1;
        // iterate the nodes which are already in the queue
        int size = queue.size();
        for (int i = 0; i < size; ++i) {
            Node cur = the first node in queue;
            return step if cur is target;
            for (Node next : the neighbors of cur) {
                add next to queue;
            }
            remove the first node from queue;
        }
    }
    return -1;          // there is no path from root to target
}
```

#### template 2


```java
/**
 * Return the length of the shortest path between root and target node.
 */
int BFS(Node root, Node target) {
    Queue<Node> queue;  // store all nodes which are waiting to be processed
    Set<Node> visited;  // store all the nodes that we've visited
    int step = 0;       // number of steps neeeded from root to current node
    // initialize
    add root to queue;
    add root to visited;
    // BFS
    while (queue is not empty) {
        step = step + 1;
        // iterate the nodes which are already in the queue
        int size = queue.size();
        for (int i = 0; i < size; ++i) {
            Node cur = the first node in queue;
            return step if cur is target;
            for (Node next : the neighbors of cur) {
                if (next is not in used) {
                    add next to queue;
                    add next to visited;
                }
                remove the first node from queue;   
            }
        }
    }
    return -1;          // there is no path from root to target
}
```
1. 在每一轮中，队列中的节点都是等待被处理的。
2. 没经历一次外层的while循环，都离root更远一步， step++。

#### template 2

在图中，确保每个节点不被多次访问很重要。否则BFS会陷入无限循环。此时，我们增加一个`hashset`用来标注是否节点已经被访问到。

```java
/**
 * Return the length of the shortest path between root and target node.
 */
int BFS(Node root, Node target) {
    Queue<Node> queue;  // store all nodes which are waiting to be processed
    Set<Node> visited;  // store all the nodes that we've visited
    int step = 0;       // number of steps neeeded from root to current node
    // initialize
    add root to queue;
    add root to visited;
    // BFS
    while (queue is not empty) {
        step = step + 1;
        // iterate the nodes which are already in the queue
        int size = queue.size();
        for (int i = 0; i < size; ++i) {
            Node cur = the first node in queue;
            return step if cur is target;
            for (Node next : the neighbors of cur) {
                if (next is not in used) {
                    add next to queue;
                    add next to visited;
                }
            }
            remove the first node from queue;   
        }
    }
    return -1;          // there is no path from root to target
}
```

什么情况下可以不使用visited呢？
1. 你确定不会出现重复访问的情况。比如，遍历树的时候。
2. 你确实想要把一个节点加入队列多次。


## 栈 Stack

提到栈，我就想起周杰伦的《七里香》。歌中唱到，
> 雨下整夜，我的栈溢出就像雨水。

在LIFO数据结构中，最新被添加的元素最早被处理。在栈中，添加元素的操作叫做push(压栈)，移除元素的操作叫做pop（弹出）。虽然在C++中，queue的操作也是同样的名字，但在大多数语言中，push 和 pop是stack专有的。

像队列一样，绝大多数语言提供了built-in的stack库，你不需要重复造轮子，只需要熟悉stack的常用操作，包括 push, pop, top（获取栈顶元素）。

### 单调栈的应用

https://leetcode.com/explore/featured/card/queue-stack/230/usage-stack/1363/

Intution: 维护一个单调递减的栈，遍历一遍数组T，如果将其放入栈中，把栈中比它小的元素都pop出来，并计算出相应的间隔。

时间复杂度：O(n),
空间复杂度: O(n).

```cpp
class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& T) {
        vector<int> result(T.size(), 0);
        stack<pair<int, int>> s; // temperature, day
        for (int i = 0; i < T.size(); ++i) {
            while (!s.empty() && s.top().first < T[i]) {
                pair<int, int> current = s.top();
                result[current.second] = i - current.second;
                s.pop();
            }
            s.push({T[i], i});
        }
        
        return result;
    }
};
```

### stack 和 DFS

DFS是stack的重要应用之一，可以用来寻找从根节点到目标节点的路径(注意不一定是最短)。DFS是回溯的一种算法，只有到达最深的节点才进行回溯，尝试其他路径。

#### DFS 模版 1，递归版本

```java
/*
 * Return true if there is a path from cur to target.
 */
boolean DFS(Node cur, Node target, Set<Node> visited) {
    return true if cur is target;
    for (next : each neighbor of cur) {
        if (next is not in visited) {
            add next to visted;
            return true if DFS(next, target, visited) == true;
        }
    }
    return false;
}
```

#### DFS 模版 2，迭代版本

递归版本的优点是实现起来更加简单。缺点是，如果递归深度太深，会stack overflow。
这时，你可能会想要用 BFS 或者 用显式的栈实现DFS。


```java
/*
 * Return true if there is a path from cur to target.
 */
boolean DFS(int root, int target) {
    Set<Node> visited;
    Stack<Node> stack;
    add root to stack;
    while (s is not empty) {
        Node cur = the top element in stack;
        remove the cur from the stack;
        return true if cur is target;
        for (Node next : the neighbors of cur) {
            if (next is not in visited) {
                add next to visited;
                add next to stack;
            }
        }
    }
    return false;
}
```

实现的逻辑和递归解法相同。只不过我们使用`while`循环和显式的`stack`来模仿系统栈。

### [Implement Queue using Stacks](https://leetcode.com/explore/featured/card/queue-stack/239/conclusion/1386/)
用栈来实现队列。
我记得在程序员面试金典上遇到过一样的题目，感觉是一道很经典的题目。需要面试者对队列和栈都非常熟悉才行。

Intuition: 队列是FIFO，栈是LIFO，所以我们可以用2个栈来实现一个队列。定义将一个栈装入另一个栈的操作为**颠倒**。我们可以通过**颠倒**, 将LIFO变为FIFO，而且只有在需要dequeue的时候，才需要做颠倒的操作。

```cpp
class MyQueue {
    stack<int> a, b;
public:
    /** Initialize your data structure here. */
    MyQueue() {
        
    }
    
    /** Push element x to the back of queue. */
    void push(int x) {
        a.push(x);
    }
    
    /** Removes the element from in front of queue and returns that element. */
    int pop() {
        if (b.empty()) {
            while (!a.empty()) {
                b.push(a.top());
                a.pop();
            }
        }
        int ret = b.top();
        b.pop();
        return ret;
    }
    
    /** Get the front element. */
    int peek() {
        if (b.empty()) {
            while (!a.empty()) {
                b.push(a.top());
                a.pop();
            }
        }
        return b.top();
    }
    
    /** Returns whether the queue is empty. */
    bool empty() {
        return a.empty() && b.empty();
    }
};

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue obj = new MyQueue();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.peek();
 * bool param_4 = obj.empty();
 */
```

### [Implement Stack using Queues](https://leetcode.com/explore/featured/card/queue-stack/239/conclusion/1387/)

那么如何用FIFO实现LIFO呢？解法可能不是那么明显，但却十分简单。每次push时，都把队列里的元素重新入对一遍，就把最后入对的放到第一个位置了。

## 总结
dfs 和 bfs 属于想法简单，但实现起来不容易，尤其是bug-free并且快速地实现更属不易。
由于考察的编程基础涉及广泛，面试官也特别喜欢考类似的题目。几个模版必须熟练背会才行。

队 和 栈 更是基础的数据结构。在计算机科学中随处可见，虽然很多时候不会直接考察，但很多算法都要用到。熟练手写stack 和 queue 和使用built-in的stack 和 queue是每个合格程序员的基础。