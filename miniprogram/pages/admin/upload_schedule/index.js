Page({
  data: {
    text: "文件大小不能超过4MB,名称为班级全称",
    status: "选择档案",
    path: "",
    filename: "",
    uploading: false
  },
  onLoad: function(){
    wx.setNavigationBarTitle({
      title: '更新课表'
    })
  },
  downloadExcel(){
    var that = this;
    wx.cloud.downloadFile({
      fileID: 'cloud://main-8g2r7r4ea0f8b9a3.6d61-main-8g2r7r4ea0f8b9a3-1303983766/demo_1.xlsx',
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
        that.setData({uploading: false});
        let size = res.tempFiles[0].size
        let path = res.tempFiles[0].path;
        let filename = res.tempFiles[0].name;
        if (filename.indexOf(".xls")!=-1 && size < 4194304){ 
          console.log("选择excel成功", path);
          that.setData({text: "已选择以下档案，点击可重新选择", status: filename, path: path, filename: filename});
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
    if(that.data.uploading)return;
    that.setData({uploading: true});
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime()+ '.xls',
      filePath: that.data.path,
      success: res => {
        console.log("上传成功", res.fileID)
        that.resolve(res.fileID)
      },
      fail: err => {
        console.log("上传失敗", err)
        that.setData({text: "出現錯誤，請重新進行上傳操作",uploading: false});
      }
    })
  },
  resolve(fileId) {
    var that = this;
    var index = that.data.filename.lastIndexOf(".");
    var class_ = that.data.filename.substr(0, index);
    wx.cloud.callFunction({
      name: "upload_schedule",
      data: {
        fileID: fileId,
        class: class_,
      },
      success(res) {
        console.log("解析并上传成功", res);
        wx.showModal({  
          title: '解析成功',  
          content: "已上传"+ that.data.filename,
          success: function(res) {}  
          }) 
        that.setData({text: "請选择下一份數據"});
      },
      fail: err => {
        console.log("解析失败", err);
        wx.showToast({
          title: "解析失败",
          icon: "error",
          duration: 5000,
        })
        that.setData({text: "出現錯誤，請重新進行上傳操作",uploading: false});
      }
    })
  }
})