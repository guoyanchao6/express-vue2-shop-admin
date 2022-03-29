
const express = require('express')
const app = new express()
const cors = require('cors')//中间件解决跨域
//静态资源托管
app.use('/public',express.static('public'));

app.use(express.urlencoded({extended:false}))//解决中文乱码
app.use(express.json())//解析json对象
app.use(cors())
// session认证
// const session = require('express-session')// 导入session中间件
// app.use(// 配置session中间件
//   session({
//     secret: 'keyboard cat', // secret属性是值为任意字符串（负责加密的）
//     resave: false, // 固定写法
//     saveUninitialized: true, // 固定写法
//   }),
// )

// token认证
// 安装导入JWT相关的包
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const secret = 'guoyanchao No1 ^_^'      // 定义密钥
// const {verToken} = require('./token');
// 当收到请求app.use先截获这个请求并进行token解析，verToken返回token解析的结果，
// 返回{tokenOut:true}说明token过期。
app.use(function(req, res, next) {
  const {path, method} = req;
  const token = req.headers.authorization;
  const pathUnless = [ //白名单,除了这里写的地址，其他的URL都需要验证token
    '/',
    '/register',
    '/login',
    '/download',
    {
      url:'/articles',
      methods:['GET']
    },
    {
      url:/^\/articles\/.*/,
      urlReg:true,//url是正则
      methods:['GET']},
  ]  
  //验证请求的地址和方法是否在白名单里
  let credentialsRequired = true;
  pathUnless.forEach((item)=>{
      if(item === path){
        credentialsRequired = false;
      }
      if(item.url && item.methods){
        //判断url是否正则形式，如果是判断请求的地址是否符合正则
        let regPass = item.urlReg && ((new RegExp(item.url)).test(path));
        if( ( item.url === path || regPass ) 
            && 
            item.methods.indexOf(method) > -1
        ){
          credentialsRequired = false;
        }
      }
  })
  if(!credentialsRequired){
        //不需要进行验证
        return next();
    }else{
       jwt.verify(token, secret,(err,decoded)=>{
            if(err){
                console.log(err)
                return res.json({
                    msg: 'token无效，请重新登录',
                    tokenOut:true,
                    code: 400
                })
                // return next()   // err放行，会进入错误处理中间件
            }else{
                console.log('token认证通过，解析结果')
                console.log(decoded)
                return next()   // success放行，会进入router中间件
            }
        })
    }
}
);

// const formidable = require('express-formidable') //引入中间件
// app.use(formidable()) // 挂载中间件


// 路由
const userRouter = require('./router/user')
app.use(userRouter)

// error handler
app.use(function(err, req, res, next) {
  //判断token是否无效并返回前台
  console.log('handle err------------error-----------')
  console.log(err)
    if(err.name == 'TokenExpiredError'){//token过期
       return res.json({
            msg: 'token过期，请重新登录',
            tokenOut:true,
            code: 400
        })
    }
    else if(err.name == 'JsonWebTokenError'){//无效的token
       return res.json({
            msg: 'token无效，请重新登录',
            tokenOut:true,
            code: 400
        })
    }
  res.status(err.status || 500);
  res.render('error');
});

// 启动服务，服务开在本地80端口
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})