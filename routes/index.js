const express = require('express')
const router = express.Router()

const restaruantController = require('../controllers/restaurant-controller')

// router順序非常重要，條件越複雜的越要往上放，讓程式先判斷
router.get('/restaurant', restaruantController.getRestaurants)
router.get('/', (req, res) => { res.redirect('/restaurant') })

module.exports = router
