const express = require('express')
const router = express.Router()
// 需要載入寫入先前設定的passport實例來執行對應本地端驗證
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)

router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/users/signin',
  failureFlash: true
}), userController.signIn)

router.get('/signout', userController.signOut)

exports = module.exports = router
