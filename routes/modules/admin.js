const express = require('express')
const router = express.Router()
// 載入 controller
const adminController = require('../../controllers/admin-controller')

// 新增後台網址路由//匹配條件多的路由要寫在前面
router.get('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
