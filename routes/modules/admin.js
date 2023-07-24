const express = require('express')
const router = express.Router()
const upload = require('../../middlewares/multer')
const { adminController } = require('../../controllers/admin-controller')

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
