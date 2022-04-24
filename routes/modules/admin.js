const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controllers')

// const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurants)
router.use('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
