const app = getApp();

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    winHeight_: 0,
    index: 0,
    index_: -1,
    date: "",
    toggle: "",
    array: ['all', 'disabled', 'roaming', 'outdated', 'done'],
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
    },
    {
      id: 'a',
      name: '表单组件',
      open: false,
      pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'picker-view', 'radio', 'slider', 'switch', 'textarea']
    }, {
      id: 'b',
      name: '导航',
      open: false,
      pages: ['navigator']
    }, {
      id: 'c',
      name: '媒体组件',
      open: false,
      pages: ['image', 'audio', 'video', 'camera']
    }
    ]
  },
  onLoad: async function() {
    var that = this;
    wx.setNavigationBarTitle({
      title: '查看紀錄'
    })
    wx.getSystemInfo( {
      success: function( res ) {
        that.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          winHeight_: res.windowHeight*0.8,
        });
      }
    })
    /*生成今天日期*/
    var date = new Date();
    var Y = date.getFullYear();
    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    this.setData({date:  Y+"-"+M+"-"+D});
  },
  /*日期*/
  bindDateChange: function(e) {
    console.log('date picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /*Filter, index為選中狀態*/
  bindFilterChange: function(e) {
    console.log('filter picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  /*Filter, index_為當前toggle選中的紀錄的狀態*/
  bindFilterChange_: function(e) {
    console.log('filter picker发送选择改变，携带值为', e.detail.value, '打开', this.data.toggle)
    this.setData({
      index_: e.detail.value
    })
  },
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
        this.setData({toggle: i, index_: i}); //index_為狀態，現以i作橂擬
      } else {
        list[i].open = false
      }
    }
    this.setData({list})
  }
})