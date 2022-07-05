const express = require('express')
const router = express.Router()

// import controller modules
const admin = require('./modules/admin')
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
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
router.use('/', generalErrorHandler)

module.exports = router
