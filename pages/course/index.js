import {request} from "../../request/index.js";
import {config} from '../../request/config';
const util = require('../../utils/util.js')
Page({
    data: {
      tongzhiList:[],
      gonggaoList:[],
      array: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      index:1,
      user:{},
      colorArrays: [ "#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
      wlist: [
      ]
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
      this.getUserTextInfoList2(user.userId);
    },
    bindPickerChange: function (e) {
      var indexs = e.detail.value;
      this.setData({
        index: this.data.array[indexs]
      })
      this.onShow();
    },
      getUserTextInfoList2(userId) {
        request({url: '/kebiaoxinxiInfo/getByUserId/'+userId+"/"+this.data.index}).then(res => {
            if(res.code === '0') {
                let tongzhiList = res.data;
                let wlist = []
                tongzhiList.forEach(item=>{
                  let w = {};
                  if(item.xingqi == "星期一"){
                    w.xqj = 1
                  }
                  if(item.xingqi == "星期二"){
                    w.xqj = 2
                  }
                  if(item.xingqi == "星期三"){
                    w.xqj = 3
                  }
                  if(item.xingqi == "星期四"){
                    w.xqj = 4
                  }
                  if(item.xingqi == "星期五"){
                    w.xqj = 5
                  }
                  if(item.xingqi == "星期六"){
                    w.xqj = 6
                  }
                  if(item.xingqi == "星期日"){
                    w.xqj = 7
                  }
                  if(item.jieke == "第一节"){
                    w.skjc = 1
                  }
                  if(item.jieke == "第二节"){
                    w.skjc = 2
                  }
                  if(item.jieke == "第三节"){
                    w.skjc = 3
                  }
                  if(item.jieke == "第四节"){
                    w.skjc = 4
                  }
                  if(item.jieke == "第五节"){
                    w.skjc = 5
                  }
                  if(item.jieke == "第六节"){
                    w.skjc = 6
                  }
                  w.skcd = 1;
                  w.kcmc = item.suojiaokecheng+'@教室：'+item.suoshoujiaoshi+'@教师：'+item.jiaoshixingming+"@周"+item.zhou1+"~"+item.zhou2
                  w.id = item.id
                  wlist.push(w)
                })
                this.setData({
                  tongzhiList,
                  wlist,
                })
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
          url: '/pages/addCourse/index'
        });
      },
});
