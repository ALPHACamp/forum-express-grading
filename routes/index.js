const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const { generalErrorHandler } = require('../middleware/error-handler')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

router.use('/admin', admin)

router.get('/signup', userController.singUpPage)
router.post('/signup', userController.singUp)

router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.use('/', generalErrorHandler)

module.exports = router
