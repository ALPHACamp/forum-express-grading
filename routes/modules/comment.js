const commentController = require('./../../controllers/comment-controller')
const express = require('express')
const router = express.Router()

router.post('/', commentController.postComment)

module.exports = router
