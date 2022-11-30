const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')
// const { authenticatedAdmin } = require('../../middleware/auth') // 引入 auth.js
router.get('/restaurants/create', adminController.createRestaurant) // 把 authenticatedAdmin 參數拿出去到index內，由index頁傳入
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // 因為_method=PUT，所以用put(修改後台編輯餐廳的路由)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // 加上上傳單張圖片(修改後台新增餐廳的路由)

router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)
router.get('/categories', categoryController.getCategories)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
