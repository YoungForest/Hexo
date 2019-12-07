---
title: Mac OS写入ntfs解决方案
date: 2019-11-11 10:10:44
tags:
- Mac
categories:
-  Tech
---

使用Mac系统确实存在一些不方便的地方，比如 写入 NTFS的硬盘或U盘。默认情况下，MAC 只支持读取NTFS。不过只要你有勇气折腾，解决方案还是很简单的。

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