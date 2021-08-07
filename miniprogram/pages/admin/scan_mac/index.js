const app = getApp()
var scan_mac = require("../../include/scan_mac.js");

Page({
  data: {
    status: "扫描后將显示範圍內的mac",
    listData: [],
    success_count: 0
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '扫描Mac'
    })
  },

  bindScan: function(){
    scan_mac.getWifiList();
    this.setData({listData:app.globalData.wifiList})
    this.setData({status:"己執行掃描"})
    wx.showModal({  
      title: '',  
      content: '掃描成功',
      success: function(res) {}  
    })  
  },

  bindUpload: function(){
    var that = this;
    that.setData({status:"正在上传"})
    console.log(this.data.listData.length);
    var data_length = this.data.listData.length;
    for (var i=0;i<data_length;i++)
    { 
      wx.cloud.callFunction({
        name: 'upload',
        data: {
          wifiData: that.data.listData[i],
          mode: "upload_mac"
        },
        success: function (res) {
          var count = that.data.success_count+1;
          that.setData({success_count: count,status: "上传成功"+String(count)+"/"+String(data_length)});
        },
        fail: function(res){
          console.log("upload error");
          console.log(res);
        }
      })
    }
  }
})