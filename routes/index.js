const express = require('express')
const router = express.Router()

const restaurantController = require('../controllers/restaurant-controller')

// router.get('/', (req, res) => {
//   res.send('Hello World!')
// })

router.get('/restaurants', restaurantController.getRestaurants)
// fallback 路由
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
