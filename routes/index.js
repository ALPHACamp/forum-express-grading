// 存放路由相關邏輯
// 匹配條件較多的路由順序寫在前面，讓程式先判斷。
const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const passport = require('passport')
const admin = require('./modules/admin') // admin 檔案夾
const { generalErrorHandler } = require('../middleware/error-handler') // { key:value }
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const upload = require('../middleware/multer')

// 因為這邊是設立在 routes/modules 路由清單裡面
router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)

router.get('/logout', userController.logout)

// 將 req 交給 passport.authenticate 請 passport 做驗證，並指定用 passport 設定中的 local，最後再看是成功還是失敗，將 req 給對應的內容，驗證成功給 userController.signIn、失敗給 failureRedirect，因此能夠進入到 userController.signIn 就是已經登入的使用者
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.post('/following/:userId', authenticated, userController.addFollowing)

router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.get('/users/top', authenticated, userController.getTopUsers)

router.get('/users/:id/edit', authenticated, userController.editUser)

router.get('/users/:id', authenticated, userController.getUser)

router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.get('/restaurants/feeds', authenticated, restController.getFeeds)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

router.get('/restaurants/:id', authenticated, restController.getRestaurant)

router.get('/restaurants', authenticated, restController.getRestaurants)

router.post('/comments', authenticated, commentController.postComment)

router.delete('/comments/:id', commentController.deleteComment)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)

router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// fallback 路由：當所有路由皆不匹配時(奇怪亂拼湊)，不管用什麼 HTTP method 發出，最終皆會通過的路由(e.g. http://localhost:3000/)
router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.use('/', generalErrorHandler) // global //因為寫了 / 所以只要匹配(其實就是所有路徑就會走這邊，但是是最後再走這邊嗎?????因為要先有執行路徑內的 logic 才有 error 機會產生????)
module.exports = router
