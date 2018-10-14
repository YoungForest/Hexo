---
title: problems in affective computing experiments
tags:
categories:
---

## 非root安装pytorch

```
conda create --name yangsen
source activate yangsen
conda install pytorch torchvision -c pytorch
```

## 没有root安装ffmpeg

通过源码安装，不过最后还是找平台的工程师用`visudo`给加了`sudo`权限。

## 生成input文件

如何将目录下所有的MP4文件以每行一个的形式输出。

```bash
ls -1 *.mp4 > ../video-classification-3d-cnn-pytorch/input
```

## 重命名所有视频文件

```bash
rename 's/1 \((\d+)\)$/$1.mp4/' *.mp4
```

## gpu 内存访问错误

运行main.py提取视频特征时遇到，具体原因未知。

限制GPU数目后解决，猜测是cuda的bug。

```bash
CUDA_VISIBLE_DEVICES=0,1 python ...
```

## 提取视频特征

```
CUDA_VISIBLE_DEVICES=1 python main.py --input ./input --video_root /data/yangsen/movieclips --output ../video_features/resnet-50-kinetics.json --model /data/yangsen/models/resnet-50-kinetics.pth --mode feature --resnet_shortcut B --model_name resnet --model_depth 50

CUDA_VISIBLE_DEVICES=1 python main.py --input ./input --video_root /data/yangsen/movieclips --output ../video_features/resnet-152-kinetics.json --model /data/yangsen/models/resnet-152-kinetics.pth --mode feature --resnet_shortcut B --model_name resnet --model_depth 152
```