const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controllers')

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
