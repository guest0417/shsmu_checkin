const app = getApp();

Page({
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: '管理员界面'
    })
  },
  bindScan: function(){
    wx.redirectTo({
      url: './scan_mac/index',
    })
  },
  bindUploadUsers: function(){
    wx.redirectTo({
      url: './upload_users/index',
    })
  },
  bindUploadSchedule: function(){
    wx.redirectTo({
      url: './upload_schedule/index',
    })
  },
  bindCheck: function(){
    wx.redirectTo({
      url: './check/index',
    })
  },
})