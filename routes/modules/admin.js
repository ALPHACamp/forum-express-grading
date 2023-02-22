const express = require('express')
const router = express.Router()
const uploadImage = require('../../middleware/multer')

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurantPage)
router.get('/restaurants/:id/edit', adminController.editRestaurantPage)
router.get('/restaurants/:id', adminController.getRestaurantDetail)
router.patch('/restaurants/:id', uploadImage, adminController.patchRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', uploadImage, adminController.createRestaurant)

router.get('*', (req, res) => res.redirect('/admin/restaurants')) // fallback

module.exports = router
