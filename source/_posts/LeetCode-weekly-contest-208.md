---
title: LeetCode weekly contest 208
date: 2020-09-30 08:32:45
tags:
- Competitive Programming
categories:
- LeetCode
---

距上次写周赛总结已经过去3个半月了。坚持了半年的写周赛题解中断确实挺可惜的，但却是当时的不得已之举。7月份一直在忙小论文的事儿，8月份接着就是开题和中期，9月份正式开学，并且从7月初就在Amazon开始了暑期实习。任务确实比之前要多，当时因为事务压身，感觉精力不足以把所有事都做好。因为每次周赛写题解都要花大半天的时间，再加上打周赛，基本1天时间。打比赛和写题解对精力的损耗也是不言而喻的。虽然这3个月题解断更了，但比赛还是在照常的打，毕竟加入了残酷刷题群，有更多的人一起打周赛，每周打比赛的反馈和热爱也更强了。
这3个月，我残酷群的排名也是起起落落落落落...最好时有15名，最差已经90名了。总的感觉是，自己更擅长常规不难的题目。遇到之前没见过或做的不多的就很容易最后一题做不出来。

昨天和Amazon的manager确认了转正事宜，之后基本上只用走流程了。有了理想offer后，秋招不知所措的弦终于可以放松下来了。有心情花时间做自己想做的事情了，读几本之前一直想看的书，认真打几场比赛，恢复写题解的习惯。当然实习和毕设大论文才是当前的主要任务，需要投入大部分时间。但终于有精力happy了。

这3个月来，因为国服赞助商礼物比较丰富，我比赛已经从美服转战国服了。效果还不错，除了coins奖励更容易拿到外，实体奖励也是很香的。有幸2次进入前50名，拿到一个帆布包和一个小米无线鼠标。

| Rank |	Name |	Score |	Finish Time | 	Q1 (3) |	Q2 (4) |	Q3 (5) |	Q4 (6)|
|--|--|--|--|--|--|--|--|
| 392 / 11499 | YoungForest | 	18 | 	1:04:46 |  0:28:38 | 0:40:28 | 1:04:46 | 0:55:59 |

事实上，由于要处理突发的培养方案问题，我还迟到了25min，否则成绩会更好看。

本次比赛被大家吐槽为阅读理解，读题难、题目描述迷惑。确实如此。

## 1598. Crawler Log Folder

签到题。只需要关心向下一层和向上一层即可。可以用一个变量维护，在比赛中，我是用了一个栈去做，实际上是大材小用了。

```cpp
class Solution {
public:
    int minOperations(vector<string>& logs) {
        stack<string> st;
        for (auto& s : logs) {
            if (s == "../") {
                if (!st.empty()) {
                    st.pop();
                }
            } else if (s == "./") {
                continue;
            } else {
                s.pop_back();
                st.push(s);
            }
        }
        return st.size();
    }
};
```

时间复杂度: O(N),
空间复杂度: O(N).

## 1599. Maximum Profit of Operating a Centennial Wheel

Straight forward. 千万不要多想，直接模拟，一下一下地转，得到最大收益。特别需要注意的是，当你停止运行后，之后再转就不需要cost了。

```cpp
class Solution {
public:
    int minOperationsMaxProfit(vector<int>& customers, int boardingCost, int runningCost) {
        int waitCustomer = 0;
        int getBoard = 0;
        int maxProfit = 0;
        int ans = 0;
        for (int i = 0; i < customers.size() || waitCustomer > 0; ++i) {
            if (i < customers.size()) {
                waitCustomer += customers[i];
            }
            if (waitCustomer >= 4) {
                waitCustomer -= 4;
                getBoard += 4;
            } else {
                getBoard += waitCustomer;
                waitCustomer = 0;
            }
            const int profit = getBoard * boardingCost - runningCost * (i + 1);
            // cout << profit << endl;
            if (profit > maxProfit) {
                maxProfit = profit;
                ans = i + 1;
            }
        }
        if (maxProfit <= 0) return -1;
        else return ans;
    }
};
```

时间复杂度: O(customers.size() + sum(customers) / 4),
空间复杂度: O(1).

## 1600. Throne Inheritance

别看描述的这么复杂，其实就是一个深度优先搜索/前序遍历。前面的问题描述，尤其是`Successor`函数的定义会让人十分迷惑，其实就是嫡长子继承制。直接看example会更好理解。我也是做完第四题才返回来看的第三题，确实太难理解题意了。

