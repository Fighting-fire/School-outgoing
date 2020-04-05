// pages/teacher/teacher.js
//用于获取屏幕信息 适配屏幕大小
let windowHeight = 0;
//监听list是否展开
let isListUnfold = true;
//调试时打印信息、上线时设为false
let consoleUtil = require('../../utils/util.js');
// 存储打点信息
let markerlist = [];
let marker = {};
let markerid = 0;
let mapid = 0;

// 获取数据库引用
const db = wx.cloud.database();
const maps = db.collection('maps');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 总界面显示
    showNewStatus: true,
    // 新建界面动画显示
    showModalOneStatus: false,
    // 管理界面动画显示
    showModalTwoStatus: false,
    // 地图界面显示
    showMapStatus: false,
    //地图、提示、列表高度
    mapHeight: 0,
    hintHeight: 0,
    operateHeight: 0,
    //地图名字
    mapname: "none",
    // 这里的lon、lat默认为中南大学南校区文法楼
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
    arrsrc: '../../img/arrDown.png',

  },
  powerDrawerOne: function (evt) {
    //获取该对象的statu
    let currentStatu = evt.currentTarget.dataset.statu;
    mapid = evt.currentTarget.dataset.id;
    // console.log(currentStatu);
    // console.log(mapid);
    this.utilOne(currentStatu)
  },

  powerDrawerTwo: function (evt) {
    //获取该对象的statu
    let currentStatu = evt.currentTarget.dataset.statu;
    this.utilTwo(currentStatu)
  },

  /** 
     * 显示mapview
     */
  toMap: function () {
    this.setData({
      showNewStatus: false,
      showMapStatus:true,
    })
  },

  /** 
     * 弹出动画
     */
  utilOne: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    let animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalOneStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalOneStatus: true
        }
      );
    }
  },

  utilTwo: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    let animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalTwoStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalTwoStatus: true
        }
      );
    }
  },


  /** 
     * 获取用户设备屏幕高度
     */
  getWindowHeight: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var statusBarHeight = res.statusBarHeight;
        var titleBarHeight;
        // 确定titleBar高度（区分安卓和苹果
        if (wx.getSystemInfoSync().system.indexOf('iOS') > -1) {
          titleBarHeight = 44
        } else {
          titleBarHeight = 48
        }
        windowHeight = res.windowHeight - statusBarHeight - titleBarHeight
        that.setData({
          statusBarHeight: statusBarHeight,
          titleBarHeight: titleBarHeight,
          // setMapHeight
          menuHeight: windowHeight * 0.06,
          hintHeight: windowHeight * 0.07 - 1, //  for border-bottom: 1px
          listHeight: windowHeight * 0.38,
          mapHeight: windowHeight * 0.49,
          arrsrc: '../../img/arrDown.png',
        })
      },
    })
  },

  scopeSetting: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        //地理位置
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              that.moveToLocation();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '定位失败，你未开启定位权限，点击开启定位权限',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {
                        if (res.authSetting['scope.userLocation']) {
                          that.moveToLocation();
                        } else {
                          consoleUtil.log('用户未同意地理位置权限')
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          that.moveToLocation();
        }
      }
    })
  },

  /**
     * 请求用户所在地理位置、并移动到地图中心
     */
  moveToLocation: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 16,
        })
      },
    })
  },

  /**
  * 缩放比例使得标点能全部显现
  */
  includePoints: function () {
    var that = this
    this.mapCtx.includePoints({
      padding: [80],
      points: this.data.marksItem
    })
  },


  onReady: function () {
    consoleUtil.log('onReady--------------------->');
    this.mapCtx = wx.createMapContext('myMap');
    this.includePoints()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    consoleUtil.log('onShow--------------------->');
    this.getWindowHeight();
    markerid = 1;
    let that = this;
    //获取maps集合
    maps.get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log(res.data)
        that.setData({
          mapsItem:res.data,
        })
        // console.log(that.data.mapsItem)
      }
    })

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

  /**
   * 改变列表的状态
   */
  changeListStatus: function () {
    if (this.data.isAboutShown) {
      return;
    }
    if (isListUnfold) {
      this.setData({
        listHeight: 0,
        mapHeight: windowHeight * 0.87,
        arrsrc: '../../img/arrUp.png',
      })
    } else {
      this.setData({
        listHeight: windowHeight * 0.38,
        mapHeight: windowHeight * 0.49,
        arrsrc: '../../img/arrDown.png',
      })
    }
    isListUnfold = !isListUnfold
    if (this.data.id == '') {
      // 这里延时调用includePoints是因为上面的setData的mapHeight改变有点慢
      // 若不延时 则导致includePoints的padding错误
      // 但延时处理也有瑕疵
      // 如果mapHeight的更新速度仍然小于延时时间 则padding也有误
      setTimeout(function () {
        this.includePoints()
      }.bind(this), 40);
    }
  },

/**
   * 获得mapname
   */
  mapName: function(evt){
    let name = evt.detail.value;
    this.setData({
      mapname: name
    })
    // console.log(this.data.mapname);
  },

/**
   * 添加markers
   */
  addMakers: function () {
    markerid++;
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        marker = {
          id: markerid,
          markerlat: res.latitude,
          markerlon: res.longitude,
          iconPath: '../../img/location.png',
          width: 27,
          height: 40,
          callout: {
            content: ''
          }
        }
        markerlist.push(marker)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 16,
          marksItem: markerlist,
        })
      },
    })
  },

 /** 
     * 将地图信息提交至数据库
     */
  saveMakers:function(){
    maps.add({
      data:{
        name:this.data.mapname,
        markers: this.data.marksItem,
        isNow:false,
      },
      success(res){
        console.log("提交成功",res)
      },
      fail(res){
        console.log("提交失败",res)
      }
    })
  },

  /** 
     * 显示newview
     */
  outMakers: function () {
    this.setData({
      showNewStatus: true,
      showMapStatus: false,
      showModalOneStatus:false
    })
  },

  changeMap:function(evt){
    // console.log(mapid);
    wx.navigateTo({
      url: '../map/map?mapid=' + mapid
    })
  },

  nowMap:function(){
    console.log(mapid);
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update',
      // 传给云函数的参数
      data: {
      },
      success: function (res) {
        console.log(res)
        maps.doc(mapid).update({
          data: {
            isNow: true,
          },
          success(res) {
            console.log("更新成功", res)
          },
          fail(res) {
            console.log("更新失败", res)
          }
        })
      },
      fail: console.error
    })
   
    // maps.doc(mapid).update({
    //   data: {
    //     isNow: true,
    //   },
    //   success(res) {
    //     console.log("更新成功", res)
    //   },
    //   fail(res) {
    //     console.log("更新失败", res)
    //   }
    // })
  },

  deleteMap:function(){
    maps.doc(mapid).remove({
      success(res) {
        console.log("删除成功", res)
      },
      fail(res) {
        console.log("删除失败", res)
      }
    })
    
  },
})