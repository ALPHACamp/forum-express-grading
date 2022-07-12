const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put(
  '/restaurants/:id',
  upload.single('image'),
  adminController.putRestaurant
)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.post(
  '/restaurants',
  upload.single('image'),
  adminController.postRestaurant
)
router.get('/restaurants', adminController.getRestaurants)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))
router.get('/categories', categoryController.getCategories)

router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

module.exports = router
