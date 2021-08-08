const app = getApp();
var login_api = require('../include/login_api.js');
var scan_mac = require("../include/scan_mac.js");
var checkin = require("../include/checkin.js");

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    text: "检测到不在课室，无法签到",
    checkin: true,
    checkin_text: "Checkin",
    isAdmin: false,
    list: [{
      id: 'view',
      name: '视图容器',
      open: false,
      pages: ['view', 'scroll-view', 'swiper', 'movable-view', 'cover-view']
    }, {
      id: 'content',
      name: '基础内容',
      open: false,
      pages: ['text', 'icon', 'progress', 'rich-text']
    }, {
      id: 'form',
      name: '表单组件',
      open: false,
      pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'picker-view', 'radio', 'slider', 'switch', 'textarea']
    }, {
      id: 'nav',
      name: '导航',
      open: false,
      pages: ['navigator']
    }, {
      id: 'media',
      name: '媒体组件',
      open: false,
      pages: ['image', 'audio', 'video', 'camera']
    }, {
      id: 'map',
      name: '地图',
      pages: ['map']
    }, {
      id: 'canvas',
      name: '画布',
      pages: ['canvas']
    }, {
      id: 'open',
      name: '开放能力',
      pages: ['ad', 'open-data', 'web-view']
    },{
    id: 'open',
      name: '开放能力',
      pages: ['ad', 'open-data', 'web-view']
    }
  ]
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
    }
  },
  
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
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
    checkin.checkin(this);
  },
  bindRefresh: function(){
    scan_mac.getWifiList().then(result=>{checkin.check(this)});
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