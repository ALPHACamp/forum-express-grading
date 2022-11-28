const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

// create restaurant
router.get('/restaurants/create', adminController.createRestaurant)
// edit restaurant
router.get('/restaurants/:id/edit', adminController.editRestaurant)
// view restaurant
router.get('/restaurants/:id', adminController.getRestaurant)
// edit restaurant (put)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
// delete restaurant
router.delete('/restaurants/:id', adminController.deleteRestaurant)
// get all restaurants
router.get('/restaurants', adminController.getRestaurants)
// create restaurant (post)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

// patch user
router.patch('/users/:id', adminController.patchUser)
// get all users
router.get('/users', adminController.getUsers)

// get all categories
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
