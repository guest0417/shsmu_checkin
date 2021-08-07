Page({
  data: {
    text: "文件大小不能超过4MB,名称为班级全称",
    status: "选择档案",
    path: "",
    filename: ""
  },
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: '上传用户'
    })
  },
  downloadExcel(){
    var that = this;
    wx.cloud.downloadFile({
      fileID: 'cloud://main-8g2r7r4ea0f8b9a3.6d61-main-8g2r7r4ea0f8b9a3-1303983766/demo_0.xlsx',
      success: res => {
        // get temp file path
        console.log(res.tempFilePath)
        wx.openDocument({
          filePath: res.tempFilePath, 
          showMenu: true,
          fileType: "xlsx",
          success: res => {
            console.log("打开" + res.tempFiles.name + "成功");
          }
        })
      }
      , fail: console.error
    })
  },
  chooseExcel() {
    var that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: res=> {
        let size = res.tempFiles[0].size
        let path = res.tempFiles[0].path;
        let filename = res.tempFiles[0].name;
        if (filename.indexOf(".xls")!=-1 && size < 4194304){ 
          console.log("选择excel成功", path);
          that.setData({text: "己选择以下档案，点击可重新选择", status: filename, path: path, filename: filename});
          wx.showModal({  
          title: '读取成功',  
          content: '地址: ' + path,
          success: function(res) {}  
          }) 
        }else{
          console.log("选择excel失败", path);
          wx.showToast({
            title: "请检查文件",
            icon: "error",
            duration: 2000,
          })
        }
      }, fail: console.error
    })
  },
  uploadExcel() {
    var that = this
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime()+ '.xls',
      filePath: that.data.path,
      success: res => {
        console.log("上传成功", res.fileID)
        that.resolve(res.fileID)
      },
      fail: err => {
        console.log("上传失败", err)
      }
    })
  },
  resolve(fileId) {
    var that = this;
    var index = that.data.filename.lastIndexOf(".");
    var class_ = that.data.filename.substr(0, index);
    wx.cloud.callFunction({
      name: "upload_users",
      data: {
        fileID: fileId,
        class: class_,
      },
      success(res) {
        console.log("解析并上传成功", res)
        wx.showModal({  
          title: '解析成功',  
          content: "已上传"+ that.data.filename,
          success: function(res) {}  
          }) 
      },
      fail: err => {
        console.log("解析失败", err)
        wx.showToast({
          title: "解析失败",
          icon: "error",
          duration: 5000,
        })
      }
    })
  }
})
