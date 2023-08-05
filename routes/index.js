const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

// 後台首頁
router.use('/admin', admin)
// 註冊頁
router.get('/signup', userController.signUpPage)
// 提交註冊
router.post('/signup', userController.signUp)
// 前台首頁，接收到的請求路徑/restaurants，交給 controller 的 getRestaurants 函式來處理
router.get('/restaurants', restController.getRestaurants)
// 設定 fallback 路由, 其他路由條件都不符合時，最終會通過的路由，將使用者重新導回 /restaurants
router.use('/', (req, res) => res.redirect('/restaurants'))
// err
router.use('/', generalErrorHandler)

module.exports = router
