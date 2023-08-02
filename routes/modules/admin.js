const express = require('express')
const router = express.Router()
const upload = require('../../middlewares/multer')
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

/* R01 HW1 */
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)
/* category CRUD */
/* edit category */
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
/* create category */
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
/* delete category */
router.delete('/categories/:id', categoryController.deleteCategory)

router.get('/restaurants/:id/edit', adminController.editRestaurant)
// upload的名字要和以下input的name 一樣
// <input class="form-control" type="file" class="form-control-file" id="image" name="image">
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants/create', adminController.createRestaurants)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.use('/', (req, res) => {
  res.redirect('/admin/restaurants')
})

module.exports = router
