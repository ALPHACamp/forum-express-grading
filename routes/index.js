const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)

// Fallback route, if there is no match route from top to bottom, redirect this route
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
