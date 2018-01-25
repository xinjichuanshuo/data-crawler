const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

// const UserInfo = require('./userInfo');

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
      console.log(response.text)
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
  const start_url = "http://www.jiayuan.com/10721906";

  superagent.get(start_url).set("Cookie", cookie).set(headers).end(function (err, res) {
    // 抛错拦截
    if(err){
      console.log(err)
      throw Error(err);
    }
    
    const $ = cheerio.load(res.text);
    // console.log(res.header)

    let data = dataParser($);
    console.log(data);
  });
}

function dataParser($){ 
  const data = {};

  let _this = $('.member_info_r');
  data.username = _this.find('h4').children()[0].prev.data;
  data.gender = ($('.nav_l').find('.cur').find('a').text()[0]=='她')? 'F':'M';
  data.id = _this.find('h4').find('span').text().replace('ID:', "");
  data.age = _this.find('.member_name').children()[0].prev.data.split('，')[0].replace('\'', "").replace('岁', "");
  data.hometown = _this.find('.member_name').find('a').text().replace('显示地图',"");
  // console.log(_this.find('.member_info_list', '.fn-clear').html())
  _this.find('.member_info_list', '.fn-clear').find('em').each((i ,elem) => {
    switch(i){
      case 0:
      data.education = $(elem).text();
      break;
      case 1:
      data.height = $(elem).text();
      break;
      case 3:
      data.salary = $(elem).text();
      break;
      case 5:
      data.weight = $(elem).text();
      break;
      case 7:
      data.race = $(elem).text();
    }
  });

  // console.log($('.js_list', 'fn-clear').find('.ifno_r_con'))

  $('.js_list', '.fn-clear').find('.ifno_r_con').each((i, elem) => {
    let res;
    switch(i){
      case 0:
      res = getRange($(elem).text());
      data.least_age = res[0];
      data.most_age = res[1];
      break;
      case 1:
      res = getRange($(elem).text());
      data.least_height = res[0];
      data.most_heigth = res[1];
      break;
      case 2:
      data.aim_race = $(elem).text();
      break;
      case 3:
      data.aim_education = $(elem).text();
      break;
      case 5:
      data.aim_marriage = $(elem).text();
      break;
      case 6:
      data.aim_home = $(elem).text();
    }
  });

  return data;
}

function getRange(value) {
  let regexp=/\d+/g;
  let res = [];
  while((match=regexp.exec(value))!=null){
    res.push(match[0])
  }

  return res;
}

collectInfo();