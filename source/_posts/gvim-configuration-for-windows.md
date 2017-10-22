---
title: gvim configuration for windows
date: 2017-03-26 18:46:41
tags:
- vim
categories:
- 折腾
---
最近由于准备GRE, 整天背单词, 练听力和写作, 很是心烦, 很久没折腾了, 所以抽出时间, 给自己的笔记本下载并配置gvim, 也算是休憩.

# [下载](http://www.vim.org/download.php#pc)

# 配置文件
与Linux不同, Windows中gvim的配置文件为`$HOME/_vimrc`(个人配置文件), `$VIMROOT/_vimrc`(系统配置文件), 默认情况下为`C:\Program Files (x86)\Vim`. 除此之外, 还可以有`_gvimrc`文件, 只有在gui情况下打开才会读取, 在terminal下不会. 这对于两者应用不同的配置很有帮助, 尤其是使用不同的主题, 同一主题下, 两者的效果很不同. 这样就避免了使用`if(has'gui_running')`这样复杂的配置内容.


# .vimrc配置
## 打开配置文件
+ `:e $MYVIMRC`: 打开用户配置文件, 如果没有的话可以参考`help vimrc`
+ `:e $MYGVIMRC`: 打开GUI用户配置
`help vimrc`中推荐的配置文件位置是`$HOME/vimfiles/vimrc`(Windows)或`~/.vim/vimrc(Windows)`, 这样比起`$HOME/_vimrc`和`~/.vim`更portable.

## 个性化内容
$MYGVIMRC
``` vim
set clipboard=unnamed   " 与Windows公用clipboard, 默认情况下, y, p只使用vim的clipboard, 不是很方便
set colorscheme monokai " 一个我比较喜欢的主题, 不过在terminal下很难看, 所以放在gvimrc中
set guifont=Consolas:h18:cANSI:qDRAFT   "换个字体, 默认字体忍不了
```

$MYVIMRC
``` vim
set number
set nobackup    "不产生~文件
set noswapfile  "不产生.swp文件
set noundofile  "不产生.un文件
set encoding=utf-8  "默认为cp936, 改为与系统兼容的utf-8
set fileformat=dos  "换行符以\r\n为准
set fileencoding=utf-8  "与系统兼容
syntax enable
```
## markdown支持
vim的插件可以说可以满足你的任何需求, 然而在这里我不是用vim插件, 而是使用chrome extension满足自己的需求. 理由是配置更简单, 未来其他编辑器也可以利用.

[插件安装和使用说明](https://github.com/volca/markdown-preview)

**绑定快捷键.** 在vimrc中加入:
``` vim
" Open markdown files with Chrome.
autocmd BufEnter *.md exe 'noremap <F5> :!start C:\Program Files (x86)\Google\Chrome\Application\chrome.exe %:p<CR>'
```

使用时按`F5`就可以了.

# 后记
这篇post就是用`gvim for MS-WINDOWS`完成的.
