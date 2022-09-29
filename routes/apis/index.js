const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', admin)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signin)
router.get('/restaurants', restController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
