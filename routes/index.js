const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const adminRouter = require('./modules/admin')
const restaurantRouter = require('./modules/restaurant')
const userRouter = require('./modules/user')
const commentRouter = require('./modules/comment')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const passport = require('../config/passport')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local',
  { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.use('/admin', authenticatedAdmin, adminRouter)
router.use('/restaurants', authenticated, restaurantRouter)
router.use('/comments', authenticated, commentRouter)
router.use('/users', authenticated, userRouter)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.use('/', generalErrorHandler)
module.exports = router
