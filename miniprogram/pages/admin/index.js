const app = getApp();

Page({
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: '管理员界面'
    })
  },
  bindScan: function(){
    wx.navigateTo({
      url: './scan_mac/index',
    })
  },
  bindUploadUsers: function(){
    wx.navigateTo({
      url: './upload_users/index',
    })
  },
  bindUploadSchedule: function(){
    wx.navigateTo({
      url: './upload_schedule/index',
    })
  },
  bindCheck: function(){
    wx.navigateTo({
      url: './check/index',
    })
  },
})