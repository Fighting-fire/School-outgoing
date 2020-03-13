// pages/studentlog/studentlog.js
const teachers = ['梁莉', '李方坤', '陈志斌', '王晓艳', '张伟伟']
const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const times = ['1-2','3-4', '5-6', '7-8']


Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    multiArray: [['周日', '周一', '周二', '周三', '周四', '周五', '周六'], ['1-2', '3-4', '5-6', '7-8']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '周一'
        },{
          id: 1,
          name: '周二'
        },{
          id: 2,
          name: '周三'
        }, {
          id: 3,
          name: '周四'
        }, {
          id: 4,
          name: '周五'
        }, {
          id: 5,
          name: '周六'
        }, {
          id: 6,
          name: '周日'
        },
      ], [
        {
          id: 0,
          name: '1-2'
        },
        {
          id: 1,
          name: '3-4'
        },
        {
          id: 2,
          name: '5-6'
        },
        {
          id: 3,
          name: '7-8'
        }
      ]
    ],

  },
  chooseTap: function () {
    //teacherchoose
    wx.showActionSheet({
      itemList: ['梁莉', '李方坤', '陈志斌', '王晓艳', '张伟伟'],
      success: function (res) {
        console.log(res.tapIndex);
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

  sureTap: function(){
    let name = this.nameinput;
    console.log(name);
    if (name == undefined) {
      wx: wx.showToast({
        title: '请输入姓名'
      })
      return false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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