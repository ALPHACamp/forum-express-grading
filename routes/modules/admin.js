const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) // 新增餐廳頁面
router.get('/restaurants', adminController.getRestaurants) // 進入/restaurants前先驗證是否為adm，是才能帶入adm畫面
router.post('/restaurants', adminController.postRestaurant) // 新增餐廳資訊
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
