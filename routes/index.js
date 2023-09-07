const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const restaurantController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.getSignUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (_req, res) => {
  res.send('Hello World!')
})

router.use('/', generalErrorHandler)
module.exports = router
