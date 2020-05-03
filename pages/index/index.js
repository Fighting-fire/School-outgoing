//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    AvatarUrl: 'https://6665-feifeiniubi-cmo2o-1301607192.tcb.qcloud.la/avademo.png?sign=032b26657afd1c64dd19a5798feab256&t=1588086418',
    windowHeight: 0,
    windowWidth: 0,
    error:"无法获取您的头像信息",
    motto: '欢迎使用智行合一',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    csu:"https://6665-feifeiniubi-cmo2o-1301607192.tcb.qcloud.la/u%3D265958750%2C3195826936%26fm%3D26%26gp%3D0%5B1%5D.jpg?sign=76b50d6648d7902d38072f25afa1979a&t=1588487951"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  chooseTap:function(){
    console.log("hhh");
    //tschoose
    wx.showActionSheet({
      itemList: ['老师','学生'],
      success: function (res) {
        if(res.tapIndex==0){
          wx.navigateTo({
            url: '../teacherlog/teacherlog'
          })
        }
        else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '../studentlog/studentlog'
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (ress) {
        console.log('windowHeight: ' + ress.windowHeight)
        console.log('windowWidith: ' + ress.windowWidth)
        that.setData({
          windowHeight: ress.windowHeight,
          windowWidth: ress.windowWidth,
        })
      },
    })
    this.getUserInfo;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

})
