const express = require('express')
const router = express.Router()
const passport = require('../../config/passport') //新增這行
const admin = require('./modules/admin') // 新增這裡
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller') //新增這行
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth') // 新增這裡
const { apiErrorHandler } = require('../../middleware/error-handler') // 新增這行
router.use('/admin', authenticated, authenticatedAdmin, admin) // 修改，後台路由加入 authenticated, authenticatedAdmin
router.get('/restaurants', authenticated, restController.getRestaurants) // 修改，前台路由加入 authenticated 
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) //新增這行
router.post('/signup', passport.authenticate('local', { failureRedirect: '/signup', failureFlash: true }), userController.signUp)
router.use('/', apiErrorHandler) // 新增這行
module.exports = router
