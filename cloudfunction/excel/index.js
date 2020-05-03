// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "outgoing-vftqo"
})
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    let {userdata} = event

    //定义excel表格名
    let dataCVS = 'Grade.xlsx'
    let alldata = [];
    //定义表头
    let row = ['老师姓名', '上课时间', '学生姓名', '跑图路径', '跑图用时'];

    //填充表格
    alldata.push(row);
    for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key].t_name);
      arr.push(userdata[key].data);
      arr.push(userdata[key].name);
      arr.push(userdata[key].way);
      arr.push(userdata[key].time);
      alldata.push(arr)
    }
    //把数据保存到excel里
    let buffer =await xlsx.build([{
      name:"Grade",
      data:alldata
    }]);
    //把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })
  } catch(e){
    console.error(e)
    return e
  }
}