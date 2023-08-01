const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) // 新增餐廳頁面
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 編輯一筆餐廳頁面
router.get('/restaurants/:id', adminController.getRestaurant) // 瀏覽一筆餐廳資料
router.put('/restaurants/:id', adminController.putRestaurant) // 編輯一筆餐廳資料
router.delete('/restaurants/:id', adminController.deleteRestaurant) // 刪除一筆餐廳資料
router.get('/restaurants', adminController.getRestaurants) // 餐廳首頁
router.post('/restaurants', adminController.postRestaurant) // 新增餐廳

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
