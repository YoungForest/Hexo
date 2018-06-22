---
title: pytorch
tags:
categories:
---

# Tensor

Tensor类似numpy里的ndarray（矩阵），但是可以在GPU上进行加速运算。

# Autograd

automatic differentiation

# 神经网络的训练过程

- 定义一个神经网络，初始化参数(权重)
- 在一个数据集上迭代
- 通过神经网络向前处理输入
- 计算损失
- 反向传播梯度到神经网络上的参数
- 更新权重: 随机梯度下降(Stochastic Gradient Descent, SGD) weigth = weigth - learning_rate * gradient

## Loss function

optim

## Datasets

- imagenet
- CIFAR10
- MINIST
