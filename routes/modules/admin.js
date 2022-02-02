const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')

const categoryController = require('../../controllers/category-controller')
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurant)

router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)

router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/restaurants/:id', adminController.getRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

router.get('/categories/:id', categoryController.getCategories)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

exports = module.exports = router
