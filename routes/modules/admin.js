const express = require('express')
const upload = require('../../middleware/multer')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

// create
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

// read all
router.get('/restaurants', adminController.getRestaurants)

// detail
router.get('/restaurants/:id', adminController.getRestaurant)

// edit
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)

// delete
router.delete('/restaurants/:id', adminController.deleteRestaurant)

// category
router.get('/categories', categoryController.getCategories)

// category create
router.post('/categories', categoryController.postCategory)

// category edit
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)

// category delete
router.delete('/categories/:id', categoryController.deleteCategory)

// user admin setting
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
