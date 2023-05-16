const express = require('express')
const restController = require('../controllers/restaurant-controller')
const router = express.Router()

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => { res.redirect('/restaurants') })

// 設定前台路由

module.exports = router
