const express = require('express')
const router = express.Router()
// 載入 controller
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/restaurants', restController.getRestaurants)

// 設定 fallback 路由(其他路由條件都不符合時，最終會通過的路由)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
