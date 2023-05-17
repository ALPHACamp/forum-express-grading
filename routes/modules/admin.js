const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// 管理者新增頁面
router.get('/restaurants/create', adminController.createRestaurant)

// 管理者編輯資料頁面
router.get('/restaurants/:id/edit', adminController.editRestaurant)

// 管理者瀏覽餐廳詳細資料
router.get('/restaurants/:id', adminController.getRestaurant)

// 管理者編輯餐廳資料
router.put('/restaurants/:id', adminController.putRestaurant)

// 管理者登入首頁
router.get('/restaurants', adminController.getRestaurants)

// 管理者新增功能
router.post('/restaurants', adminController.postRestaurant)

// 自動導向管理者首頁
router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
