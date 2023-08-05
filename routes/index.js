const express = require('express')
const restController = require('../controllers/restaurant-controller')

const router = express.Router()

router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router

module.exports = router
