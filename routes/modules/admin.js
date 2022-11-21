const express = require('express')
const router = express.Router()
// 載入 controller
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)

// 設定 fallback 路由(其他路由條件都不符合時，最終會通過的路由)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
