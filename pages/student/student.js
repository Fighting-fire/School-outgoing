// pages/student/student.js
var QQMapWX = require('../../tx/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'RARBZ-QXM6S-BHZO2-6H5KD-5H3FH-T4BYK' // 必填
});
let marksItem=[];
let lat=[];
let lon=[];
let p=0;
let best=0;
let way = Math.floor(Math.random() * 3);
const db = wx.cloud.database({
  //这个是环境ID不是环境名称
  env: 'outgoing-vftqo'
})
Page({
  data: {
    windowHeight: 0,
    windowWidth: 0,
    //当前需要跑的点的序号
    count: 1,
    //stduentlog传递的学生姓名,时间
    sname: null,
    //定义一个数据，主要是放集合结果的
    ne: [],
    // 地图markers界面显示
    showMarkersStatus: true,
    // 这里的lon、lat默认为中南大学南校区文法楼 ，onload里有获得当前位置
    longitude: 112.936395,
    latitude: 28.160311,
    //地图缩放级别
    scale: 18,
    //存放map-marks信息
    //存放maps信息
    mapsItem: [],
    //提示语信息
    hintMessage: '',
    //将地图中选中的marker对应的地点在list中显现
    toView: '',


    //计时器变量
    hours: '0' + 0,   // 时
    minute: '0' + 0,   // 分
    second: '0' + 0,    // 秒
    totalsecond:'0',
    runjudge:true,
    AvatarUrl: 'https://6665-feifeiniubi-cmo2o-1301607192.tcb.qcloud.la/avademo.png?sign=032b26657afd1c64dd19a5798feab256&t=1588086418',
    username: '加载中',
    score: 0,
    logthree: []
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
      if(that.data.runjudge==false) return;
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
  stopInterval: function () {
    const that = this
    var second = that.data.second
    var minute = that.data.minute
    var hours = that.data.hours
    that.setData({
      second: second,
      minute: minute,
      hours: hours,
      runjudge:false,
    })
   // clearInterval(this.data.second)
  },
  onLoad: function (options) {
    var _this = this;
    //获得studentlog传递数据
    this.setData({
      sname: options.sname,
      Sttime: options.Sttime,
      teacherName: options.teacherName,
      weekday: options.weekday,
      dateChose: options.dateChose
    })
    
    //1、引用数据库
    
    console.log("2")
    //2、开始查询数据了  news对应的是集合的名称
    db.collection('maps').get({
      //如果查询成功的话
      success: res => {
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
        this.setData({
          ne: res.data
        })
        let id=1;
        let kk=0;
        for (var index in this.data.ne) {
          if (this.data.ne[index].isNow == true) {
            id= this.data.ne[index]._id
            this.setData({
              marksItem: this.data.ne[index].markers,
            })
          }
        }
        console.log("2")
        console.log(this.data.marksItem[2].latitude)
        console.log(id)
        console.log(way)
        if(way==1)
        {
          this.setData({
            ne: [],
            marksItem:[]
          })
          db.collection('route').where({
            id:id
          }).where({
            name: "plan1"
            }).get({
            success: res => {
              console.log(res),
              
              //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
                this.setData({
                  ne: res.data
                })
              this.setData({
                marksItem: this.data.ne[kk].marker,
              })
              console.log(this.data.marksItem[2].latitude)
              for (var i = 0; i < this.data.marksItem.length; i++) {
                console.log(i)
                lat[i] = this.data.marksItem[i].latitude;
                lon[i] = this.data.marksItem[i].longitude;
                that.setData({
                  [`marksItem[${i}].callout.content`]: i,
                })
                that.setData({
                  [`marksItem[0].callout.content`]: '0',
                })
                console.log(lat[i])
              }
              for (var i = 0; i < this.data.marksItem.length - 1; i++) {
                qqmapsdk.calculateDistance({
                
                  to: [{
                    latitude: lat[i], //商家的纬度
                    longitude: lon[i], //商家的经度
                  }],

                  success: function (res) {
                    let s = res.result.elements[0].distance //拿到距离(米)
                    console.log('腾讯地图计算距离' + s);
                    best = best + s;
                    console.log(best)
                  },
                  fail(res) {
                    console.log("更新失败", res)
                  }
                });


              }
              console.log(best)
            }
          })
        }

        else if (way == 2) {
          this.setData({
            ne: [],
            marksItem: []
          })
          db.collection('route').where({
            id: id,
          }).where({
            name: "plan2"
          }).get({
            success: res => {
              console.log(res),
                //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值
                this.setData({
                  ne: res.data
                })
              this.setData({
                marksItem: this.data.ne[kk].marker,
              })
              for (var i = 0; i < this.data.marksItem.length; i++) {
                console.log(i)
                lat[i] = this.data.marksItem[i].latitude;
                lon[i] = this.data.marksItem[i].longitude;
                that.setData({
                  [`marksItem[${i}].callout.content`]: i,
                })
              }
              that.setData({
                [`marksItem[0].callout.content`]: '0',
              })
              for (var i = 0; i < this.data.marksItem.length; i++) {
                qqmapsdk.calculateDistance({
                 
                  to: [{
                    latitude: lat[i], //商家的纬度
                    longitude: lon[i], //商家的经度
                  }],

                  success: function (res) {
                    let s = res.result.elements[0].distance //拿到距离(米)
                    console.log('腾讯地图计算距离' + s);
                    best = best + s;
                    console.log(best)
                  },
                  fail(res) {
                    console.log("更新失败", res)
                  }
                });
               
               
              }
              console.log(best)
             
        
              
            }
          })
        }
        else 
        {
          for (var i = 0; i < this.data.marksItem.length; i++) {
            console.log(i)
            lat[i] = this.data.marksItem[i].latitude;
            lon[i] = this.data.marksItem[i].longitude;
            that.setData({
              [`marksItem[${i}].callout.content`]: i,
            })
            console.log(lat[i])
          }
          that.setData({
            [`marksItem[0].callout.content`]: '0',
          })
          for (var i = 0; i < this.data.marksItem.length; i++) {
            qqmapsdk.calculateDistance({
             
              to: [{
               latitude: lat[i], //商家的纬度
                longitude: lon[i], //商家的经度
              }],

              success: function (res) {
                let s = res.result.elements[0].distance //拿到距离(米)
                console.log('腾讯地图计算距离商家' + s);
                best = best + s;
                console.log(best)
              },
              fail(res) {
                console.log("更新失败", res)
              }
            });


          }
          console.log(best)
          
          
        }
        
      
        
        


        this.setData({
         /// markers:marksItem,
          showMarkersStatus: true
        })
        
       }
       
    })


    //获取当前位置
    var that = this;
    wx.getLocation({
      type: "gcj02",
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
  },
  locationViewTap: function () {
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
        var La1 = lat[p] * Math.PI / 180.0;
        var La2 = latitude * Math.PI / 180.0;
        var La3 = La1 - La2;
        var Lb3 = lon[p] * Math.PI / 180.0 - longitude * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
        s = s * 6378.137;//地球半径
        s = Math.round(s * 10000) / 10000;
        console.log(s)
        console.log(that.data.latitude)
        console.log(that.data.longitude)
        console.log(that.data.marksItem[p].latitude)
        console.log(that.data.marksItem[p].longitude)
        // if (Math.abs(that.data.latitude - that.data.marksItem[p].latitude)<0.1){
        //   if()
        // }
        if ((Math.abs(that.data.latitude - that.data.marksItem[p].latitude) < 0.1) && (Math.abs(that.data.longitude - that.data.marksItem[p].longitude) < 0.1))
        {
          p++;
          console.log(p),
          console.log(p);
          //console.log()
          //that.data.marksItem.length
          if(p==that.data.marksItem.length){
            that.stopInterval();
            console.log(that.data.totalsecond)
            
            db.collection('student').add({
              data: {
                way: way,
                name: that.data.sname,
                t_name: that.data.teacherName,
                data: that.data.dateChose + that.data.Sttime,
                time: that.data.hours + ':' + that.data.minute + ':' + that.data.second,
                t_time: that.data.second + that.data.minute * 60 + that.data.hours * 3600,
                best: that.data.best
              }
            })
          }
          wx.showToast({
            title: '打卡成功！', // 标题
            icon: 'success',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
          that.setData({
            totalsecond: that.data.second + that.data.minute * 60 + that.data.hours * 3600
          })
          //总秒数
      
        
        }
        else{
          wx.showToast({
            title: '未到达打卡点！', // 标题
            icon: 'loading',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
          
          
        }
        //打点后的变化
        for (var index in that.data.marksItem) {
          if (longitude == that.data.marksItem[index].longitude) {
            if (latitude == that.data.marksItem[index].latitude) {
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
  RunningBegin: function () {
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