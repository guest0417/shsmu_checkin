module.exports = {
  getSchedule: getSchedule,
}

const app = getApp();

function getSchedule(page){
  return new Promise(resolve =>{
  wx.cloud.callFunction({
    // 云函数名称
    name: 'search',
    data: {
      class: app.globalData.userInfo.class,
      mode: "schedule"
    },
    success: function (res) {
      console.log("获取課程信息成功",res);
      page.setData({list:res.result.data});
      return resolve();
    },fail: console.error
  })
  })
}