```cpp
class ThroneInheritance {
    unordered_set<string> dead;
    unordered_map<string, vector<string>> children;
    string root;
    // dfs
public:
    ThroneInheritance(string kingName) {
        root = kingName;
    }
    
    void birth(string parentName, string childName) {
        children[parentName].push_back(childName);
    }
    
    void death(string name) {
        dead.insert(name);
    }
    
    vector<string> getInheritanceOrder() {
        vector<string> ans;
        function<void(const string&)> dfs = [&](const string& r) -> void {
            if (dead.find(r) == dead.end()) {
                ans.push_back(r);
            }
            for (const string& child : children[r]) {
                dfs(child);
            }
        };
        dfs(root);
        return ans;
    }
};

/**
 * Your ThroneInheritance object will be instantiated and called as such:
 * ThroneInheritance* obj = new ThroneInheritance(kingName);
 * obj->birth(parentName,childName);
 * obj->death(name);
 * vector<string> param_3 = obj->getInheritanceOrder();
 */

```

## 1601. Maximum Number of Achievable Transfer Requests

题目相比二三题好理解的多。由于`request.length`本身比较小，所以我们可以直接暴力解法，枚举所有`requests`的子集，判断是否合法(每个building入度出度相等)，找到最大的。

```cpp
class Solution {
public:
    int maximumRequests(int n, vector<vector<int>>& requests) {
        // 2 ^ 16 * 16
        const int rl = requests.size();
        int ans = 0;
        auto verify  = [&](const int mask) -> bool {
            vector<int> in(n, 0);
            vector<int> out(n, 0);
            for (int i = 0; i < rl; ++i) {
                if ((mask & (1 << i)) != 0) {
                    ++in[requests[i][1]];
                    ++out[requests[i][0]];
                }
            }
            for (int i = 0; i < n; ++i) {
                if (in[i] != out[i]) return false;
            }
            return true;
        };
        for (int i = (1 << rl) - 1; i >= 0; --i) {
            if (verify(i)) {
                ans = max(ans, __builtin_popcount(i));
            }
        }
        return ans;
    }
};
```

m: `requests.length`,
时间复杂度: O(2 ^ m * (m + n)),
空间复杂度: O(n).

当然也有多项式时间复杂度的解法：[O((n+m)m)](https://leetcode-cn.com/problems/maximum-number-of-achievable-transfer-requests/solution/zui-xiao-fei-yong-zui-da-liu-onm2-c-by-heltion/).
用到了费用流，这已经超出我的知识范围了，有兴趣的同学可以学习下。

## 后记

经过3年的准备，我的秋招基本结束了。已经决定留在亚马逊了，再过3个月就要成为社畜了。算是比较理想的offer了。
最理想的Dream company当然是Google，无奈好不容易通过了实习一面，谷歌今年的实习项目因为疫情原因取消了。秋招也相比往年晚了很多，最近才有一些推送的消息。本身HC也十分稀少，机会难得。
其他心仪的外企 Hulu 通过一面，在等待二面；微软找zenian内推却一直没有笔试或面试的消息，应该是由于投的北京的STCA，HC少而且基本上都被实习生占了，之前还收到是否同意可能调剂到苏州的问卷，难呀；Intel基本上是稳了，不过那边薪资待遇比起亚麻都要差很多，已经不考虑了；还投了小厂HotStar，有口头的offer，但本身就是我用来拿个大package再和大厂compete的，基本上不考虑去。
国内互联网企业这边，拿了蚂蚁金服和猿辅导的offer，评级还都不错，蚂蚁还是A+。蚂蚁那边由于运气好，笔试拿了满分，师兄和lead还一直挺想让我去的。提前批6月份投了vivo，本身就是去试水的。结果因为overqualify被拒了，明明笔试全A，面试谈笑风声，有不要太优秀的要求就直说，别浪费的大家的时间。8月份还投了京东，面试很水，offer薪资也极其没诚意，属于劝退，我直接给拒了。百度提前批面完了，说是会给我offer，但一直没有消息。腾讯实习生面伤了，本身在北京也没好的岗位，秋招就没投。没想到还是被捞起来面了一次，后续无消息。字节一直被拒，反复捞起反复拒，真是八字不合。