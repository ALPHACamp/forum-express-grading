const express = require('express')
const router = express.Router()
const restConstroller = require('../controllers/restaurant-controller')

router.get('/restaurants', restConstroller.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
