module.exports = {
  checkStatus: checkStatus,
}
const app = getApp();
var date = new Date();
var now = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
function checkStatus(page, start_time, index){
  return new Promise(resolve =>{
  wx.cloud.callFunction({
    // 云函数名称
    name: 'search',
    data: {
      class: app.globalData.userInfo.class,
      mode: "status",
      start_time : "start_time"
    },
    success: function (res) {
      if(res.result.data.length && now > start_time){
        
      }
      else if(now > start_time){
        
      }
      else if(now < start_time && (start_time-now)<2400){
        
      }
      else{
        
      }
      return resolve();
    },fail: console.error
  })
});
}