const router = require('express').Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

router.get('/restaurants/create', adminController.getCreateRestaurantPage)
router.get('/restaurants/:id/edit', adminController.getEditRestaurantPage)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)
router.get('/categories', categoryController.getCategories)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
