const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) // page of create
router.get('/restaurants/:rest_id/edit', adminController.editRestaurant) // page of edit
router.get('/restaurants/:rest_id', adminController.getRestaurant) // show a restaurant
router.put('/restaurants/:rest_id', adminController.putRestaurant)
router.post('/restaurants', adminController.postRestaurant) // create a restaurant
router.get('/restaurants', adminController.getRestaurants) // show all restaurants
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
