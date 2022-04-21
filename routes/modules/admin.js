const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

// 實際路由: '/admin/restaurant', render到 admin/restaurants.hbs
router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
