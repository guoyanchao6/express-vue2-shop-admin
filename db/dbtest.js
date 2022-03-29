// 导入User模型
const User = require("./user")
// 实例化user
// const user = new User({
//     username:"aaaaaa",
//     password:"111111",
//     avatar:'upload/aaa.webp'
// }) 

// 增删改查。。。

// 向user集合中插入数据（新增用户）
// user.save().then((res)=>{
//     console.log(res)
// })



// 修改user集合中数据(修改用户信息)
// User.findByIdAndUpdate("620f59c91ac8c135de44c554",{
//     username:"刘德华",
//     password:"666666",
// }).then((res)=>{
//     console.log(res)
// })

// 更新一条数据
User.updateOne( {"username":'aaa'},  { $set : { "avatar" : "upload/aaa.webp"} } );

// 删除user集合中数据（删除/注销用户）
// User.findByIdAndDelete("620f59c91ac8c135de44c554").then((res)=>{
//     console.log(res)
// })

// 查询user集合中的所有数据(查找所有用户)
User.find().then((res)=>{
    console.log(res)
})