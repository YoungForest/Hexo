---
title: 实现terminal代理
tags: 
  - Linux
date: 2016-11-02 23:30:00
---

## 问题
作为一名Linuxer，熟练使用终端是一项必备技能，但终端中有时下载安装功能速度很慢，令人崩溃.我自然而然想到了可否加个代理,提高速度。我之前一直用shadowsocks,浏览器使用switchyProxy,实现了初步的科学上网。那么,终端中是否有类似的工具呢？答案是肯定的。通过科学搜索，我成功解决了terminal中的科学上网问题，在此总结一下，希望可以帮到大家。
<!-- more -->
## 准备工具
shadowsocks, polipo

### shadowsocks
[Download and Install Client](https://shadowsocks.org/en/download/clients.html)

#### Install Command-line Client
```bash
pip install shadowsocks
apt-get install shadowsocks-libev
cpan Net::Shadowsocks
```
shadowsocks的配置可以参考[这篇文章](http://bblove.me/2015/03/09/use-ss/), 我很久之前配置的,这里就不回忆了(忘得差不多了).

让我们直接从polipo开始吧.

### polipo
polipo有多种安装方式,可以使用Python的包管理工具pip直接安装,也可以用各个操作系统的包管理工具安装.我更推荐后者,因为个人认为这样更好管理罢了.这里以Ubuntu为例.

```shell
apt-cache search polipo

adzapper - proxy advertisement zapper add-on
polipo - lightweight, caching web proxy
polipo-dbg - debug package for polipo
```
第二个包就是给我们这些小白使用的,安装它
```shell
sudo apt-get install polipo
```

安装好之后默认自启的,
我们要先修改它的配置文件(/etc/polipo/config):
```
logSyslog = true
logFile = /var/log/polipo/polipo.log
logLevel = 4 # 没有这句话的话`sudo polipo -v`会出现无法查看log文件的情况

socksParentProxy = "localhost:1080" # 这里假设shadowsocks的local port为1080
socksProxyType = socks5 # 是不是和SwitchyProxy的设置很像?
```

具体各个配置选项可以参考文件`/usr/share/doc/polipo/examples/config.sample`.

配置好之后,我们需要重启polipo服务(每次修改配置文件需要重启服务才能加载)
```
sudo service polipo stop;
sudo service polipo start;
```
或者直接
```
sudo service polipo restart;
```

可以用
```shell
sudo polipo -v
```
查看具体各个配置项,可以看到我们之前的更改生效了.

## 测试
配置完成后,怎么才知道自己是否已经可以科学上网了呢?
可以使用以下命令:
```
~$ curl -i http://ip.cn
当前 IP：60.xxx.xxx.x 来自：中国北京北京 xxx/电信
```
```
~$ http_proxy=http://localhost:8123 curl -i http://ip.cn # polipo的默认端口为8123,如有需要可以自行改动
当前 IP：xxx.xxx.xxx.xx0 来自：美国加利福尼亚州洛杉矶
```
这样就算成功了.

最近发现"ip.cn"这个网站不能用了，500访问错误。可以将其替换为“ipinfo.io/ip”就可以了i，这是另一个返回你的公网IP的网站。
还有一些其他的网站提供类似的返回IP的服务:
```bash
curl ifconfig.me
curl icanhazip.com
curl ipecho.net/plain
curl ifconfig.co
```

从浏览器中获得自己公网IP的方法:
- [Google](https://www.google.com/search?q=what%20is%20my%20IP%20address)
- [DuckDuckGo](https://duckduckgo.com/?q=ip)
- [Wolframalpha](https://www.wolframalpha.com/input/?i=what+is+my+ip+address), 推荐

## 更进一步
每次都打这么长的命令`http_proxy=http://localhost:8123`着实不是我们想要的,为了方便使用,可以在终端键入`export http_proxy=http://localhost:8123`,表示对该终端所有命令生效;或者更进一步,在.bashrc中加入`export http_proxy=http://localhost:8123`,每次启动终端时自动执行.如果不想要每次都走代理,可以像我一样,在.bashrc中加入`alias hp="http_proxy=http://localhost:8123"`,每次需要代理时,只需要在命令前面加`hp `就好了.

## 为git配置代理
git clone的速度很是感人, 只有几十k, 为git配置代理也是很简单的.

Add the following setting to the http items of .gitconfig files.
``` bash
[http]
proxy = <address of the proxy server>:<port of the proxy server>
```

You can also configure it using the following config command:
``` bash
git config --global http.proxy <address of the proxy server>:<port of the proxy server>
```

[ssh形式连接Github](https://gist.github.com/chuyik/02d0d37a49edc162546441092efae6a1)

在终端中尽情享受科学上网吧!
