const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurantPage)
router.get('/restaurants/:id', adminController.getRestaurantDetail)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.createRestaurant)

router.get('*', (req, res) => res.redirect('/admin/restaurants')) // fallback

module.exports = router
