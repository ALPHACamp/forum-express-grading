const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
// const upload = require('../../middleware/multer')
const upload = require('../../middleware/multer')

router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)
router.get('/categories/:id', categoryController.getCategories) // 新增這行
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.post('/categories', categoryController.postCategory)
router.get('/categories', categoryController.getCategories)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
