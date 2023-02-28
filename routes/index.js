const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

const { generalErrorHandler } = require('../middleware/error-handler')

//! 之後來試試調整上下順序 (教案說只要符合條件就會停，我以前試的狀況好像要 "完全符合")
// router.get('/', (req, res) => res.send('I am so happy'))
router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/restaurants', restController.getRestaurants)
// router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', (req, res) => res.redirect('/restaurants')) //! 教案說要改成這樣，我先試試上面的
router.use('/', generalErrorHandler)

module.exports = router
