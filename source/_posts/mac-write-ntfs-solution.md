---
title: Mac OS写入ntfs解决方案
date: 2019-11-11 10:10:44
tags:
- Mac
categories:
- Tech
description: 比较 Mac 写入 NTFS 移动硬盘的手动挂载与轻量工具方案，并记录最终选择更适合日常使用的方法。
translations:
  zh-CN: https://youngforest.github.io/2019/11/11/mac-write-ntfs-solution/
  en: https://youngforest.github.io/en/2019/11/11/mac-write-ntfs-solution/
---
使用Mac系统确实存在一些不方便的地方，比如 写入 NTFS的硬盘或U盘。默认情况下，MAC 只支持读取NTFS。不过只要你有勇气折腾，解决方案还是很简单的。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/mac-write-ntfs-solution/zh-hero.webp" alt="一座只读闸门拦住移动硬盘，两条无字路线分别用繁复扳手和轻巧小车把写入货物送过河" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

## 最推荐方法

[Mounty for NTFS](https://mounty.app/)

优点：免费，小巧
缺点：不hack，其实就是命令行的包装。有些同学可能更喜欢命令行的方式。

## 最hack的方法

```bash
sudo umount "/Volumes/Seagate Expansion Drive"
sudo mount -t ntfs -o rw,auto,nobrowse /dev/disk3s1 ~/ntfs-volume
```

reference: [mounty](https://mounty.app/)

经过一段时间的斗争，我还是采用了安装第三方应用的推荐方法。因为命令行确实经常忘记或是输错，每次都要重新Google，与我使用Mac系统想要的优雅方便不符。
