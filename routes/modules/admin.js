const router = require('express').Router()
const adminController = require('../../controller/admin-controller')
const upload = require('../../middleware/multer')

router.use('/', (req, res, next) => {
  console.log('here is routes/modules/admin.js')
  next()
})

router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.use('/', (req, res) => { res.redirect('/admin/restaurants') })

module.exports = router
