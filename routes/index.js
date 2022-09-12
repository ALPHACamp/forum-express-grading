const express = require('express')
const router = express.Router()
const adminRoute = require('./modules/admin')
const restaurantController = require('../controller/restaurant-controller')

router.use('/admin', adminRoute)

router.get('/restaurant', restaurantController.getRestaurants)
router.use('/', (req, res) => { res.redirect('/restaurant') })
module.exports = router
