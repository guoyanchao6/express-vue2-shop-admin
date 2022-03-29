
const User = require('../db/user')   // 引入数据库
// token认证
const jwt = require('jsonwebtoken')
const secretKey = 'guoyanchao No1 ^_^'      // 定义密钥
const {createToken} = require('../token')
const multiparty=require('multiparty')
const fs=require('fs')

exports.download=(req,res)=>{
    res.download('./public/img/aaa-1648172747193.webp')
}

// 用户名字段匹配查询用户
// exports.getUsers=async(req,res)=>{
//     console.log(req.query)//{ query: '', pagenum: '1', pagesize: '10' }
//     const searchValue=req.query.query
//     console.log(searchValue)
//     const str = "^.*"+searchValue+".*$"
//     const reg = new RegExp(str)
//     const result1 = await User.find({username:{$regex:reg,$options:'i'}})
//     console.log(result1)
//     const total=result1.length
//     const result=await User.find({username:{$regex:reg,$options:'i'}}).limit(req.query.pagesize).skip(req.query.pagesize*(req.query.pagenum-1))
//     console.log(result)
//     res.send({
//         code:200,
//         msg:'获取用户数据成功',
//         data:result,
//         total,
//     })
// }

// 多字段匹配查询用户
exports.getUsers=async(req,res)=>{
    console.log(req.query)//{ query: '', pagenum: '1', pagesize: '10' }
    const searchValue=req.query.query
    console.log(searchValue)
    const str = "^.*"+searchValue+".*$"
    const reg = new RegExp(str)
    const _filter={
        $or: [
            {'username': {$regex: reg}},
            {'mobile': {$regex: reg}},
            {'email': {$regex: reg}},
        ]
    }
    const result1 = await User.find(_filter)
    console.log(result1)
    const total=result1.length
    const result=await User.find(_filter).limit(req.query.pagesize).skip(req.query.pagesize*(req.query.pagenum-1))
    console.log(result)
    res.send({
        code:200,
        msg:'获取用户数据成功',
        data:result,
        total,
    })
}
exports.updataUser=async(req,res)=>{
    console.log(req.body)
    const result = await User.updateOne(
        {_id:req.body._id},
        req.body
    )
    console.log(result)
    if(result.modifiedCount!==1){
        return res.send({
            code:201,
            msg:'修改数据失败',
            data:req.body
        })
    }
    res.send({
            code:200,
            msg:'修改数据成功',
            data:req.body
        })
    
}
exports.addUser=async(req,res)=>{
    // console.log(req.body)
    const {...user}=req.body
    console.log(user)
    const user1 = new User({
        // 实例化user
        // username: 'ffffff',
        // password: '666666',
        // email: '992410364@qq.com',      // 邮箱
        // mobile: '18435681185',     // 电话
        // role_name: '1',  // 角色
        // mg_state: '1',   // 状态
    })
    console.log(user1)
    user2=Object.assign(user1,user)
    console.log(user2)
    const result1 = await User.find({username:user.username})
    console.log('查询用户')
    console.log(result1)    // []
    if(result1.length>=1){
        return res.send({
            code:201,
            msg:'用户名已存在'
        })
    }
    const result2 = await user2.save()
    console.log('保存用户')
    console.log(result2)    // []
    res.send({
        code:200,
        msg:'添加用户成功',
        data:result2
    })
}
exports.deleteUser=async(req,res)=>{
    const result = await User.deleteOne({_id:req.body._id})
    console.log(result)     // { deletedCount: 3 }
    if(result.deletedCount<1){
        return res.send({
            code:201,
            msg:'删除用户失败'
        })
    }
    res.send({
        code:200,
        msg:'删除用户成功',
        data:result
    })
}

