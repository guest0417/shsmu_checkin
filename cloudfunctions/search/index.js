// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var date = new Date();
  var day = date.getDay();
  if(event.mode == "users"){
    return db.collection('users').where({
      openid: wxContext.OPENID
    }).get();
  }else if(event.mode == "schedule"){
    return db.collection('schedule').where({
      class: event.class,
      weekday: day,
    }).get();
  }
}