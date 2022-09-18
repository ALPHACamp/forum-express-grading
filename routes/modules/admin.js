const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
// 等其他功能做完再回來debug
// const { authenticatedAdmin } = require('../../middleware/auth')
// router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
