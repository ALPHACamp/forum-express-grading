const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controllers')


router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', adminController.postRestaurant)

router.get('/restaurants', adminController.getRestaurants)

// 注意這邊在教案中是router.use('',(req, res)...)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
