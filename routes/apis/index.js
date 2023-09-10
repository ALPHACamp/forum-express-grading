const express = require('express')
const router = express.Router()
const passport = require('../../config/passport') //新增這行
const admin = require('./modules/admin') // 新增這裡
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller') //新增這行
const { apiErrorHandler } = require('../../middleware/error-handler') // 新增這行
router.use('/admin', admin) // 新增這裡
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) //新增這行，設定 disable sessionsP
router.get('/restaurants', restController.getRestaurants)
router.use('/', apiErrorHandler) // 新增這行
module.exports = router
