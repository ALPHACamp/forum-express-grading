// 匹配條件多的路由寫在前面，讓程式先判斷
const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants) // 如果接受到的請求路徑是 /restaurants，那就交給 controller 的 getRestaurants 函式來處理。這行路由和請求如果匹配成功，以下的 router.get 就不會執行。
router.get(('/', (req, res) => { res.redirect('/restaurants') })) // fallback 路由是指其他路由條件都不符合時，最終會通過的路由
router.use('/', generalErrorHandler)

module.exports = router
