import {request} from "../../request/index.js";
import { formatTime, formatDate,addTime } from '../../utils/util.js';
import {config} from "../../request/config.js";
Page({
  data: {
    hours:0,
    avatarUrl:'',
    zhaopian:'',
    shixiang:""
  },
  onShow: function (options) {
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      }) 
      wx.navigateTo({
        url: '/pages/login/index'
      });
    } else {
    }
    this.setData({
      user,
    })
  },
   // 获取输入姓名
   shixiangInput: function (e) {
    this.setData({
      shixiang: e.detail.value,
    })
  },
  hoursInput:function(e){
    this.setData({
      hours:e.detail.value,
    })
  },
  uploadimg: function () {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //前台显示
        that.setData({
          source: res.tempFilePaths
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url:'http://localhost:8888/files/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json', // 默认值
          },
          success: function (res) {
            var queryBean = JSON.parse(res.data);
            var fileurl = queryBean.data.id;
            that.setData({
              avatarUrl: config.baseFileUrl+fileurl,
              zhaopian: JSON.stringify([fileurl]),
              status:'上传成功'
             });
          }
        })
      }
    })
  },
  // 注册
  login: function () {
    let zhaopian = this.data.zhaopian
    let shixiang = this.data.shixiang
    let hours = this.data.hours
    if(!shixiang){
      wx.showToast({
        title: '请填写事项',
        icon:'error'
      })
      return;
    }
    if(!hours){
      wx.showToast({
        title: '请填写时长',
        icon:'error'
      })
      return;
    }
    if(!zhaopian){
      wx.showToast({
        title: '请上传照片',
        icon:'error'
      })
      return;
    }
    let user = wx.getStorageSync('user');
    var params = {
      zhaopian:this.data.zhaopian,
      shixiang:this.data.shixiang,
      hours:this.data.hours,
      userId:user.userId
    }
    request({
      url: '/planInfo/addByXuesheng',
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/json' 
      }}).then(res => {
      if(res.code === "0") {
        wx.showToast({
          title: '提交成功',
          icon: 'none',
        })
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  

})