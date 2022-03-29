const express = require('express')
const router = express.Router()
const userHandler=require('../user-handler/user')

router.post('/register',userHandler.userRigester)
router.post('/login',userHandler.userLogin)
router.post('/userinfor',userHandler.userinfor)
router.post('/logout',userHandler.userLogout)
router.get('/getUsers',userHandler.getUsers)
router.post('/addUser',userHandler.addUser)
router.post('/deleteUser',userHandler.deleteUser)
router.post('/updataUser',userHandler.updataUser)
router.post('/userAvatar',userHandler.userAvatar)

router.get('/download',userHandler.download)
module.exports=router