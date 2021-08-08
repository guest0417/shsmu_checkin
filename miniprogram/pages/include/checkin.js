module.exports = {
  checkin: checkin,
  check: check
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
        var checkin_text = app.globalData.checkin_mode == 1 ? "Done" : "Checkin";
        app.globalData.checkin_mode = !(app.globalData.checkin_mode-1)+1;
        if(res.result === 1)page.setData({text:"簽到成功",checkin_text:"Done",checkin:true});
        else page.setData({text:"失敗，請重試",checkin_text:checkin_text});
      }else page.setData({checkin:true,text: "检测條件不符合，无法打卡"});
      return resolve();
    },fail: console.error
  })
});
}

function check(page){
  wx.cloud.callFunction({
    // 云函数名称
    name: 'checkin',
    data: {
      wifiList: app.globalData.wifiList,
      location: app.globalData.location,
      mode: "check"
    },
    success: function (res) {
      console.log("获取到時間,歷史和位置信息");
      console.log(res);
      if(res.result){
        page.setData({checkin:false, text: "按打卡签到"})
      }
    },fail: console.error
  })
}