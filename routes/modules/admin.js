const express = require('express')
const router = express.Router()

const restController = require('../../controllers/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

//! 之後來試試調整上下順序 (教案說只要符合條件就會停，我以前試的狀況好像要 "完全符合")
// router.get('/', (req, res) => res.send('I am so happy'))

router.get('/restaurants', authenticatedAdmin, restController.getRestaurants)
// router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', (req, res) => res.redirect('/admin/restaurants')) //! 教案說要改成這樣，我先試試上面的

module.exports = router
