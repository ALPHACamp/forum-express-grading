const express = require('express')
const router = express.Router()
const uploadImage = require('../../middleware/multer')

const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

router.get('/restaurants/create', adminController.createRestaurantPage)
router.get('/restaurants/:id/edit', adminController.editRestaurantPage)
router.get('/restaurants/:id', adminController.getRestaurantDetail)
router.patch('/restaurants/:id', uploadImage, adminController.patchRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', uploadImage, adminController.createRestaurant)

router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.get('/categories/:id/edit', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('*', (req, res) => res.redirect('/admin/restaurants')) // fallback

module.exports = router
