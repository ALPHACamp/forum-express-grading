const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)

router.use('/', async (req, res, next) => {
  try {
    res.redirect('/restaurants')
  } catch (error) {
    next(error)
  }
})

module.exports = router
