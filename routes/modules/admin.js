const exporess = require('express')
const router = exporess.Router()

const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurant/:id/edit', adminController.editRestaurant)
router.get('/restaurant/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.use('', (res, req) => res.redirect('/admin/restaurants'))

module.exports = router
