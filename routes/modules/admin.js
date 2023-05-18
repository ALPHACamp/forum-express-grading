const express = require('express')
const router = express.Router()

//* 新增，載入 controller
const adminController = require('../../controllers/admin-controller')
//* 新增餐廳路由
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', adminController.postRestaurant)
//* 讀取餐廳詳細
router.get('/restaurants/:id', adminController.getRestaurant)
//* 讀取全部餐廳
router.get('/restaurants', adminController.getRestaurants)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
