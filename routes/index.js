const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證
// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
// 新增
const { authenticated, authenticatedAdmin } = require('../middleware/auth') // 修改這一行
const userController = require('../controllers/user-controller') // 新增這行
 const admin = require('./modules/admin') 
const { generalErrorHandler } = require('../middleware/error-handler') // 加入這行

router.use('/admin', authenticatedAdmin, admin) // 修改這一行

// 新增下面這兩行，注意順序
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post

router.get('/signin', userController.signInPage)

router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post

router.get('/logout', userController.logout)
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // 新增這行
router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler) // 加入這行
module.exports = router

module.exports = router
