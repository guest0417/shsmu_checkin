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
      let temp = page.data.list;
      if(now > start_time){
        temp[index].status = "done"
        page.setData({list:temp});
      }
      if(now < start_time && (start_time-now)<2400){
        temp[index].status = "roaming"
        page.setData({list:temp});
      }
      else{
        temp[index].status = "disabled"
        page.setData({list:temp});
      }
      console.log("更新課堂狀態成功"+temp[index].status);
    },fail: function(res){
      let temp = page.data.list;
      if(now > start_time){
        temp[index].status = "outdated"
        page.setData({list:temp});
      }
      console.log("更新課堂狀態成功"+temp[index].status);
    }
  })
}