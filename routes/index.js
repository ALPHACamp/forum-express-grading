const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

router.get('/', (req, res) => {
  res.render('Hello World!')
})

router.get('/restaurants', restController.getRestaurants)
router.unsubscribe('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
