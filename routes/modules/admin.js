const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) // 新增餐廳頁面
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 編輯餐廳頁面
router.get('/restaurants/:id', adminController.getRestaurant) // 餐廳詳情頁面，:id為模糊路由，故需放至create下面，確定的要放這之上
router.put('/restaurants/:id', adminController.putRestaurant) // 編輯餐廳資訊
router.get('/restaurants', adminController.getRestaurants) // 後台餐廳主頁，進入/restaurants前先驗證是否為adm，是才能帶入adm畫面
router.post('/restaurants', adminController.postRestaurant) // 新增餐廳資訊
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
