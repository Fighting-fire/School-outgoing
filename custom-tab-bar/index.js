Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/teacher/teacher",
      iconPath: "../images/tabBar/广场1.png",
      selectedIconPath: "../images/tabBar/广场1.png",
      text: "teacher"
    }, {
        pagePath: "/pages/map/map",
        iconPath: "../images/tabBar/比赛1.png",
        selectedIconPath: "../images/tabBar/比赛1.png",
      text: "map"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(url)
      wx.switchTab({url})
      console.log("????????????????")
      console.log(data.index)
      this.setData({
        selected: data.index
      })
      console.log(data.index)
    }
  }
})