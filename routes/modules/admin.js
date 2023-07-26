const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controllers')

// 新增一筆資料
router.get('/restaurants/create', adminController.createRestaurant)
// 瀏覽一筆資料
router.get('/restaurants/:id', adminController.getRestaurant)
// 新增送出
router.post('/restaurants', adminController.postRestaurant)
// 瀏覽全部資料
router.get('/restaurants', adminController.getRestaurants)

// 注意這邊在教案中是router.use('',(req, res)...)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
