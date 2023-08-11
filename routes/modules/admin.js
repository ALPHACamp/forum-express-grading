
const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

const upload = require('../../middleware/multer')

// 使用者
router.get('/users', adminController.getUsers)

router.patch('/users/:id', adminController.patchUser)

// 分類
router.get('/categories', categoryController.getCategories)

router.post('/categories', categoryController.postCategory)

router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)

router.delete('/categories/:id', categoryController.deleteCategory)

// 餐廳
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)

router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/restaurants/:id', adminController.getRestaurant)

router.get('/restaurants', adminController.getRestaurants)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
