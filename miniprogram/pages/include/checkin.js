module.exports = {
  checkin: checkin,
  checkTime: checkTime,
  checkLocaltion: checkLocaltion,
}

const app = getApp();

function checkin(page){
  return new Promise(resolve =>{
  wx.cloud.callFunction({
    // 云函数名称
    name: 'checkin',
    data: {
      wifiList: app.globalData.wifiList,
      location: app.globalData.location,
      checkin_mode: app.globalData.checkin_mode,
      nickname: app.globalData.userInfo.nickname,
      student_id: app.globalData.userInfo.student_id,
      mode: "checkin"
    },
    success: function (res) {
      console.log("接收到打卡反馈");
      console.log(res);
      if(res.result){
        var checkin_text = app.globalData.checkin_mode == 1 ? "打卡下线" : "打卡上线";
        var text = app.globalData.checkin_mode == 2 ? "打卡下线" : "打卡上线";
        app.globalData.checkin_mode = !(app.globalData.checkin_mode-1)+1;
        if(res.result === 1)page.setData({text:"今日打卡成功",checkin_text:"打卡已完成",checkin:true});
        else page.setData({text:text+"成功",checkin_text:checkin_text});
      }else page.setData({checkin:true,text: "检测到不在图书馆，无法打卡"});
      return resolve();
    },fail: console.error
  })
});
}

function checkTime(){
  wx.cloud.callFunction({
    // 云函数名称
    name: 'checkin',
    data: {
      wifiList: "",
      mode: "checkTime"
    },
    success: function (res) {
      console.log("获取到Time信息");
      console.log(res);
    },fail: console.error
  })
}

function checkLocaltion(page){
  wx.cloud.callFunction({
    // 云函数名称
    name: 'checkin',
    data: {
      wifiList: app.globalData.wifiList,
      location: app.globalData.location,
      mode: "checkLocation"
    },
    success: function (res) {
      console.log("获取到位置信息");
      console.log(res);
      if(res.result){
        page.setData({checkin:false,text: "按打卡签到"})
      }
    },fail: console.error
  })
}