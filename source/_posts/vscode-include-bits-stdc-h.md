---
title: vscode include 万能头文件 bits/stdc++.h
date: 2020-05-18 10:41:29
tags:
- vscode
- gcc
categories:
- Programming
description: 记录让 VS Code 正确找到 C++ 万能头文件的方法：查询 GCC 的真实头文件搜索路径，并同步到编辑器设置。
translations:
  zh-CN: https://youngforest.github.io/2020/05/18/vscode-include-bits-stdc-h/
  en: https://youngforest.github.io/en/2020/05/18/vscode-include-bits-stdc-h/
---
最近经常打kickstart需要include万能头文件`bits/stdc++.h`，然而，我喜爱的编辑器vs code总是不能正确地找到该头文件，会有红色波浪线表示错误。作为程序员的我完全不能忍受，所以尝试解决该问题。在网络上搜了很多解决方案，大多数并不能直接地解决我的问题。所以，我总结自己的解决方案于此，方便各位取用。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/vscode-include-bits-stdc-h/zh-hero.webp" alt="编辑器的小信使沿编译器书架的青绿色索引路线找到一册伞形总目录，恼人的红色波浪虫随即退场" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

编程环境:
g++ 9.1.0, Mac 10.14.2, vs code 1.45.1

总的思路是:
1. 寻找gcc编译器头文件的路径,
2. 更改VS Code设置，让其用上面的路径可以找到`bits/stdc++.h`

```bash
gcc-9 -v -E -x c++ -
```

![gcc include path](/images/vscode-include-bits-stdc-h/gcc-include-path.png)

图中所示，就是编译器默认找的路径顺序。将这些路径全部加到vscode的includePath里。

![vscode-include-path](/images/vscode-include-bits-stdc-h/vscode-include-path.png)

![vscode-settings](/images/vscode-include-bits-stdc-h/vscode-settings.png)

Done!
