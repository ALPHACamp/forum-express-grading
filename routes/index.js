const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

// 引入路由模組
const admin = require('./modules/admin')

// 建立路由
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
