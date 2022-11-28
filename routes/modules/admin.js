const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

// 在總路index由加入authenticatedAdmin，這邊就不用重複寫
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 冒號後面名稱跟隨controller中的命名
router.get('/restaurants/:rest_id', adminController.getRestaurant) // 冒號後面名稱跟隨controller中的命名
router.put(
  '/restaurants/:id',
  upload.single('image'),
  adminController.putRestaurant
) // 修改這一行為 put，冒號後面名稱跟隨controller中的命名
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post(
  '/restaurants',
  upload.single('image'),
  adminController.postRestaurant
)
router.get('/users/', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('', (req, res) => res.redirect('/admin/restaurants'))
// 或寫成 router.use("/", (req, res) => res.redirect("/admin/restaurants"))

module.exports = router
