const express = require('express')
const router = express.Router()
const resController = require('../controllers/restaurant-controller')

router.get('/restaurants', resController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
