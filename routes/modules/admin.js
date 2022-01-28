const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurant)

router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', adminController.putRestaurant)

router.get('/restaurants/:id', adminController.getRestaurant)
router.post('/restaurants', adminController.postRestaurant)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

exports = module.exports = router
