---
title: BUAA daily health report
date: 2021-04-01 11:16:46
tags:
categories:
- 折腾
---

Auto daily health report solution for BUAA.

<!-- more -->

## 报告脚本

```python
import requests
import json
import time
import datetime

headers = {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'app.buaa.edu.cn',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
}

def report(uesrname, password, dataform):
    x = requests.session()

    # login, fetch cookies
    print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
    print('Logging in......')
    rep = x.post(
        'https://app.buaa.edu.cn/uc/wap/login/check',
        data={
            'username': uesrname,
            'password': password 
        },
        headers=headers,
        timeout=360
    )
    print(rep.text)
    print(rep.status_code)

    print('Save report......')
    saveReport = x.post(
        'https://app.buaa.edu.cn/buaaxsncov/wap/default/save',
        headers=headers,
        data = dataform
    )
    print(saveReport.text)
    print(saveReport.status_code)
    
content = 'sfzs=1&bzxyy=&bzxyy_other=&brsfzc=1&tw=&sfcxzz=&zdjg=&zdjg_other=&sfgl=&gldd=&gldd_other=&glyy=&glyy_other=&gl_start=&gl_end=&sfmqjc=&sfzc_14=1&sfqw_14=0&sfqw_14_remark=&sfzgfx=0&sfzgfx_remark=&sfjc_14=0&sfjc_14_remark=&sfjcqz_14=0&sfjcqz_14_remark=&sfgtjz_14=0&sfgtjz_14_remark=&szsqqz=0&sfyqk=&szdd=1&area=%E5%8C%97%E4%BA%AC%E5%B8%82%20%E6%B5%B7%E6%B7%80%E5%8C%BA&city=%E5%8C%97%E4%BA%AC%E5%B8%82&province=%E5%8C%97%E4%BA%AC%E5%B8%82&address=%E5%8C%97%E4%BA%AC%E5%B8%82%E6%B5%B7%E6%B7%80%E5%8C%BA%E8%8A%B1%E5%9B%AD%E8%B7%AF%E8%A1%97%E9%81%93%E5%8C%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%E5%8C%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%E5%AD%A6%E9%99%A2%E8%B7%AF%E6%A0%A1%E5%8C%BA&geo_api_info=%7B%22type%22%3A%22complete%22%2C%22position%22%3A%7B%22Q%22%3A39.980937228733%2C%22R%22%3A116.35092936197998%2C%22lng%22%3A116.350929%2C%22lat%22%3A39.980937%7D%2C%22location_type%22%3A%22html5%22%2C%22message%22%3A%22Get%20geolocation%20success.Convert%20Success.Get%20address%20success.%22%2C%22accuracy%22%3A29%2C%22isConverted%22%3Atrue%2C%22status%22%3A1%2C%22addressComponent%22%3A%7B%22citycode%22%3A%22010%22%2C%22adcode%22%3A%22110108%22%2C%22businessAreas%22%3A%5B%7B%22name%22%3A%22%E4%BA%94%E9%81%93%E5%8F%A3%22%2C%22id%22%3A%22110108%22%2C%22location%22%3A%7B%22Q%22%3A39.99118%2C%22R%22%3A116.34157800000003%2C%22lng%22%3A116.341578%2C%22lat%22%3A39.99118%7D%7D%2C%7B%22name%22%3A%22%E7%89%A1%E4%B8%B9%E5%9B%AD%22%2C%22id%22%3A%22110108%22%2C%22location%22%3A%7B%22Q%22%3A39.977965%2C%22R%22%3A116.37172700000002%2C%22lng%22%3A116.371727%2C%22lat%22%3A39.977965%7D%7D%5D%2C%22neighborhoodType%22%3A%22%E7%94%9F%E6%B4%BB%E6%9C%8D%E5%8A%A1%3B%E7%94%9F%E6%B4%BB%E6%9C%8D%E5%8A%A1%E5%9C%BA%E6%89%80%3B%E7%94%9F%E6%B4%BB%E6%9C%8D%E5%8A%A1%E5%9C%BA%E6%89%80%22%2C%22neighborhood%22%3A%22%E5%8C%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%22%2C%22building%22%3A%22%22%2C%22buildingType%22%3A%22%22%2C%22street%22%3A%22%E5%AD%A6%E9%99%A2%E8%B7%AF%22%2C%22streetNumber%22%3A%2237%E5%8F%B7%22%2C%22country%22%3A%22%E4%B8%AD%E5%9B%BD%22%2C%22province%22%3A%22%E5%8C%97%E4%BA%AC%E5%B8%82%22%2C%22city%22%3A%22%22%2C%22district%22%3A%22%E6%B5%B7%E6%B7%80%E5%8C%BA%22%2C%22township%22%3A%22%E8%8A%B1%E5%9B%AD%E8%B7%AF%E8%A1%97%E9%81%93%22%7D%2C%22formattedAddress%22%3A%22%E5%8C%97%E4%BA%AC%E5%B8%82%E6%B5%B7%E6%B7%80%E5%8C%BA%E8%8A%B1%E5%9B%AD%E8%B7%AF%E8%A1%97%E9%81%93%E5%8C%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%E5%8C%97%E4%BA%AC%E8%88%AA%E7%A9%BA%E8%88%AA%E5%A4%A9%E5%A4%A7%E5%AD%A6%E5%AD%A6%E9%99%A2%E8%B7%AF%E6%A0%A1%E5%8C%BA%22%2C%22roads%22%3A%5B%5D%2C%22crosses%22%3A%5B%5D%2C%22pois%22%3A%5B%5D%2C%22info%22%3A%22SUCCESS%22%7D&gwdz=&is_move=0&move_reason=&move_remark=&realname=%E6%9D%A8%E6%A3%AE&number=ZY1806711&uid=305542&created=1614692203&date=20210302&id=28752&gwszdd='

def lambda_handler(event, context):
    print('Checking health info at {}...'.format(event['time']))
    try:
        report('学号', '密码', content)
    except:
        print('Check failed!')
        raise
    else:
        print('Check passed!')
        return event['time']

if __name__ == '__main__':
    print (lambda_handler({'time': datetime.datetime.now()}, {}))
```


如果`python`脚本报错
>'ascii' codec can't encode characters in position 12-15: ordinal not in range(128)

应该是编码的问题，按照[网络上的教程](https://www.jianshu.com/p/4e2000920332). 在命令前增加环境变量解决：

```bash
PYTHONIOENCODING=utf-8 python report.py
```

## Cron 定时

配合Unix/Linux的[crontab](https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/crontab.html)，可以达到每天定时打卡的效果.

rentaocron文件内容:

```txt
16 18 * * * PYTHONIOENCODING=utf-8 python3 /home/rentao/workspace/report.py
```

启动定时任务:

```bash
crontab rentaocron
```

查看定时任务：

```bash
crontab -l
```
