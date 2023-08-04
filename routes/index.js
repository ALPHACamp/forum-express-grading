const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)

// fallback路由，當匹配不到時就會執行這一行
router.get('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
