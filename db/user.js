const mongoose = require("mongoose");   // 引入mongoose模块
mongoose.connect("mongodb://localhost:27017/product");  // 连接数据库
const Schema = mongoose.Schema;
const userSchema = new Schema({ // 定义一个model
    username:String,    // 用户名字段
    password:String,    // 密码字段
    email: String,      // 邮箱
    mobile: String,     // 电话
    role_name: String,  // 角色
    mg_state: String,   // 状态
    avatar: String,     // 头像
})
// 第一个参数表示model模型对象
// 第二个参数是自定义的模型
// 第三个参数表示集合名
const User = mongoose.model("User",userSchema,"user");
module.exports=User     // 导出模型对象