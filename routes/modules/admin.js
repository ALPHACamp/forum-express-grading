const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// create restaurant
router.get('/restaurants/create', adminController.createRestaurant)
// edit restaurant
router.get('/restaurants/:id/edit', adminController.editRestaurant)
// view restaurant
router.get('/restaurants/:id', adminController.getRestaurant)
// edit restaurant (put)
router.put('/restaurants/:id', adminController.putRestaurant)
// delete restaurant
router.delete('/restaurants/:id', adminController.deleteRestaurant)
// get all restaurants
router.get('/restaurants', adminController.getRestaurants)
// create restaurant (post)
router.post('/restaurants', adminController.postRestaurant)

router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
