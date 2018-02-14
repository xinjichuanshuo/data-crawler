const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const dataParser = require('./dataParser');
const mongoose = require('mongoose');

// const UserInfo = require('./userInfo');
mongoose.connect('mongodb://localhost/jiayuan');
var Single = mongoose.model('Single', {
  username: String,
  gender: String,
  id: Number,
  age: Number,
  province: String,
  city: String,
  education: String,
  height:  Number,
  weight:  Number,
  race: String,
  least_age:  Number,
  most_age:  Number,
  least_height:  Number,
  most_height:  Number,
  aim_race: String,
  aim_education: String,
  aim_marriage: String,
  aim_home: String
});


var cookie = '';

const url={
  url: "http://login.jiayuan.com/",
  login_url: "https://passport.jiayuan.com/dologin.php?pre_url=http://www.jiayuan.com/usercp",
  pre_url: "http://www.jiayuan.com/usercp"
};

const headers = {
  'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  'Proxy-Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': 1,
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
  'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
}

const loginInfo = {
  name: '13951650687',
  password: 'hostate123',
  remem_pass: true,
  ljg_login: '1',
  m_p_l: '1',
  channel: '0',
  position: '0'
}

function getParam(){
  superagent.get(url.url).end(function(err,res){
    if(!err){
      var $=cheerio.load(res.text);
      loginInfo._s_x_id=$('[name=_s_x_id]').attr('value');
      getLoginCookie();
    }else {
      console.log(err);
    }
  });
}

// 发送登陆请求，获取 cookie 信息
function getLoginCookie() {
  superagent.post(url.login_url).set(headers).send(loginInfo).end(function (err, response) {
    if (!err) {
      cookie = response.headers["set-cookie"];
      console.log(cookie);
      // setCookie();
      collectInfo();
    } else {
      console.log(err);
    }
  });
}

function setCookie() {
  superagent.get(url.pre_url).set(headers).set("Cookie", cookie).end(function (err, response) {
    if (!err) {
      cookie = response.headers["set-cookie"];
      console.log("new Cookie", cookie);
      // getResponseCookies();
      collectInfo();
    } else {
      console.log(err);
    }
  });
}



function collectInfo() {
  let total = 0;
  let index = 0;

  setInterval(() => {
    const param = index;
    superagent.get(`http://www.jiayuan.com/${param}`).set("Cookie", cookie).set(headers).end(function (err, res) {
      // 抛错拦截
      if(err){
      } 
      const $ = cheerio.load(res.text);
      let data = dataParser($);
      console.log(param);
      if(data){
        const seed = new Single(data);
        seed.save().then(() => {
          console.log(param, total++)           
        });
      } 
    });
    index += Math.floor(Math.random()*1000);
  }, 1000);
  // startGetting();
}

function crawlingData(index){

}

// getParam();
collectInfo();
