const { assert } = require('chai')
const { User, Restaurant, Comment } = require('../models')
const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    assert(text, 'Comment text is required')
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        assert(user, "User didn't exist!")
        assert(restaurant, "User didn't exist!")

        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
      .then(() => {
        req.flash('success_msg', 'Comment is successful updated.')
        res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        assert(comment, "Comment didn't exist!")
        return comment.destroy()
      })
      .then(deletedComment => res.redirect(`/restaurants/${deletedComment.restaurantId}`))
      .catch(err => next(err))
  }

}

module.exports = commentController
