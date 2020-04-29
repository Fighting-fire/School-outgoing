// pages/student/student.js

Page({
  data: {
    //当前需要跑的点的序号
    count:1,
    //stduentlog传递的学生姓名
    sname:null,
    //定义一个数据，主要是放集合结果的
    ne: [],
    // 地图markers界面显示
    showMarkersStatus: false,
  
    // 这里的lon、lat默认为中南大学南校区文法楼 ，onload里有获得当前位置
    longitude: 112.936395,
    latitude: 28.160311,
    //地图缩放级别
    scale: 18,
    //存放map-marks信息
    marksItem: [],
    //存放maps信息
    mapsItem: [],
    //提示语信息
    hintMessage: '',
    //将地图中选中的marker对应的地点在list中显现
    toView: '',

    //计时器变量
    hours: '0' + 0,   // 时
    minute: '0' + 0,   // 分
    second: '0' + 0    // 秒
  },

  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.detail.markerId)
  },
  controltap(e) {
    console.log(e.detail.controlId)
  },
  // 计时器
  setInterval: function () {
    const that = this
    var second = that.data.second
    var minute = that.data.minute
    var hours = that.data.hours
    setInterval(function () {  // 设置定时器
      second++
      if (second >= 60) {
        second = 0  //  大于等于60秒归零
        minute++
        if (minute >= 60) {
          minute = 0  //  大于等于60分归零
          hours++
          if (hours < 10) {
            // 少于10补零
            that.setData({
              hours: '0' + hours
            })
          } else {
            that.setData({
              hours: hours
            })
          }
        }
        if (minute < 10) {
          // 少于10补零
          that.setData({
            minute: '0' + minute
          })
        } else {
          that.setData({
            minute: minute
          })
        }
      }
      if (second < 10) {
        // 少于10补零
        that.setData({
          second: '0' + second
        })
      } else {
        that.setData({
          second: second
        })
      }
    }, 1000)
  },
  stopInterval: function (){
    const that = this
    var second = that.data.second
    var minute = that.data.minute
    var hours = that.data.hours
    that.setData({
      second: second,
      minute: minute,
      hours: hours
    })
  },
  onLoad: function (options) {
    var _this = this;
    //获得studentlog传递数据
    _this.setData({
      sname: options.sname,
    })
    //1、引用数据库
    const db = wx.cloud.database({
      //这个是环境ID不是环境名称
      env: 'yfhbjkk-jalnu'
    })
    //2、开始查询数据了  news对应的是集合的名称
    db.collection('maps').get({
      //如果查询成功的话
      success: res => {
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        this.setData({
          ne: res.data
        })
        for (var index in this.data.ne) {
          if (this.data.ne[index].isNow == true) {
            this.setData({
              marksItem: this.data.ne[index].markers
            })
          }
        }
        this.setData({
         /// markers:marksItem,
          showMarkersStatus: true
        })
        //随机打乱顺序
        console.log(this.data.marksItem.length)
        for (var index = 0; index < this.data.marksItem.length; index++) {
          var ran = Math.floor(Math.random() * this.data.marksItem.length);
          console.log('ran')
          this.setData({
            'marksItem[ran].content': index+1,
            'marksItem[index].content': ran,//数据路径key必须带''号
          })
        }
      }
    })

   
    //获取当前位置
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
      }
    })
    
  },
  locationViewTap:function(){
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        //console.log(res.latitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,

        })
        //打点后的变化
        for(var index in that.data.marksItem){
          if (longitude == that.data.marksItem[index].longitude){
            if (latitude == that.data.marksItem[index].latitude){
              //发生变化  比如把点变绿。。。
              console.log("0124")
            }
          }
        }
        //判断是否打点完毕
        //if(){
        //  stopInterval();
        //}
      }
    })
  },
  RunningBegin: function (){
    this.setInterval();

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

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

  }
})