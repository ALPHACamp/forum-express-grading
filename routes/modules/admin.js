const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurants)

router.get('/restaurants/:restId/edit', adminController.editRestaurants)

router.put('/restaurants/:restId', adminController.putRestaurants)

router.get('/restaurants/:restId', adminController.getRestaurant)

router.get('/restaurants', adminController.getRestaurants)

router.post('/restaurants', adminController.postRestaurants)

router.get('/', (req, res) => {
  res.redirect('/admin/restaurants')
})
router.delete('/restaurants/:restId', adminController.deleteRestaurant)

module.exports = router
