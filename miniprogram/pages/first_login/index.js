const app = getApp()
var login_api = require('../include/login_api.js');

Page({
  data:{
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    top: 150,
    text: ""
  },
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: "注册"
    })
  },
  getUserInfo: async function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    var success = await login_api.login();
    if(success)wx.navigateTo({url: '../index/index'});
    else this.setData({hasUserInfo: true,top: 100});
  },
  submitFunc: function(e){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'upload',
      data: {
        student_name: e.detail.value.name,
        student_id: e.detail.value.id,
        nickname: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        mode: "first_login"
      },
      success: function (res) {
        if(res.result){
          console.log("成功注册用户信息，跳转到主页");
          wx.navigateTo({url: '../index/index'});
        }
        else{
          console.log("查询数据库没找到该学生信息，禁止注册",res);
          wx.showModal({  
            title: '提示',  
            content: '请确认是否填写正确姓名以及学号',  
            success: function(res) {}  
          })  
        }
      },fail: console.error
    })
  }
})