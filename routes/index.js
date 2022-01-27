const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const user = require('./modules/user')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const restaurantController = require('../controllers/restaurant-controller')

router.use('/admin', admin)
router.use('/users', user)
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
