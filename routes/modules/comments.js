const express = require('express')
const router = express.Router()

const commentController = require('../../controllers/comment-controller.js')

const { authenticatedAdmin } = require('../../middleware/auth.js')

router.post('/', commentController.postComment)

router.delete('/:id', authenticatedAdmin, commentController.deleteComment)

module.exports = router