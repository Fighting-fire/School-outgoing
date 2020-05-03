// pages/studentlog/studentlog.js
const teachers = ['梁莉', '李方坤', '陈志斌', '王晓艳', '张伟伟']
const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const times = ['1-2','3-4', '5-6', '7-8']


Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherName:'请选择您的任课老师',
    dateChose:'',
    weekday:'',
    timeChose:[{ "time": "选择时间", "status": "" }],
    sname:'ooohhh',
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
    time: false,
    calendar: [],
    width: 0,
    currentIndex: 0,
    currentTime: 0,
    timeArr: [{ "time": "8:00-9:40", "status": "1-2节" }, { "time": "10:00-11:40", "status": "3-4节" }, { "time": "14:00-15:40", "status": "5-6节" }, { "time": "16:00-17:40", "status": "7-8节" }],
    location: "选择上课地点",
    level: '选择老师',
    //发起运动的文字内容
    toView: '',
    show: false,
    //状态栏高度
    windowHeight: 0,
    windowWidth: 0,
    //列表中体育项目
    value1: 0,
    value2: 'a'
  },
  studentNameInput:function(e){
    console.log(this.data.sname);
    this.setData({ 
      sname: e.detail.value 
    });
    console.log(this.data.sname);
  },
  chooseTap: function (e) {
    //teacherchoose
    var list=['梁莉', '李方坤', '陈志斌', '王晓艳', '张伟伟'];
    var that = this;
    wx.showActionSheet({
      itemList: list,
      success: function (res) {
        console.log(res.tapIndex);
        that.setData({
          teacherName: list[res.tapIndex]
        });
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
    if (this.data.sname == 'ooohhh') {
      wx: wx.showToast({
        title: '请输入姓名'
      })
      return false
    }
    else if (this.data.teacherName == '请选择您的任课老师'){
      wx: wx.showToast({
        title: '请选择教师'
      })
      return false
    }
    // else if(){
    //   wx: wx.showToast({
    //     title: '请选择时间'
    //   })
    // }
    else{
      console.log(this.data.sname);
      wx.navigateTo({
        url: '../student/student?sname=' + this.data.sname + '&Sttime=' + this.data.timeChose[0].status + '&teacherName=' + this.data.teacherName + '&weekday=' + this.data.weekday + '&dateChose=' + this.data.dateChose,
      })
    }
  },

  setlocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
    })
  },
  toView: function () {
    this.setData({
      toView: view,
    })
  },
  selectlevel: function (e) {
    let i = e.currentTarget.dataset.index
    this.setData({
      level: this.data.listItem[i]
    })

  },
  showPopup() {
    this.setData({ show: true });
  },
  choose_time() {
    this.setData({ time: true });
  },
  onClose() {
    this.setData({ show: false, time: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    function getThisMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    }
    // 计算每月第一天是星期几
    function getFirstDayOfWeek(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    }
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_date = date.getDate();
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    //利用构造函数创建对象
    console.log(date);
    var monthLength = getThisMonthDays(cur_year, cur_month)
    function calendar(date, week) {
      if (i > monthLength) {
        this.date = cur_year + '-' + (parseInt(cur_month) + 1) + '-' + date % monthLength;
      }
      else {
        this.date = cur_year + '-' + cur_month + '-' + date;
      }
      //if (date == cur_date) {
      //   this.week = "今天";
      // } else if (date == cur_date + 1) {
      //   this.week = "明天";
      // } else {
        this.week = '星期' + week;
      //}
      
    }
    //当前月份的天数

    //当前月份的第一天是星期几
    var week = getFirstDayOfWeek(cur_year, cur_month)
    var x = week;
    for (var i = 1; i <= monthLength + 7; i++) {
      //当循环完一周后，初始化再次循环
      if (x > 6) {
        x = 0;
      }
      //利用构造函数创建对象
      that.data.calendar[i] = new calendar(i, [weeks_ch[x]][0])
      x++;
    }
    //限制要渲染的日历数据天数为7天以内（用户体验）
    var flag = that.data.calendar.splice(cur_date, 7)
    that.setData({
      calendar: flag
    })
    //设置scroll-view的子容器的宽度
    that.setData({
      width: 186 * parseInt(7)
    })
    // console.log(app.globalData)
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
  //获取高度
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

  },
  select: function (event) {
    console.log(event.currentTarget.dataset.index)
    //为上半部分的点击事件
    this.setData({
      currentIndex: event.currentTarget.dataset.index,
      dateChose: this.data.calendar[event.currentTarget.dataset.index].date,
      weekday: this.data.calendar[event.currentTarget.dataset.index].week
    })

  },
  selectTime: function (event) {
    //为下半部分的点击事件
    console.log(event.currentTarget.dataset.tindex)
    this.setData({
      currentTime: event.currentTarget.dataset.tindex,
      'timeChose[0].time': this.data.timeArr[event.currentTarget.dataset.tindex].time,
      'timeChose[0].status': this.data.timeArr[event.currentTarget.dataset.tindex].status,
      //{{ timeChose[0].time }}\n{{ timeChose[0].status }}
    })
  }
})