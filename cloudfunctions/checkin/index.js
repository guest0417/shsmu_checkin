// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  function genDate(input_date){
    var date = new Date(Date.parse(input_date));
    var Y = date.getFullYear();
    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    return Y+"-"+M+"-"+D;
  }
  var today = genDate(new Date());
  var date = new Date();
  var now = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  var day = date.getDay();
  //判断Time
  var count = await db.collection("schedule").where({weekday:day}).count();
  for (var i=0; i<count; i++){
    var time_ind = ((await db.collection("schedule").where({weekday:day}).get()).data[i].start_time);
    if(time_ind-600<now<time_ind+300) break;
  }
  if(!(time_ind-600<now<time_ind+300)&&1==0) return false;
  //判断簽到沒有
  var history = (await db.collection("checkin").where({student_id:event.student_id, time:time_ind}).get()).data;
  if(history.length&&1==0) return false; //setdata
  //判断mac
  var count = 0;
  for (var i=0;i<event.wifiList.length;i++){
    var wifiList = (await db.collection("wifi").where({BSSID:event.wifiList[i].BSSID}).get()).data;
    if(wifiList.length)count++;
    if(count>=8)break;
  }
  if(count<8)return false;
  else if(event.mode == "check")return true;
  
  db.collection("checkin").add({
    data:{
      openid: wxContext.OPENID,
      date: today,
      checkin_mode: event.checkin_mode,
      time: time_ind,
      location: event.location,
      student_id: event.student_id,
    }
  })
  return true;
}