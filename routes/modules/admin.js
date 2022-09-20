const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')
const categoryController = require('../../controllers/category-controller')
const restController = require('../../controllers/restaurant-controller')

router.get('/restaurants/create', adminController.createRestaurant) // create page
router.get('/restaurants/:id/edit', adminController.editRestaurant) // edit page
router.get('/restaurants/:id', adminController.getRestaurant) // detail
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // edit
router.delete('/restaurants/:id', adminController.deleteRestaurant) // delete
router.get('/restaurants', adminController.getRestaurants) // home page
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // create
router.get('/users', adminController.getUsers) // browse users page
router.patch('/users/:id', adminController.patchUser) // patch user

router.get('/categories', categoryController.getCategories) // browse category
router.post('/categories', categoryController.postCategory) // create category
router.get('/categories/:id', categoryController.getCategories) // browse edit page
router.put('/categories/:id', categoryController.putCategory) // edit
router.delete('/categories/:id', categoryController.deleteCategory) // delete

router.get('/', (req, res) => {
  return res.redirect('/admin/restaurants')
})
module.exports = router
