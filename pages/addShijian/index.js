import {request} from "../../request/index.js";
import util, { formatTime, formatDate,addTime } from '../../utils/util.js';

Page({
  data: {
    riqi:'',
    array: ['作业','考试','待办'],
    leixing:'',
    shijian:''
}, 
  onLoad(options){
    let year = options.year 
    let month = options.month
    let day = options.day 
    this.setData({
      year,
      month,
      day
    })
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
    let {year,month,day} = this.data
    this.setData({
      riqi:year+'-'+month+'-'+day
    })
  },
  bindDateChange(e){
    this.setData({
      riqi: e.detail.value,
    })
  },
  bindPickerChange: function (e) {
    var indexs = e.detail.value;
    this.setData({
      leixing: this.data.array[indexs]
    })
  },
  shijianInput: function (e) {
    this.setData({
      shijian: e.detail.value,
    })
  },
  // 注册
  login: function () {
    if(!this.data.riqi){
      util.customModal("请填写日期",false)
      return
    }
    if(!this.data.leixing){
      util.customModal("请填写类型",false)
      return
    }
    if(!this.data.shijian){
      util.customModal("请填写事件",false)
      return
    }
    let user = wx.getStorageSync('user');
    var params = {
      userId:user.userId,
      riqi:this.data.riqi,
      leixing: this.data.leixing,
      shijian:this.data.shijian,
      status:'未完成'
    }
    request({
      url: '/riliInfo',
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
          url: '/pages/rili/index',
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