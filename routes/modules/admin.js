const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) // 新增路由
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 編輯路由
router.get('/restaurants/:id', adminController.getRestaurant) // 瀏覽單筆資料路由
router.put('/restaurants/:id', adminController.putRestaurant) // 送出編輯表單
router.delete('/restaurants/:id', adminController.deleteRestaurant) // 刪除路由
router.get('/restaurants', adminController.getRestaurants) // 導入登入狀態驗證
router.post('/restaurants', adminController.postRestaurant) // 提交新增路由

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
