const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

// for auth-management
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)
// for one category
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
// for categories
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
// create new restaurant
router.get('/restaurants/create', adminController.createRestaurant)
// one restaurant edit
router.get('/restaurants/:id/edit', adminController.editRestaurant)
// one restaurant detail
router.get('/restaurants/:id', adminController.getRestaurant)
// update one restaurant detail
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
// delete one restaurant
router.delete('/restaurants/:id', adminController.deleteRestaurant)
// for admin home page
router.get('/restaurants', adminController.getRestaurants)
// create new restaurant and post it
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
