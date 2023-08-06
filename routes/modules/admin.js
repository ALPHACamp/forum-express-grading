const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

// 導向後臺首頁功能
router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
// 其餘重新導回 /restaurants
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
