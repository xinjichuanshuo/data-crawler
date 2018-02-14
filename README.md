# data-crawler
基于 Nodejs 的定向爬虫工具，用于采集 [世纪佳缘](http://www.jiayuan.com/) 的用户信息数据.

作者： 141220045 贾聪

## 如何使用
```
# 更新 npm
npm update

# 全局安装 node 
npm install -g node

# 克隆项目到本地
git clone git@github.com/xinjichuanshuo/data-crawler

# 进入项目目录空间
cd data-crawler

# 初始化 node 依赖
npm install

# 启动爬虫
node app.js
```

## 相关技术
- [cheerio](https://cheerio.js.org/)：server 端的 html 解析工具
- [superagent](https://github.com/visionmedia/superagent)：轻量级用户代理、网络请求库

## 爬取思路
### 1. 登录模拟：
使用准备好的账户模拟登陆，得到标识登录状态的认证 cookie，这样在后续爬取中能够获得完整的 html 内容

### 2. 随机策略：
随机选取起始 ID，后续每次爬取取上一次采集的 ID+random_num 的用户信息，random_num 在 0-1000 中随机生成

### 3. 持久化：
集成 moogoose，使用 mongodb 存储用户信息

## 数据展示：

![部分用户数据展示](http://oxgbg3ran.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-02-14%20%E4%B8%8B%E5%8D%881.56.22.png)

##

LICENSE@[MIT](https://opensource.org/licenses/MIT)
