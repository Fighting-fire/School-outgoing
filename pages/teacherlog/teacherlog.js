// pages/teacherlog/teacherlog.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canlog:true,
    windowHeight: 0,
    windowWidth: 0,
  },


  password: function (evt) {
    let passwordV = evt.detail.value;

    this.setData({
      canlog: passwordV != 15367947796
    })
    console.log(this.data.canlog);
  },

  sureTap: function () {
    console.log("s")
    wx.navigateTo({
      url: '../teacher/teacher'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('windowHeight: ' + res.windowHeight)
        console.log('windowWidith: ' + res.windowWidth)
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
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