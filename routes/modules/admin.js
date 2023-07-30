
const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants) // (頁面)餐廳管理清單

router.get('/restaurants/create', adminController.createRestaurant) // (頁面)新增餐廳
router.post('/restaurants', adminController.postRestaurant) // (功能)新增餐廳

// fallback路由，當其他條件都不符合，最終都會通過這一條
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
