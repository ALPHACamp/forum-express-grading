const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

//! 之後來試試調整上下順序 (教案說只要符合條件就會停，我以前試的狀況好像要 "完全符合")
// router.get('/', (req, res) => res.send('I am so happy'))
router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants)
// router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', (req, res) => res.redirect('/restaurants')) //! 教案說要改成這樣，我先試試上面的
router.use('/', generalErrorHandler)
// (上1) 其實加在前後都沒啥關係，因為 error handler 在 express 是另一類別，會另外處理

module.exports = router
