const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller.js')

router.post('/:restaurantId', userController.addFavorite)

router.delete('/:restaurantId', userController.removeFavorite)

module.exports = router