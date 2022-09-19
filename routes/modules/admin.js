const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:restaurantId/edit', adminController.editRestaurant)
router.get('/restaurants/:restaurantId', adminController.getRestaurant)
router.put('/restaurants/:restaurantId', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:restaurantId', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/users', adminController.getUsers)
router.patch('/users/:userId', adminController.patchUser)
router.get('/categories', adminController.getCategories)
router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
