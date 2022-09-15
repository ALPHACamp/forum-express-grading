const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')

router.get('/restaurant', restController.getRestaurants)
router.use('/', (req, res) => {
  res.redirect('/restaurant')
})

module.exports = router
