const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', adminController.postRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', adminController.putRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
