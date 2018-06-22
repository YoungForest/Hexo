
---
title: python tricks
tags:
- tech
categories:
---

# python tricks

## pythonic way to check a list is sorted or not

```python
all(l[i] <= l[i+1] for i in range(len(l)-1))
```

## filter

```python
number_list = range(-5, 5)
less_than_zero = list(filter(lambda x: x < 0, number_list))
print(less_than_zero)

# Output: [-5, -4, -3, -2, -1]
```

## 文件wildcard匹配

```python
# 当前目录下所有以jpg结尾的文件名，合成一个列表返回
glob.glob("*.jpg")
```

## 文件分离文件名和扩展名

```python
file, ext = os.path.splitext(infile)
```