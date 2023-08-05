const express = require('express')
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

const router = express.Router()

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
