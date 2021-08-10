module.exports = {
  login: login,
  getUserInfo: getUserInfo,
}
const app = getApp();

function login() {
  return new Promise(resolve => {
  wx.cloud.callFunction({
    name: 'search',
    data: {
      mode: "users"
    },
    success: function (res) {
      if (!res.result.data.length){
        console.log("没找到该用户信息",res);
        resolve(false);
      }
      else {
        console.log("从数据库获取user信息成功",res);
        app.globalData.userInfo = res.result.data[0];
        resolve(true);
      }
    }
  })
  })
}

function getUserInfo() {
  var that = this;
  return new Promise(resolve => {
    wx.getUserInfo({
      success: function (res) {
        that.login().then(result=>{
          resolve(result);
        });
      },
      fail: function (res) {
        console.log("获取user info失败",res);
        resolve(false);
      }
    })
  })
}