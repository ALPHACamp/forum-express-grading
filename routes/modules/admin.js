const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
// 導向後臺首頁功能
router.get('/restaurants', adminController.getRestaurants)
// 其餘重新導回 /restaurants
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
