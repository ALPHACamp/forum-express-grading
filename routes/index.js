const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')

const admin = require('./modules/admin')
router.use('/admin', admin)

// 接收到的請求路徑/restaurants，交給 controller 的 getRestaurants 函式來處理
router.get('/restaurants', restController.getRestaurants)
// 設定 fallback 路由, 其他路由條件都不符合時，最終會通過的路由，將使用者重新導回 /restaurants
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
