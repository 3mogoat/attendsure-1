import {request} from "../../request/index.js";
import { formatTime, formatDate,addTime } from '../../utils/util.js';

Page({
  data: {
    array: ['星期一', '星期二','星期三','星期四','星期五','星期六','星期七'],
    array2: ['第一节', '第二节','第三节','第四节','第五节','第六节'],
    xingqi:'',
    jieke: '',
    didian:'',
    suojiaokecheng:'',
    suoshoujiaoshi:'',
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
  /**
   * 上传图片
   */
  uploadimg: function () {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)
        //前台显示
        that.setData({
          source: res.tempFilePaths
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url:'http://localhost:8080/img/upload.do',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            method: 'POST'   //请求方式
          },
          success: function (res) {
            var queryBean = JSON.parse(res.data);
            var fileurl = queryBean.src;
            that.setData({
              pic: fileurl,
              status:'上传成功'
             });
          }
        })
      }
    })
  },
   // 获取输入姓名
   suojiaokechengInput: function (e) {
    this.setData({
      suojiaokecheng: e.detail.value,
    })
  },
  suoshoujiaoshiInput: function (e) {
    this.setData({
      suoshoujiaoshi: e.detail.value,
    })
  },
  bindPickerChange: function (e) {
    var indexs = e.detail.value;
    this.setData({
      xingqi: this.data.array[indexs]
    })
  },
  bindPickerChange2: function (e) {
    var indexs = e.detail.value;
    this.setData({
      jieke: this.data.array2[indexs]
    })
  },
  // 注册
  login: function () {
    let user = wx.getStorageSync('user');
    var params = {
      gonghao:user.code,
      jiaoshixingming:user.userName,
      xingqi:this.data.xingqi,
      jieke: this.data.jieke,
      suojiaokecheng:this.data.suojiaokecheng,
      suoshoujiaoshi:this.data.suoshoujiaoshi,
    }
    request({
      url: '/kebiaoxinxiInfo',
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
          url: '/pages/course/index',
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