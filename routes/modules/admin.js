// 引入模組
const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// 設定/admin路由
router.get('/restaurants', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

// 匯出模組
module.exports = router
