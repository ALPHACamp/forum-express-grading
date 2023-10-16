const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller') // 載入 controller
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants')) // 設定fallback 路由，其他路由條件都不符合時，最終會通過的路由。

module.exports = router
