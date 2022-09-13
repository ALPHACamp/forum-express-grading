const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// create
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', adminController.postRestaurant)
// browse
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => {
  return res.redirect('/admin/restaurants')
})
module.exports = router
