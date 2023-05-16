const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

// admin/restaurants
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put(
  '/restaurants/:id',
  upload.single('image'),
  adminController.putRestaurant
)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post(
  '/restaurants',
  upload.single('image'),
  adminController.postRestaurant
)
// admin categories
// router.get('/categories/:id', categoryController.getCategories)
// router.put('/categories/:id', categoryController.putCategory)
// router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/categories', categoryController.getCategories)
// router.post('/categories', categoryController.postCategory)

// admin users
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

// 設定 fallback route, 如果所有routes都不符合時，通過此路由
router.use('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
