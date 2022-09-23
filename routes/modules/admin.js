const router = require('express').Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

router.get('/categories', categoryController.getCategories)
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategories)
router.delete('/categories/:id', categoryController.deleteCategories)
router.post('/categories', categoryController.postCategories)

router.use('/', (req, res) => { res.redirect('/admin/restaurants') })
module.exports = router
