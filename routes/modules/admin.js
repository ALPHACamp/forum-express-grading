const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
// const { authenticatedAdmin } = require('../../middleware/auth') // 有建立在 index 了

// 路由擺放的順序，應從嚴格到寬鬆
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
// 假設今天網址是 / admin / restaurants / 3，那:id 就是 3，req.params.id 就會是 3，因此我們可以在 controller 使用 req.params.id 取得動態的 id
router.put('/restaurants/:id', adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

// 做實驗
// router.get('/restaurants/:id', adminController.getRestaurant)
// router.get('/restaurants/create', adminController.createRestaurant)
// 這樣的路由順序，會導致系統以為 create 是一種 :id，所以出現錯誤訊息 Restaurant didn't exist!

module.exports = router
