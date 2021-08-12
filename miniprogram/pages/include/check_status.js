module.exports = {
  checkStatus: checkStatus,
}
const app = getApp();
var date = new Date();
var now = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
function checkStatus(page, start_time, index){
  wx.cloud.callFunction({
    // 云函数名称
    name: 'search',
    data: {
      class: app.globalData.userInfo.class,
      mode: "status",
      start_time : "start_time"
    },
    success: function (res) {
      if(now > start_time){
        let temp = page.data.list;
        temp[index].status = "done"
        page.setData({list:temp});
      }
      if(now < start_time && (start_time-now)<2400){
        let temp = page.data.list;
        temp[index].status = "roaming"
        page.setData({list:temp});
      }
      else{
        let temp = page.data.list;
        temp[index].status = "disabled"
        page.setData({list:temp});
      }
    },fail: function(res){
      if(now > start_time){
        let temp = page.data.list;
        temp[index].status = "outdated"
        page.setData({list:temp});
      }
    }
  })
}