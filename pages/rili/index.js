import {request} from "../../request/index.js";
import {config} from '../../request/config';
const util = require('../../utils/util.js')
import todo from '../../component/v2/plugins/todo'
import selectable from '../../component/v2/plugins/selectable'
import solarLunar from '../../component/v2/plugins/solarLunar/index'
import timeRange from '../../component/v2/plugins/time-range'
import week from '../../component/v2/plugins/week'
import holidays from '../../component/v2/plugins/holidays/index'
import plugin from '../../component/v2/plugins/index'
Page({
    data: {
      riliList:[],
      monthList:[],
      month:'',
      zuoyeCount:0,
      kaoshiCount:0,
      daibanCount:0,
      calendarConfig: {
        theme: 'elegant'
      },
      user:{},
    },
    onLoad: function () {

    },
    onShow:function(){
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
      let {year,month,day} = util.formatTime3(new Date());
      this.setData({
        year,
        month,
        day,
      })
        this.getRiliInfoList2(user.userId);
        this.getRiliInfoList(user.userId);
      },
      getRiliInfoList2(userId) {
        let url = '/riliInfo/today/'+userId
        url = url + '/' +this.data.year+"-"+this.data.month+"-"+this.data.day
        request({url: url}).then(res => {
            if(res.code === '0') {
                let riliList = res.data;
                let zuoyeCount = 0;
                let kaoshiCount = 0;
                let daibanCount = 0;
                riliList.forEach(item=>{
                  if(item.leixing == '作业'){
                    zuoyeCount++
                  }
                  if(item.leixing == '考试'){
                    kaoshiCount++
                  }
                  if(item.leixing == '待办'){
                    daibanCount++
                  }
                })
                this.setData({
                  riliList,
                  zuoyeCount,
                  kaoshiCount,
                  daibanCount,
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
      },
      getRiliInfoList(userId) {
        let url = '/riliInfo/toMonth/'+userId
        url = url + '/' +this.data.year+"-"+this.data.month
        request({url: url}).then(res => {
            if(res.code === '0') {
              const calendar = this.selectComponent('#calendar').calendar
              const toSet = []
              let monthList = res.data;
              monthList.forEach(item=>{
                let year = item.substring(0,4)
                let month = item.substring(5,7)
                let date = item.substring(8,10)
                toSet.push({year,month,date})
              })
              calendar.setSelectedDates(toSet)
              this.setData({
                monthList,
              })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
      },
      finishRili(e){
        const user = wx.getStorageSync('user');
        let id = e.currentTarget.dataset.id;
        let _this = this;
        wx.showModal({
          title: "提示",
          content: "确定该事件以完成吗？",
          success(res) {
            if (res.confirm) {
              request({ 
                url: '/riliInfo/finish/'+id,
                method: 'get',
                header: {
                'content-type': 'application/json' 
              }}).then(res => {
                if (res.code === "0") {
                  wx.showToast({
                    title: '操作成功',
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
      delRili(e){
        const user = wx.getStorageSync('user');
        let id = e.currentTarget.dataset.id;
        let _this = this;
        wx.showModal({
          title: "提示",
          content: "确定删除吗？",
          success(res) {
            if (res.confirm) {
              request({ 
                url: '/riliInfo/'+id,
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
      addShijian(){
        wx.navigateTo({
          url: '/pages/addShijian/index?year='+this.data.year+"&month="+this.data.month+"&day="+this.data.day,
        })
      },
      whenChangeMonth(e) {
        const user =wx.getStorageSync('user')
        let year = e.detail.next.year
        let month = e.detail.next.month
        this.setData({
          year,
          month,
        })
       this.getRiliInfoList(user.userId);
      },
      afterTapDate(e){
        const user =wx.getStorageSync('user')
        let year = e.detail.year
        let month = e.detail.month
        let date = e.detail.date
        this.setData({
          year,
          month,
          day:date
        })
        this.getRiliInfoList2(user.userId);
        this.getRiliInfoList(user.userId)
      }
});
