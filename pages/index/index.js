const util = require('../../utils/util.js')
import {request} from "../../request/index.js";
const defaultLogName = {
  work: '工作',
  rest: '休息'
}
const actionName = {
  stop: '停止',
  start: '开始'
}

const initDeg = {
  left: 45,
  right: -45,
}

Page({

  data: {
    array:[],
    time:{},
    value:"00:00:00",
    isRuning:false,
  },

  onShow: function() {
    const user = wx.getStorageSync('user');
    this.getPlanToday(user.userId);
    this.getXuexiToday(user.userId);
    console.log(util.secondsFormat(1).toFixed(2))
    console.log(util.minutesFormat(1).toFixed(2))
  },
  getPlanToday(userId) {
    request({url: '/planInfo/today/'+userId}).then(res => {
        if(res.code === '0') {
            let planList = res.data;
            let array = [];
            planList.forEach(item=>{
              array.push(item.shixiang)
            })
            this.setData({
              planList,
              array
            })
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    })
  },
  getXuexiToday(userId) {
    request({url: '/xuexiInfo/today/'+userId}).then(res => {
        if(res.code === '0') {
            let xuexiList = res.data;
            this.setData({
              xuexiList,
            })
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    })
  },
  bindPickerChange: function (e) {
    var indexs = e.detail.value;
    this.setData({
      shixiang: this.data.planList[indexs].shixiang,
      planId:this.data.planList[indexs].id
    })
  },
  startTimer: function(e) {
    if(!this.data.shixiang){
      util.customModal('请先选择一项任务', true)
      return;
    }
    var that = this
    var hour,minute,second;//时 分 秒
    hour=minute=second=0;//初始化
    hour = 1
    var millisecond=0;//毫秒
    clearInterval(this.time)
    this.setData({
      value:"00:00:00",
      isRuning:true,
    })
    this.timer = setInterval((function() {
      millisecond=millisecond+1000;
      if(millisecond>=1000){
       millisecond=0;
       second=second+1;
      }
      if(second>=60){
       second=0;
       minute=minute+1;
      }
      if(minute>=60) {
       minute=0;
       hour=hour+1;
      }   
      let value=that.toDub(hour)+':'+that.toDub(minute)+':'+that.toDub(second);
      that.setData({
        hour,
        second,
        minute,
        value
      })
    }), 1000)
  },
  stopTimer: function() {
    this.timer && clearInterval(this.timer)
    this.setData({
      isRuning:false,
    })
    let user = wx.getStorageSync('user');
    var that = this;
    let hour = this.data.hour
    let minute = this.data.minute
    let second = this.data.second
    var hour1 = util.secondsFormat(second).toFixed(2)
    var hour2 =  util.minutesFormat(minute).toFixed(2)
    let hours =  parseFloat(hour)+parseFloat(hour1)+parseFloat(hour2)
    var params = {
      planId:this.data.planId,
      hours:hours ,
      userId:user.userId
    }
    request({
      url: '/xuexiInfo',
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
        that.onShow();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  addCourse(){
    wx.navigateTo({
      url: '/pages/addPlan/index'
    });
  },
  delPlan(e){
    const user = wx.getStorageSync('user');
    let id = e.currentTarget.dataset.id;
    let _this = this;
    wx.showModal({
      title: "提示",
      content: "确定删除吗？",
      success(res) {
        if (res.confirm) {
          request({ 
            url: '/planInfo/'+id,
            method: 'DELETE',
            header: {
            'content-type': 'application/json' 
          }}).then(res => {
            if (res.code === "0") {
              wx.showToast({
                title: '删除成功',
              })
              _this.onShow();
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'error'
              })
            }
          })
        }
      }
    })
  },
  delXuexi(e){
    const user = wx.getStorageSync('user');
    let id = e.currentTarget.dataset.id;
    let _this = this;
    wx.showModal({
      title: "提示",
      content: "确定删除吗？",
      success(res) {
        if (res.confirm) {
          request({ 
            url: '/xuexiInfo/'+id,
            method: 'DELETE',
            header: {
            'content-type': 'application/json' 
          }}).then(res => {
            if (res.code === "0") {
              wx.showToast({
                title: '删除成功',
              })
              _this.onShow();
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'error'
              })
            }
          })
        }
      }
    })
  },
  toDub(n){
    return n<10?"0"+n:""+n;
  }
})
