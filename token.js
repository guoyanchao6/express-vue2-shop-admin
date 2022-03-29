const jwt = require('jsonwebtoken')
const secret = 'guoyanchao No1 ^_^'; // 密匙
//生产token
let createToken = function (data) {
  let token =  jwt.sign(data, secret, {
    expiresIn:  60 * 60 * 24 * 3 // 以s作为单位（目前设置的过期时间为3天）
    });
  return token;
};

//验证token
const verToken = function (token) {
  return new Promise((resolve, reject) => {
      var info = jwt.verify(token, secret ,(error, decoded) => {
          if (error) {
              console.log(error)
            // console.log("token过期或者无效")
            return {tokenOut:true}
          }
        });
      resolve(info);
  })

}

 module.exports = { createToken, secret, verToken};