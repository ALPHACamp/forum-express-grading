const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

const upload = require('../../middleware/multer') // 需要上傳的路由掛載

/**    使用者餐廳部分  **/
router.get('/restaurants/create', adminController.createRestaurants)
router.get('/restaurants/:id/edit', adminController.editRestaurant)

// id的路由要後於Create， 否則先有id變動的判斷，create會被識別為變動的id
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
// upload中間件捕捉file 轉換req.file傳給路由

/**    使用者管理部分  **/
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

/**    分類部分   **/
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategories)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
/**   預防錯誤導向中間件    **/
router.use('/', (req, res) => { res.redirect('/admin/restaurants') })

module.exports = router
