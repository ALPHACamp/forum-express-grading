const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const user = require('./modules/user')
const restaurantController = require('../controllers/restaurant-controller')

router.use('/admin', admin)
router.use('/users', user)
router.get('/restaurants', restaurantController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
