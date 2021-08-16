module.exports = {
  checkIn: checkin,
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
      student_id: app.globalData.userInfo.student_id,
      mode: "checkin"
    },
    success: function (res) {
      console.log("接收到打卡反馈");
      console.log(res);
      if(res.result){
        page.setData({text:"簽到成功，點擊Refresh即可更新課表",checkin_text:"Done",checkin:true});
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
      student_id: app.globalData.userInfo.student_id,
      mode: "check"
    },
    success: function (res) {
      console.log("获取到時間,歷史和位置信息", res);
      if(res.result){
        page.setData({checkin:false, text: "按打卡签到"})
      }
    },fail: console.error
  })
}