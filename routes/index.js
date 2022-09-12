const express = require('express')
const router = express.Router()
const restaurantController = require('../controller/restaurant-controller')

router.get('/restaurant', restaurantController.getRestaurants)
router.get('/', (req, res) => { res.redirect('/restaurant') })
module.exports = router
