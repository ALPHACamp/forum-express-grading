const express = require('express')
const app = require('../app')
const router = express.Router()

const restaurantController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.use('/restaurants', restaurantController.getRestaurants)
router.use('/', (req, res) => { res.redirect('/restaurants') })

module.exports = router
