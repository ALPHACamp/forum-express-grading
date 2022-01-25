const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller.js')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/restaurants', restaurantController.getRestaurants)

router.get('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
