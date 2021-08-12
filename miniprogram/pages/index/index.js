const app = getApp();
var login_api = require('../include/login_api.js');
var get_schedule = require('../include/get_schedule.js');
var scan_mac = require("../include/scan_mac.js");
var checkin = require("../include/checkin.js");
const check_status = require('../include/check_status.js');

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    text: "检测到不在课室，无法签到",
    checkin: true,
    checkin_text: "Checkin",
    isAdmin: false,
    list: [],
  },

  onLoad: async function() {
    var that = this;
    wx.setNavigationBarTitle({
      title: '课堂签到'
    })
    wx.getSystemInfo( {
      success: function( res ) {
        that.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });}
    });
    scan_mac.startWifi();
    scan_mac.getLocation();
    scan_mac.getWifiList().then(result=>{checkin.check(that)}); 
    // 获取用户数据
    var success = await login_api.getUserInfo(that);
    if(!success)wx.navigateTo({url: '../first_login/index'});
    else{
      this.setData({isAdmin: app.globalData.userInfo.isAdmin});
      get_schedule.getSchedule(this);
    }
    var date = new Date();
    var now = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    /*延時修改時間*/
    setTimeout(() => {
      for (let i = 0, len = this.data.list.length; i < len; ++i) {
        check_status.checkStatus(this, this.data.list[i].start_time, i);
        let h = Math.floor(this.data.list[i].start_time / 3600); let m = (this.data.list[i].start_time % 3600)/60;
        this.data.list[i].time = (h < 10? "0" + h : h) + ":" + (m < 10? "0" + m : m);
      }
    },800)
  },
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i]._id === id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({list})
  },

  //  tab切换逻辑
  swichNav: function( e ) {
      var that = this;
      if( this.data.currentTab === e.target.dataset.current ) return false;
      else that.setData( {currentTab: e.target.dataset.current})
      wx.setNavigationBarTitle({
        title: e.target.dataset.current == 0 ? '课堂签到' : "签到记录"
      })
  },
  bindChange: function( e ) {
    var that = this;
    that.setData( { currentTab: e.detail.current });
  },
  bindCheckin: function(){
    checkin.checkIn(this);
  },
  bindRefresh: function(){
    scan_mac.getWifiList().then(result=>{checkin.check(this)});
    console.log(this.data.list);
  },
  bindDevelop: function(){
    wx.navigateTo({url: 'https://github.com/JamesHoi'});
  },
  bindAdmin: function(){
    wx.navigateTo({
      url: '../admin/index',
    })
  },
  bindNotice: function(){
    wx.showModal({  
      title: '注意事项',  
      content: '1.打卡时需打开GPS和WIFI\r\n2.请于上课前十分钟，上课后五分钟内进行签到',  
      success: function(res) {}  
    })  
  }
})