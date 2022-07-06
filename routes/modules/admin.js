const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
// user has signed in && is admin >> call function `adminController.getRestaurants`
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)
router.get('/', (req, res) => res.redirect('admin/restaurants'))

module.exports = router
