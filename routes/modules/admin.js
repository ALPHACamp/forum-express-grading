const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// 新增餐廳頁面
router.get('/restaurants/create', adminController.createRestaurant)
// 新增餐廳功能
router.post('/restaurants', adminController.postRestaurant)
// 瀏覽全部頁面
router.get('/restaurants', adminController.getRestaurants)
// 無法匹配路由皆會丟到這
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
