const express = require('express')
const router = express.Router()
// 載入 controller
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)

// 設定 fallback 路由(其他路由條件都不符合時，最終會通過的路由)
router.use('/', (req, res) => res.redirect('admin/restaurants'))

module.exports = router
