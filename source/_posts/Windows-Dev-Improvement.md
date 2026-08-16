---
title: 微软员工的 Windows 开发环境改进技巧
description: "整理 Windows 开发环境的实用改进，让终端、包管理、提示符与目录跳转更顺手。"
date: 2022-12-17 22:28:25
tags:
- Windows
categories:
- 技术分享
translations:
  zh-CN: https://youngforest.github.io/2022/12/17/Windows-Dev-Improvement/
  en: https://youngforest.github.io/en/2022/12/17/Windows-Dev-Improvement/
---
## 引言

作为一名曾经的 Mac 用户，刚转到 Windows 11 时，我遇到了不少挑战。我很怀念 macOS 的易用与便利，也一度难以适应不同的开发环境。不过，经过一番探索，我找到了一些工具和技巧，让自己在 Windows 上的开发体验得到了改善。总有人需要把 Windows 当作开发机，比如微软员工。这篇文章会分享我的经验，并提供一些提示和资源，重点介绍如何改进 Shell 环境。

<figure class="editorial-illustration editorial-illustration--hero">
  <img src="/images/ai/Windows-Dev-Improvement/zh-hero.webp" alt="杂乱线缆与抽屉穿过窗形拱门，变成由卡片、包裹、灯光和指南针组成的整洁工具工坊" width="1536" height="864" decoding="async" fetchpriority="high">
</figure>

<!-- more -->

## Clink

Clink 是一款增强 Windows 命令提示符功能的强大工具。它提供了多项功能，可以让你在使用命令行时更高效。

### 如何安装和设置 Clink

