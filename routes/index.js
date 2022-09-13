const express = require('express')
const router = express.Router()
const adminRoute = require('./modules/admin')
const restaurantController = require('../controller/restaurant-controller')
const userController = require('../controller/user-controller')

router.get('/signup', userController.signupUpPage)
router.post('/signup', userController.signUp)

router.use('/admin', adminRoute)
router.get('/restaurant', restaurantController.getRestaurants)
router.get('/', (req, res) => { res.redirect('/restaurant') })
module.exports = router
