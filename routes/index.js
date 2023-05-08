const express = require('express')
const router = express.Router()
const restaruantController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)

// router順序非常重要，條件越複雜的越要往上放，讓程式先判斷
router.get('/restaurants', restaruantController.getRestaurants)
router.get('/', (req, res) => { res.redirect('/restaurants') })

module.exports = router
