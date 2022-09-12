const express = require('express')
const router = express.Router()
// 載入 controller
const restController = require('../controllers/restaurant-controller')
// 載入 admin.js
const admin = require('./modules/admin')

router.use('/admin', admin)
// 新增前台網址路由//匹配條件多的路由要寫在前面
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
