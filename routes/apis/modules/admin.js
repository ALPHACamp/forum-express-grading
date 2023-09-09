const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controller')
const upload = require('../../../middleware/multer') // 新增這裡
router.delete('/restaurants/:id', adminController.deleteRestaurant) // 新增這裡
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // 新增這裡
module.exports = router