exports.userRigester=async(req,res)=>{
    console.log(req.body)   // 获取数据
    // 插入数据
    const user = new User({
        username:req.body.username,
        password:req.body.password
    })
    const result = await User.find({username:req.body.username});
    console.log(result)
    if(result.length>=1){
        res.json({
            code:201,
            msg:"用户名已存在！"
        })
    }else{
        const result = await user.save();
        console.log(result)
        // 响应客户端
        if(result){
            res.json({
                code:200,
                msg:"注册成功！"
            })
        }else{
            res.json({
                code:202,
                msg:"注册失败！"
            }) 
        }
    }
    
}
exports.userLogin=async(req,res)=>{
    console.log('req.body',req.body)   // 获取数据
    // 查询数据
    const user = {
        username:req.body.username,
        password:req.body.password
    }
    const result = await User.find(user);
    console.log('result',result)
    // 响应客户端
    if(result.length>=1){
        // session认证
        // req.session.userinfo = req.body    // 将用户信息存在session中
        // console.log('req.session.userinfo',req.session.userinfo)
        // req.session.islogin = true     // 将用户登录状态存储在session中
        // console.log(req.session)
        // res.json({
        //     code:200,
        //     msg:"登录成功！"
        // })

        // token认证
        // 调用jwt.sign()生成JWT字符串，三个参数分别是：用户信息对象，加密密钥，配置对象配置token有效期(【注意】token中一定不要携带密码相关的属性)
        // const tokenStr = jwt.sign({username:user.username},secretKey,{expiresIn: 60 * 60})
        const tokenStr = createToken({username:user.username})
        console.log(tokenStr)
        res.json({
            code:200,
            msg:"登录成功！",
            token: tokenStr     // 要发送给客户端的token字符串
        })
    }else{
        res.json({
            code:201,
            msg:"登录失败！"
        }) 
    }
}
exports.userinfor=async(req,res)=>{
    // session认证判断用户是否登录
    // if(req.session.islogin){
    //     return res.send({
    //         status:1,
    //         mag:'fail'
    //     })
    // }
    // res.send({
    //     status:0,
    //     msg:'success',
    //     userinfo:req.session.userinfo
    // })

    // 使用jwt.verify解析token
    // 解析有效的token，如果token失效，用户没有了访问权限，则不会进入/userinfo路由，直接走错误处理
    console.log(req.body.token)
    token=req.body.token
    const result = jwt.verify(token,secretKey)    
    // TokenExpiredError: jwt expired  无效的token token过期失效
    console.log(result)// { username: 'aaaaaa', iat: 1645273844, exp: 1645273964 }  用户信息，token签发事件，token过期时间
    const result1=await User.find({"username":result.username})
    console.log(result1[0])
    res.json({
        status:0,
        msg:'success',
        userinfo:result1[0]
    })
}
exports.userLogout=(req,res)=>{
    // 清空当前客户端对应的session信息
    req.session.destroy()
    res.send({
        status:0,
        msg:'退出登录'
    })
}
exports.userAvatar=(req,res)=>{
    console.log('头像上传')
    let form = new multiparty.Form();
    form.uploadDir = './public/img';
    // 解析FormData
    form.parse(req,function(err, fields, files) {
        const file=files.avatar[0]
        console.log(fields)
        const username=fields.username[0]
        const id=fields.id[0]
        const oldP=file.path
        const type=fields.type[0]
        console.log(oldP,'oldP')
        const suffix=oldP.split('.')[1]
        console.log(suffix)//文件后缀
        const date=(new Date()).getTime()//当前时间戳
        console.log(date)
        const newP='public/img/'+username+'-'+date+'.'+suffix
        console.log(oldP,newP)
        fs.rename(oldP,newP,async(err)=>{
            if(err){
                throw err;
            }
            else{
                // 将用户头像服务器地址 存储在用户信息的avatar上
                const result1 = await User.find({"username":username})//查询用户信息
                console.log(result1[0].avatar+'旧头像路径')
                const oldImg=result1[0].avatar
                const avatarP={
                    avatar:newP
                }
                console.log(avatarP)
                const user1=Object.assign(result1[0],avatarP)
                console.log(user1)
                const result = await User.updateOne(//更新用户信息
                    {_id:id},
                    user1
                )
                console.log(result)
                if(result.matchedCount===1){
                    console.log('更新成功')
                    res.json({
                        code:200,
                        msg:'头像上传成功',
                        imgPath:newP
                    })
                    // 如果是更新头像，删除旧头像
                    console.log('----------------deletimg')
                    console.log(type)
                    if(type==='updata'){
                        console.log(oldImg)
                        fs.unlink(oldImg,function(){
                            console.log('删除成功')
                        })
                    }
                    
                }
                
            }
        })
        
    })
    
}

