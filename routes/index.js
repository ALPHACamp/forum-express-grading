const express = require('express')
const router = express.Router()

// import controller modules
const restaurantController = require('../controllers/restaurant-controller')

/**
 * as server gets request '/restaurants'
 * this request will pass to the function 'getRestaurants' which is in object restaurantController
 */
router.get('/restaurants', restaurantController.getRestaurants)
/**
 * set fallback router
 * if all routers above are not allow to get into, this fallback router is the only one to enter
 */
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
