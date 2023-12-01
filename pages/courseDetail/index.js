import {request} from '../../request/index.js'
import {config} from '../../request/config'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: {},
    goodsId: 0,
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    const id = options.id;
    this.setData({
      id: id,
      user:user,
    })
    // 获取数据
    this.getDetail(id);
  },
  getDetail(id) {
    request({url: '/kebiaoxinxiInfo/' + id}).then(res => {
      if(res.code === '0') {
        let obj = res.data;
        this.setData({
          obj
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  bianji(){
    wx.navigateTo({
      url: '/pages/editCourse/index?id='+this.data.obj.id
    });
  },
  fabu(){
    wx.navigateTo({
      url: '/pages/addQiandao/index?id='+this.data.obj.id
    });
  },
  del(){
    request({
      url: '/kebiaoxinxiInfo/'+this.data.obj.id,
      method: 'DELETE',
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
  }
})