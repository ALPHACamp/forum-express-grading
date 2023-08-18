const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurants)
router.get('/restaurants/:id/edit', adminController.editRestaurant)

// id的路由要後於Create， 否則先有id變動的判斷，create會被識別為變動的id
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', adminController.putRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)

router.use('/', (req, res) => { res.redirect('/admin/restaurants') })
module.exports = router
