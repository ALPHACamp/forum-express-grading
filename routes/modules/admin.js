const express = require('express')
const router = express.Router()

// Controllers
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurantPage)
router.get('/restaurants/:id', adminController.getRestaurantDetail) // 放create上面，/create 會被認為是 會先被解讀成 :id，但這個 id 值並不存在，所以出現錯誤訊息
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)

// fallback 路由，其他路由條件都不符合時，最終會通過此路由
router.use('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
