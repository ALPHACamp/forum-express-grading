const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurant)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
