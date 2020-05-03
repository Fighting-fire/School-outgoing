// pages/teacher/teacher.js
//用于获取屏幕信息 适配屏幕大小
let windowHeight = 0;
//监听list是否展开
let isListUnfold = true;
//调试时打印信息、上线时设为false
let consoleUtil = require('../../utils/util.js');
// 存储打点信息
let markerlist = [];
let mapslist = [];
let marker = {};
let markerid = 0;
let mapid = 0;
let id = 100;
let plan1 = [];
let plan2 = [];

// 获取数据库引用
const db = wx.cloud.database();
const maps = db.collection('maps');
const student= db.collection('student')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAboutShown: false,
    show1: false,
    upclass: "cuIcon-unfold",
    downclass: "cuIcon-fold",
    uptext: "显示隐藏按钮",
    downtext: "隐藏下列按钮",
    button: true,
    imgUrl: '../../images/warm-bg.jpg',
    temp: 15,
    level: "选择地图",
    listItem: ["难", "中", "易"],
    show: false,
    // 总界面显示
    showNewStatus: true,
    // 新建界面动画显示
    showModalOneStatus: false,
    // 管理界面动画显示F
    showModalTwoStatus: false,
    // 气泡界面动画显示
    showModalTriStatus: false,
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
    mainActiveIndex: 0,
    activeId: null,
    //成绩文件地址
    fileUrl:"",
    isAboutShown: false,
    plan0: [],
    plan1: [],
    plan2: []
  },
  onClose1() {
    this.setData({ show1: false });
  },
  showPopup() {
    this.setData({ show: true });
    // wx.navigateTo({
    //   url: "../map/map"
    // })
  },

  // selectlevel: function (e) {
  //   let i = e.currentTarget.dataset.index
  //   this.setData({
  //     level: this.data.listItem[i]
  //   })
  // },
  howPopup() {
    this.setData({ show: true });
    // wx.navigateTo({
    //   url: "../map/map"
    // })
  },
  showPopup1() {
    this.setData({ show1: true });
    // wx.navigateTo({
    //   url: "../map/map"
    // })
  },
  onClose() {
    this.setData({ show: false });
  },
  toView: function () {
    this.setData({
      toView: view,
    })
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    });
  },

  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({ activeId });
  },

  powerDrawerOne: function (evt) {
    //获取该对象的statu
    let i = evt.currentTarget.dataset.index
    this.setData({
      level: this.data.listItem[i]
    })
    let currentStatu = evt.currentTarget.dataset.statu;
    mapid = evt.currentTarget.dataset.id;
    // console.log(currentStatu);
    // console.log(mapid);
    this.utilOne(currentStatu)
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
  },

  powerDrawerTwo: function (evt) {
    //获取该对象的statu
    let currentStatu = evt.currentTarget.dataset.statu;
    this.utilTwo(currentStatu)
  },

  powerDrawerTri: function (evt) {
    let currentStatu = evt.currentTarget.dataset.statu;
    id = evt.markerId;
    // console.log(id)
    this.utilTri(currentStatu)
  },

  utilTri: function (currentStatu) {
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
            showModalTriStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalTriStatus: true
        }
      );
    }
  },


  /** 
     * 显示mapview
     */
  toMap: function (evt) {
    // console.log(this.data.mapsItem)
    // console.log(this.data.mapname)
    let exist = 0
    for (let i = 0; i < this.data.mapsItem.length; i++) {
      if (this.data.mapsItem[i].name == this.data.mapname) {
        wx.showToast({
          title: '该地图名已存在哦~',
          icon:"none",
        })
        exist = 1
      }
    }
    if(exist==0){
      wx.clearStorage()
      markerlist = []
      this.setData({
        showModalOneStatus: false,
        showNewStatus: false,
        showMapStatus: true,
        marksItem:[],
      })
    }
  },

  onLoad: function (options) {
    var that = this
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
    let that = this;
    //获取maps集合
    maps.get({

      success: function (res) {
        var temp = [];
        console.log(temp);
        let j = 0;
        for (j = 0; j < res.data.length; j++) {
          temp.push(res.data[j].name)
        }

        console.log(temp)
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条\
        that.setData({
          mapsItem: res.data,
          listItem: temp
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
        button: false,
      })
    } else {
      this.setData({
        button: true,
        listHeight: windowHeight * 0.38
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
  mapName: function (evt) {
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
        // console.log(markerlist)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 16,
          marksItem: markerlist,
        })
        console.log(that.data.marksItem)
      },
    })
  },

  /** 
      * 保存
      */
  saveMakers: function () {
    this.setData({
      scale: 16,
      marksItem: markerlist,
    })
  },

  /** 
     * 显示newview并将地图信息提交至数据库
     */
  outMakers: function () {
    maps.add({
      data: {
        name: this.data.mapname,
        markers: this.data.marksItem,
        isNow: false,
      },
      success(res) {
        console.log("提交成功", res)
      },
      fail(res) {
        console.log("提交失败", res)
      }
    })
    this.setData({
      showNewStatus: true,
      showMapStatus: false,
      showModalOneStatus: false,
      showModalTwoStatus:false,
    })
    this.onShow()
  },

  changeMap: function (evt) {
    console.log(mapid);
    wx.navigateTo({
      url: '../map/map?mapid=' + mapid
    })
    console.log("success");
  },

  nowMap: function () {
    
    console.log(this.data.mapsItem[0]._id);
    let i = 0
    let id
    let length = this.data.mapsItem.length
    
    for (i = 0; i < length; i++) {
      id = this.data.mapsItem[i]._id
      db.collection('maps').doc(id).update({
        data: {
          isNow: false
        },
        success(res) {
          console.log("获取数据成功")
        },
        fail(res) {
          console.log("获取数据失败")
        }
      })
    }
    
    wx.cloud.callFunction({
      name: "changemapstate",
      data: {
        id: mapid
      },
      success(res) {
        console.log("发送数据成功", res)
      },
      fail(res) {
        console.log("发送数据失败", res)
      }
    })
    console.log(this.data.mapid)
    db.collection('route').where({
      id: mapid
    }).get({
      //console.log()
      success: function (res) {
        if(res.data.length==0){
          wx: wx.showToast({
            title: '请设置集合点'
          })
        }
        else{
          wx: wx.showToast({
            title: '设置成功'
          })
          db.collection('maps').doc(mapid).update({
            // data 传入需要局部更新的数据
            data: {
              isNow: true
            }
          })
        }
        
        console.log(res)
      },
      fail: function (res) {
       
        console.log(res)
      }
    })
  },


  deleteMap: function () {
    maps.doc(mapid).remove({
      success(res) {
        console.log("删除成功", res)
      },
      fail(res) {
        console.log("删除失败", res)
      }
    })
    this.onShow()
  },

  /** 
      * 删除点
      */
  deleteMarkers: function (evt) {
    console.log(markerlist)
    for (let i = 0; i < markerlist.length; i++) {
      if (markerlist[i].id == id) {
        markerlist.splice(i, 1);
      }
    }
    this.setData({
      scale: 16,
      marksItem: markerlist,
      showModalTriStatus: false,
    })
    console.log(this.data.marksItem)
  },

  /** 
      * 设为集合点
      */
  endMarkers: function (evt) {
    let that = this;
    for (let i = 0; i < markerlist.length; i++) {
      markerlist[i].isend = false;
      if (markerlist[i].id == id) {
        markerlist[i].isend = true;
        let exchange = markerlist[i];
        markerlist[i] = markerlist[markerlist.length - 1];
        markerlist[markerlist.length - 1] = exchange;
        //保证最后一个点为集合点（是不是可以把isend给去了呢？）
      }
    }
    //生成路线规划
    let point = markerlist.length;
    for (let i = 0; i < markerlist.length - 1; i++) {
      plan1[i] = markerlist[i + 1]
    }
    plan1[markerlist.length - 2] = markerlist[0]
    plan1[markerlist.length - 1] = markerlist[markerlist.length - 1]
    for (let i = 1; i < markerlist.length - 2; i++) {
      plan2[i] = markerlist[i + 1]
    }
    plan2[0] = markerlist[0]
    plan2[markerlist.length - 2] = markerlist[1]
    plan2[markerlist.length - 1] = markerlist[markerlist.length - 1]
    db.collection('route').add({
      data: {
        marker: plan1,
        id: mapid,
        name: "plan1"
      }
    })
    db.collection('route').add({
      data: {
        marker: plan2,
        id: mapid,
        name: "plan2"
      }
    })
    this.setData({
      scale: 16,
      marksItem: markerlist,
      showModalTriStatus: false,
    })
    console.log(markerlist)
    console.log('设置成功')
  },

  
  //把数据保存到excel里，并把excel保存到云存储
  savaExcel(userdata) {
    let that = this
    wx.cloud.callFunction({
      name: "excel",
      data: {
        userdata: userdata
      },
      success(res) {
        console.log("保存成功", res)
        that.getFileUrl(res.result.fileID)
      },
      fail(res) {
        console.log("保存失败", res)
      }
    })
  },

  //获取云存储文件下载地址，这个地址有效期一天
  getFileUrl(fileID) {
    let that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        console.log("文件下载链接", res.fileList[0].tempFileURL)
        that.setData({
          fileUrl: res.fileList[0].tempFileURL
        })
      },
      fail: err => {
        // handle error
      }
    })
  },

  saveExecel:function(){
    let that = this
    student.get({
      success: function (res) {
        console.log(res.data);
        that.savaExcel(res.data);
      }
    })
    wx.setClipboardData({
      data: that.data.fileUrl,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log("复制成功", res.data) // data
          }
        })
      }
    })
    wx.showToast({
      title: '文件下载地址已复制，请在浏览器中输入下载成绩单~',
      icon: "none",
    })
  }

})