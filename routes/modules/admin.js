const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// 實際路由: '/admin/restaurant', render到 admin/restaurants.hbs
router.get('/restaurants', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
