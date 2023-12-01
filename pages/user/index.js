import {request} from "../../request/index.js";
import {config} from "../../request/config.js";
const util = require('../../utils/util.js')
Page({
  data: {
    isLogin: 0,//1登陆0未登陆
    userinfo:{},//用户
    avatarUrl:'',//头像
    price:0,
    array: ['学生'],
    leixing: '学生',
    name:'',
    code:'',
  },
  //登陆
  login:function(userinfo){
    let data = {name:userinfo.nickName, password: 123456}
    request({url:"/login", data:data, method:"POST"}).then(res => {
      if (res.code === "0") {
        console.log("登陆成功之后："+res.data);
        wx.showToast({
          title: '登陆成功',
          mask: true
        })
        //获取后存储本地数据
        this.setData({
          isShow: false,
          isLogin:1,
          userinfo: res.data,
        });
        // 存到localStorage里
        wx.setStorageSync('user', res.data)
      }else{
        wx.showToast({
          title: '登陆失败',
          mask: true
        })
      }
    })
  },
  onShow(){
    let user = wx.getStorageSync('user');
    if (user) {
      this.setData({
        isLogin: 1,
        userinfo: user,
      })
      if(user.zhaopian){
        let zhaopian = JSON.parse(user.zhaopian)
        if(zhaopian.length>0){
          this.setData({
            avatarUrl:config.baseFileUrl+zhaopian[0]
          })
        }
      }
    }else{
      wx.navigateTo({
        url: '/pages/login/index'
      });
    }
    wx.request({
      url: 'http://localhost:8888' + '/yonghu/'+user.id,
      method: 'get',
      success: res2 => {
          if (res2.data.code != '0') {
              util.customModal(res2.data.msg, true)
              return;
          }
         let userinfo = res2.data.data
         wx.setStorageSync('user',userinfo);
          this.setData({
              userinfo:res2.data.data
          })
      },
      complete: function () {
          wx.hideLoading()
      }
  })
  },
  bindPickerChange: function (e) {
    var indexs = e.detail.value;
    this.setData({
      leixing: this.data.array[indexs]
    })
  },
  recharge() {
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      // 跳转到 充值页面
      wx.navigateTo({
        url: '/pages/pay/index'
      });
    }
  },
  navigateToOrder(e) {
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      let status = e.currentTarget.dataset.status;
      // 跳转到 订单页面
      wx.navigateTo({
        url: '/pages/orderInfo/index?status=' + status
      });
    }
  },
  navigateToXuexiao(e){
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/userinfo/index'
      });
    }
  },
  navigateToqingjia(e) {
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/qingjia/index'
      });
    }
  },
  navigateToCollect(e){
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      // 跳转到 地址页面
      wx.navigateTo({
        url: '/pages/collect/index',
      });
    }
  },
  navigateToCart(e){
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      // 跳转到 地址页面
      wx.navigateTo({
        url: '/pages/resetPass/index',
      });
    }
  },
  navigateToChuru(e){
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      // 跳转到 地址页面
      wx.navigateTo({
        url: '/pages/orderInfo/index',
      });
    }
  },
  navigateToAddress(e) {
    let user = wx.getStorageSync('user');
    if (!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      // 跳转到 地址页面
      wx.navigateTo({
        url: '/pages/address/index',
      });
    }
  },
  exitAccount:function(event){
    wx.showModal({
      title: '提示',
      content: '点击确定将退应用',
      showCancel: true,
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //清理数据(全局用户数据)
          wx.removeStorageSync("user")
          wx.removeStorageSync("userId")
          wx.removeStorageSync("userName")
          wx.showToast({
            title: '退出成功!',
          })
          wx.reLaunch({
            url: '../login/index',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    })
  },
  nameInput: function (e) {
    this.setData({name: e.detail.value})
},
codeInput: function (e) {
    this.setData({code: e.detail.value})
},
  formSubmit() {
    let name = this.data.name
    let code = this.data.code
    let leixing = this.data.leixing

    if (!name) {
        util.customModal('姓名不能为空', true)
        return;
    }

    if (!code) {
        util.customModal('工号不能为空', true)
        return;
    }

    wx.showLoading({title: '加载中'})
    wx.request({
        url: 'http://localhost:8888' + '/yonghu/bindUser',
        method: 'post',
        data: {
            name: name,
            code: code,
            level: leixing,
            yonghuId:this.data.userinfo.id
        },
        success: res => {
            if (res.data.code != '0') {
                util.customModal(res.data.msg, true)
                return;
            }
            // 绑定成功
            this.setData({verify: 1})
            wx.setStorageSync('verify',1);
            wx.request({
                url: 'http://localhost:8888' + '/yonghu/'+this.data.userinfo.id,
                method: 'get',
                success: res2 => {
                    if (res2.data.code != '0') {
                        util.customModal(res2.data.msg, true)
                        return;
                    }
                   let userinfo = res2.data.data
                   wx.setStorageSync('user',userinfo);
                    this.setData({
                        userinfo:res2.data.data
                    })
                },
                complete: function () {
                    wx.hideLoading()
                }
            })
        },
        complete: function () {
            wx.hideLoading()
        }
    })

},
})