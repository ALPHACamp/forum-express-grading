const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')

// const { authenticatedAdmin } = require('../../middleware/auth')

//! 之後來試試調整上下順序 (教案說只要符合條件就會停，我以前試的狀況好像要 "完全符合")
// router.get('/', (req, res) => res.send('I am so happy'))

// 這裡沒按照功能，而是按照嚴格程度排序，教案怕有萬一 :id 的值剛好等於 'create'
router.get('/restaurants/create', adminController.createRestaurant) // 渲染新增頁面
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 渲染編輯餐廳葉面
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // 送出編輯餐廳資料
router.get('/restaurants/:id', adminController.getRestaurant) // 渲染單一餐廳細節瀏覽
router.delete('/restaurants/:id', adminController.deleteRestaurant) // 渲染單一餐廳細節瀏覽
router.get('/restaurants', adminController.getRestaurants) // 渲染餐廳列表
// router.get('/', (req, res) => res.redirect('/restaurants'))
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // 送出新增餐廳資料
router.use('/', (req, res) => res.redirect('/admin/restaurants')) //! 教案說要改成這樣，我先試試上面的

module.exports = router
