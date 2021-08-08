const app = getApp()
var scan_mac = require("../../include/scan_mac.js");

Page({
  data: {
    status: "扫描后将显示范围內的mac",
    listData: [],
    success_count: 0,
    uploading: false
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '扫描Mac'
    })
  },

  bindScan: function(){
    scan_mac.getWifiList();
    this.setData({listData:app.globalData.wifiList});
    this.setData({status:"已扫描到" + app.globalData.wifiList.length + "個Mac地址",success_count:0,uploading:false});
  },

  bindUpload: function(){
    var that = this;
    if(that.data.uploading)return;
    that.setData({uploading: true,status:"正在上传"})
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
          that.setData({success_count: count,status: "成功上传 "+String(count)+"/"+String(data_length)});
        },
        fail: function(res){
          that.setData({success_count: count,status: "上传失败 "});
          console.log("upload error",res);
        }
      })
    }
    wx.showModal({
      title: "所有數據已被成功上傳",
      icon: "success",
    })
  }
})