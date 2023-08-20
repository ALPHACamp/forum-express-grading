const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
// const { authenticated } = require('../../middleware/auth')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')

router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', apiErrorHandler)
module.exports = router
