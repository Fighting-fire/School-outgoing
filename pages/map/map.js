// pages/about/about.js

//用于获取屏幕信息 适配屏幕大小
let windowHeight = 0;
//监听list是否展开
let isListUnfold = true;
//调试时打印信息、上线时设为false
let consoleUtil = require('../../utils/util.js');
//储存地图信息
let markerlist = [];
let marker = {};
// 存储打点信息
let markerid = 0;
let mapid = 0;
let id = 100;


// 获取数据库引用
const db = wx.cloud.database();
const maps = db.collection('maps');
const _ = db.command;

Page({

  data: {
    //状态栏和标题栏的高度
    // statusBarHeight: 0,
    // titleBarHeight: 0,
    //地图、提示、列表高度
    mapHeight: 0,
    hintHeight: 0,
    operateHeight: 0,
    // 这里的lon、lat默认为当前地址
    longitude: 118.09797,
    latitude: 36.95933,
    //地图缩放级别
    scale: 18,
    //存放list-item信息
    marksItem: [],
    //地图id
    mapId:'',
    //提示语信息
    hintMessage: '',
    //将地图中选中的marker对应的地点在list中显现
    toView: '',
    arrsrc: '../../img/arrDown.png',
    //用于菜单栏点击变色
    id: '',
    //用于打开关于我们界面
    isAboutShown: false,
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
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //   this.getTabBar().setData({
    //     selected: 1
    //   })
    // }
    consoleUtil.log('onShow--------------------->');
    // this.markoperation()
  },

  onReady: function () {
    consoleUtil.log('onReady--------------------->');
    let that = this;
    that.getWindowHeight();
    that.mapCtx = wx.createMapContext('myMap');
    that.includePoints();
    //查询相关
    maps.where({
      _id: that.data.mapId
    }).get({
      success: function (res) {
        console.log("success...")
        // console.log(res.data)
        mapid = res.data[0]._id
        markerid = res.data[0].markers.length
        // console.log(markerid)
        markerlist = res.data[0].markers
        that.setData({
          marksItem: markerlist,
        })
        console.log(that.data.marksItem)
      },
      fail: function (res) {
        console.log("fail...")
      }
    })
    that.includePoints()
  },
  
  markoperation:function(){
    let that = this;
    that.setData({
      latitude: res.latitude,
      longitude: res.longitude,
      scale: 16,
      marksItem: markerlist,
    })
    console.log(that.data.marksItem)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  // 接受teacher页面传值
  onLoad: function (options) {
    consoleUtil.log('onLoad--------------------->');
    
    let that = this;
    that.setData({
      mapId:options.mapid
      // 返回"xxx"值
      // mapId: options.mapid
      // 返回mapid:"xxx"键值对
      // mapId: options
    })
    console.log(that.data.mapId)

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

  powerDrawer: function (evt) {
    let currentStatu = evt.currentTarget.dataset.statu;
    id = evt.markerId;
    // console.log(id)
    this.util(currentStatu)
  },

  util: function (currentStatu) {
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
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
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
     * 添加点
     */
  addMarkers: function () {
    let that = this;
    markerid++;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        marker = {
          id: markerid,
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '../../img/location.png',
          width: 27,
          height: 40,
          isend:false,
          callout: {
            content: ''
          }
        }
        markerlist.push(marker)
        console.log(markerlist)
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
     * 保存点
     */
  saveMarkers: function () {
    this.setData({
      scale: 16,
      marksItem: markerlist,
    })
  },

 /** 
     * 删除点
     */
  deleteMarkers:function(evt){
    console.log(markerlist)
    for (let i = 0; i < markerlist.length; i++) {
      if (markerlist[i].id == id){
        markerlist.splice(i, 1);
      }
    }
    console.log(markerlist)
    console.log('删除成功')
  },

  /** 
      * 设为集合点
      */
  endMarkers: function (evt) {
    for (let i = 0; i < markerlist.length; i++) {
      markerlist[i].isend = false;
      if (markerlist[i].id == id) {
        markerlist[i].isend = true;
      }
    }
    console.log(markerlist)
    console.log('设置成功')
  },


  /** 
     * 退出并将地图信息提交至数据库
     */
  outMarkers: function () {
    let that = this
    maps.doc(mapid).update({
      data: {
        markers: that.data.marksItem,
      },
      success(res) {
        console.log("更新成功", res)
      },
      fail(res) {
        console.log("更新失败", res)
      }
    })
    wx.navigateTo({
      url: '../teacher/teacher'
    })
  }
})