const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// 新增餐廳
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', adminController.postRestaurant)

// 顯示單一餐廳
router.get('/restaurants/:id', adminController.getRestaurant)

// 編輯單一餐廳
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', adminController.putRestaurant)

// 顯示所有餐廳
router.get('/restaurants', adminController.getRestaurants)

// 首頁路由
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
