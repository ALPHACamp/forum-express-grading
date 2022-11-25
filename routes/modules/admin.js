const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// create restaurant
router.get('/restaurants/create', adminController.createRestaurant)
// view restaurant
router.get('/restaurants/:id', adminController.getRestaurant)
// get all restaurants
router.get('/restaurants', adminController.getRestaurants)
// post restaurant
router.post('/restaurants', adminController.postRestaurant)

router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
