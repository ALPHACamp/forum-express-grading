const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)

// fallback 路由。其他路由條件都不符合時，會通過這個路由。
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
