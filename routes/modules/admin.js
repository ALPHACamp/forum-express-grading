const router = require('express').Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')

router.get('/restaurants/create', adminController.getCreateRestaurantPage)
router.get('/restaurants/:id/edit', adminController.getEditRestaurantPage)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.use('/', (req, res) => res.redirect('restaurants'))

module.exports = router
