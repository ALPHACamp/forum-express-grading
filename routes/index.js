const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const adminRouter = require('./modules/admin')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.use('/admin', adminRouter)
router.get('/restaurant', restaurantController.getRestaurants)

router.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = router
