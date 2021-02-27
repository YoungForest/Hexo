---
title: MAC 手动编译 build qBittorrent
date: 2021-02-27 17:10:01
tags:
- 折腾
categories:
- tech
---

## 起因

最近毕业压力比较大，想在北邮人上下载个电影看看，放松下。却发现一直使用的做种下载工具qBittorrent无法打开了。在网上寻找了半天原因和解决方案。

最终确认是MAC更新的锅，qBittorrent 属于认证不完整的应用：[Issue 11570](https://github.com/qbittorrent/qBittorrent/issues/11570)。
解决方案有二：
- 禁掉APPLE的安全检查
- 自己手动编译一遍应用

由于某些原因，我无法对MAC做过多的系统更改。只好尝试第二个解决方案。事实证明，手动编译qBittorrent并不简单，一下午就此度过，电影也不用看了。为方便有相同问题的同学参考，我记录我的解决方案于此。因为在我编译构建过程中，网上并没有类似的教程或是参考，而且确实有不少坑。

## 步骤

如果之前没有QT环境，`./configure`会报找不到`qmake`的错误。需要配置相应的环境。
```bash
brew install qt
echo 'export PATH="/usr/local/opt/qt/bin:$PATH"' >> ~/.zshrc
export PATH="/usr/local/opt/qt/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/qt/lib"
export CPPFLAGS="-I/usr/local/opt/qt/include"
export PKG_CONFIG_PATH="/usr/local/opt/qt/lib/pkgconfig
```

如果之前没有`boost`环境，会报找不到`boostlib`的错误：

```bash
checking for boostlib >= 1.65 (106500)... configure: We could not detect the boost libraries (version 1.65 or higher). If you have a staged boost library (still not installed) please specify $BOOST_ROOT in your environment and do not give a PATH to --with-boost option.  If you are sure you have boost installed, then check your version number looking in <boost/version.hpp>. See http://randspringer.de/boost for more documentation.
configure: error: Could not find Boost
```

需要安装`boost`环境。

```bash
brew install boost
```

```bash
brew install libtorrent-rasterbar
```

如果遇到报错，

```bash
Error: Directory not empty @ dir_s_rmdir - /usr/local/opt/openssl
```

可以删掉对应文件夹或是更改其所有人`chown`.

```bash
brew cleanup
sudo rm -rf /usr/local/Cellar/openssl/1.0.2q
```

在我`brew install libtorrent-rasterbar`后再`./configure`时，仍然会发生该库版本不对的问题：

```bash
Requested 'libtorrent-rasterbar >= 1.2.11' but version of libtorrent-rasterbar is 1.2.10
```

因为`brew`的formula中只有1.2.10，我们只好手动编译一个新版了。

去github找到libtorrent-rasterbar对应版本的源码：[download](https://github.com/arvidn/libtorrent/releases/tag/v1.2.11)。按照文档中的构建说明编译安装即可。

对于MAC来说：

```bash
brew install boost-build boost openssl@1.1
echo "using darwin ;" >>~/user-config.jam
b2 crypto=openssl cxxstd=17 openssl-lib=/usr/local/Cellar/openssl@1.1/1.1.1j/lib openssl-include=/usr/local/Cellar/openssl@1.1/1.1.1j/include release
b2 crypto=openssl cxxstd=17 openssl-lib=/usr/local/Cellar/openssl@1.1/1.1.1j/lib openssl-include=/usr/local/Cellar/openssl@1.1/1.1.1j/include install --prefix=/usr/local
```


```bash
export libtorrent_LIBS="-L/usr/local/lib"
export libtorrent_CFLAGS="-I/usr/local/include"
export openssl_CFLAGS="-I/usr/local/Cellar/openssl@1.1/1.1.1j/include"
export openssl_LIBS="-L/usr/local/Cellar/openssl@1.1/1.1.1j/lib"
./configure
make && make install
qbittorrent
```

<!-- ```bash
Undefined symbols for architecture x86_64:
  "_EVP_sha512"
``` -->

除此之外，你还可以参考[官网的另外一些编译构建文档](https://github.com/qbittorrent/qBittorrent/wiki#compilation). 这里提供了使用CMake或QT Creator的编译方案。