1. 从[官方网站](https://mridgers.github.io/clink/)下载 Clink 安装程序。
2. 运行安装程序，并按照屏幕上的说明将 Clink 安装到系统中。
3. 安装完成后，打开 Windows 命令提示符。
4. 输入 `clink install` 并按 Enter，在命令提示符中启用 Clink。这会把 Clink 加入 PATH 环境变量，并配置一些默认设置。
5. 重新启动命令提示符以应用更改。

你还可以编辑用户目录（例如 `C:\Users\username`）中的配置文件 `clink_inputrc.ini`，进一步定制 Clink。该文件包含多种选项，可以调整 Clink 的行为，例如修改配色、添加新的键盘快捷键，以及为常用命令定义别名。

下面是修改 `clink_inputrc.ini` 配色的例子：

1. 用文本编辑器打开 `clink_inputrc.ini`。
2. 找到 `[colors]` 部分。
3. 把颜色代码改成想要的值。例如，要把目录列表的前景色改为黄色，可以设置 `ls+di=33;1`。

关于自定义 Clink 的更多信息，可以查看[官方文档](https://mridgers.github.io/clink/)。

### Clink 使用示例

Clink 提供了许多实用功能，可以改善 Windows 命令行体验。

#### 1. Tab 补全

Clink 支持命令、选项和文件路径的 Tab 补全。只需输入命令或文件路径的前几个字符，然后按 `Tab` 键即可补全。如果有多个匹配项，可以反复按 `Tab` 在它们之间切换。

#### 2. 别名

你可以使用 Clink 的 `alias` 命令为常用命令定义别名。例如，如果经常使用 `dir /w`，可以创建名为 `ls` 的别名：

```
alias ls=dir /w
```

之后，在命令提示符中输入 `ls` 时，它就会被替换为 `dir /w`。

#### 3. 历史记录导航

Clink 允许你用上下方向键浏览命令历史。如果需要重复之前输入过的命令，这项功能尤其方便。

#### 4. 自定义

如前所述，你可以通过编辑 `clink_inputrc.ini` 进一步定制 Clink，例如：

- 修改命令提示符的配色。
- 为常用命令定义键盘快捷键。
- 为特定命令设置默认选项。

这些设置和其他自定义选项都可以在 Clink 官方文档中找到。

#### 5. 目录导航

Clink 提供了多个目录导航快捷方式：

- `cd..`：返回上一级目录。
- `cd\`：前往根目录。
- `cd.`：切换到当前目录，实际不会产生变化。
- `cd~`：前往主目录。

#### 6. 复制和移动文件

Clink 为常用的文件管理命令提供别名：

- `cp`：`copy` 命令的别名。例如，可以用 `cp example.txt backup` 把当前目录中的 `example.txt` 复制到 `backup` 目录。
- `mv`：`move` 命令的别名。例如，可以用 `mv example.txt archive` 把当前目录中的 `example.txt` 移动到 `archive` 目录。

#### 7. 管理进程

Clink 提供了多个管理进程的命令：

- `tasklist`：显示所有正在运行的进程，以及它们的进程 ID（PID）等信息。
- `taskkill`：根据 PID 或映像名称终止进程。例如，可以用 `taskkill /im notepad.exe` 终止映像名为 `notepad.exe` 的进程。

利用 Clink 的功能和别名，可以更轻松、更快速地浏览目录、复制或移动文件，以及管理进程。总体而言，Clink 能显著改善 Windows 命令行体验。根据自己的需求使用并定制这些功能，可以让工作更高效。

## PowerShell

PowerShell 是 Windows 上更先进的命令行界面，提供了广泛的功能，可以帮助你更高效地完成复杂任务。

### 如何安装和设置 PowerShell

PowerShell 比传统的命令提示符更强大、更灵活。可以按以下步骤安装和设置：

1. 检查 Windows 版本：Windows 7 SP1 及更高版本已包含 PowerShell。更早的系统需要安装 PowerShell Core。
2. 安装 PowerShell：如果尚未安装，可以前往 [PowerShell 下载页面](https://github.com/PowerShell/PowerShell/releases)，下载与操作系统匹配的版本。
3. 打开 PowerShell：安装完成后，可以在开始菜单中输入“PowerShell”，或者按 Windows 键 + X 并从菜单中选择“Windows PowerShell”。
4. 自定义 PowerShell 配置文件：打开 PowerShell 并输入 `notepad $PROFILE`，用记事本打开配置文件。你可以在其中添加别名、函数和其他自定义内容，然后保存。
5. 安装模块：PowerShell 拥有大量模块，可以扩展功能。使用 `Install-Module` 命令即可安装模块。例如，可以使用 `Install-Module -Name Az -AllowClobber` 安装 Azure PowerShell 模块。

安装并定制 PowerShell 后，你就能在 Windows 上获得更强大、更灵活的命令行环境。

### 使用 PowerShell 管理系统的示例

PowerShell 是管理 Windows 系统的强大工具，下面是几个例子。

#### 管理 Windows 服务

PowerShell 可以管理 Windows 服务。例如，可以用以下命令启动 Print Spooler 服务：

```
Start-Service -Name Spooler
```

停止该服务可以使用：

```
Stop-Service -Name Spooler
```

#### 配置网络设置

PowerShell 也可以配置网络。例如，可以使用以下命令设置网络适配器的 IP 地址：

```
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.100 -PrefixLength 24 -DefaultGateway 192.168.1.1
```

这条命令会把“Ethernet”适配器的 IP 地址设为 192.168.1.100，子网掩码设为 255.255.255.0，默认网关设为 192.168.1.1。

#### 执行系统维护任务

PowerShell 还可以执行多种系统维护任务。例如，可以用以下命令检查磁盘错误：

```
Get-Volume | Get-Partition | Get-Disk | Repair-Volume -SpotFix
```

该命令会检查所有卷、分区和磁盘是否存在错误，并尝试修复。

这些只是 PowerShell 管理和维护 Windows 系统的几个例子，它能够完成的事情远不止这些。

## Winget

[Winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) 是 Windows 的包管理器，可以从命令行轻松安装、管理和更新应用。它类似于 macOS 上的 Homebrew 或 Ubuntu 上的 apt，为管理 Windows 软件提供了简单、方便的方式。使用 Winget 可以快速安装和更新应用，不必手动搜索和下载安装文件，对开发者和高级用户非常实用。

### Winget 使用示例

#### 安装应用

输入以下命令即可安装应用：

```
winget install <application>
```

例如，安装 Visual Studio Code：

```
winget install Microsoft.VisualStudioCode
```

#### 列出已安装应用

可以使用以下命令列出系统中当前安装的应用：

```
winget list
```

#### 搜索应用

可以使用以下命令搜索应用：

```
winget search <application>
```

例如，搜索 Firefox：

```
winget search Firefox
```

#### 卸载应用

要卸载通过 Winget 安装的应用，可以使用：

```
winget uninstall <application>
```

例如，卸载 Visual Studio Code：

```
winget uninstall Microsoft.VisualStudioCode
```

以上只是使用 Winget 安装和管理 Windows 应用的几个例子。借助 Winget，可以轻松从命令行安装和更新应用，对开发者和高级用户都很有价值。

## Oh My Posh

Oh My Posh 是一款用于定制 PowerShell 提示符的工具。它允许你创建自定义主题，让命令行界面更美观，也更易用。

[Windows 安装说明](https://ohmyposh.dev/docs/installation/windows)

## Autojump

[Autojump](https://github.com/wting/autojump) 可以帮助你更高效地浏览文件系统。它会记住你访问过的目录，让你通过简短命令快速跳回这些位置。

### 安装 Autojump

以管理员身份打开 PowerShell 终端，然后运行：

```
winget install autojump
```

运行以下命令可以找到 PowerShell 配置文件：

```
$PROFILE
```

重新启动 PowerShell 终端以应用更改。

### 使用 Autojump

Autojump 会记住你访问过的目录，并提供快捷方式，让文件系统导航更高效。

#### 跳转到目录

要跳转到之前访问过的目录，只需输入 `j`，后面跟目录名中具有辨识度的一部分。例如：

```
j documents
```

这会跳转到名称中包含“documents”的目录。

#### 列出目录

要查看 Autojump 记住的目录列表，可以输入：

```
j --stat
```

它会显示目录列表，以及每个目录被访问的次数。

借助 Autojump，你可以更高效、更快速地浏览文件系统，让 Windows 开发体验更顺畅。

## Z.lua：更快的 Autojump 替代方案

[z.lua](https://github.com/skywind3000/z.lua) 是一个更快的 Autojump 替代方案。它使用纯 Lua 编写，没有外部依赖，速度也比 Autojump 更快。我在 Windows 和 PowerShell 上更常用它。

## 总结

只要具备合适的工具并知道如何使用，Windows 也可以成为优秀的开发平台。本文介绍了多种改善 Windows 开发体验的工具，包括 Clink、PowerShell、Oh My Posh、Winget 和 Autojump。

Clink 和 PowerShell 能带来不逊于其他平台的强大 Shell 体验；Oh My Posh 可以定制 PowerShell 提示符，让界面更美观；Winget 让安装和管理 Windows 软件更简单；Autojump 则提供了快速、高效的文件系统导航方式。

使用这些工具和技巧，可以改善 Windows 开发体验并提高工作效率。经过合理配置，Windows 也能像其他平台一样强大、好用。

## 参考资料

- https://mridgers.github.io/clink/
- https://github.com/wting/autojump
- https://ohmyposh.dev/docs/installation/prompt
- https://learn.microsoft.com/en-us/windows/package-manager/winget/
