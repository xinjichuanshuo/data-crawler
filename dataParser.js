module.exports = function dataParser($){ 
  const data = {};

  let _this = $('.member_info_r');
  try {
    data.username = _this.find('h4').children()[0].prev.data;
    data.gender = ($('.nav_l').find('.cur').find('a').text()[0]=='她')? 'F':'M';
    data.id = _this.find('h4').find('span').text().replace('ID:', "");
    data.age = _this.find('.member_name').children()[0].prev.data.split('，')[0].replace('\'', "").replace('岁', "");
    let hometown = _this.find('.member_name').children();
    data.province = hometown[0].children[0].data;
    data.city = hometown[1].children[0].data;
    _this.find('.member_info_list', '.fn-clear').find('em').each((i ,elem) => {
      switch(i){
        case 0:
        data.education = $(elem).text();
        break;
        case 1:
        data.height = $(elem).text().replace('cm', "");;;
        break;
        case 2:
        data.weight = $(elem).text().replace('公斤', "");
        break;
        case 4:
        data.race = $(elem).text().replace('族', "");;
        break;
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
        data.most_height = res[1];
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
  } catch(err) {
    return null;
  }

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