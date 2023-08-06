const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// 導向後臺新增頁功能 - 取得新增餐廳的表單
router.get('/restaurants/create', adminController.createRestaurant)
// 導向後臺首頁功能 - 瀏覽所有餐廳
router.get('/restaurants', adminController.getRestaurants)
// 新增一筆餐廳
router.post('/restaurants', adminController.postRestaurant)
// 其餘重新導回 /restaurants
router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
