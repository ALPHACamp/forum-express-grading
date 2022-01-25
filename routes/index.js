const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controllers')

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurant)
router.use('/', (req, res) => res.redirect('/restaurants'))
module.exports = router
