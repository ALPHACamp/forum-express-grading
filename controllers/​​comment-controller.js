const { Comment, User, Restaurant } = require('../models')
const assert = require('assert')

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    assert(text, 'Comment text is required!')
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        console.log(user, restaurant)
        assert(user, "User didn't exist!")
        assert(restaurant, "Restaurant didn't exist!")
        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    const { id } = req.params
    return Comment.findByPk(id)
      .then(comment => {
        assert(comment, "Comment didn't exist!")
        return comment.destroy()
      })
      .then(deletedComment => res.redirect(`/restaurants/${deletedComment.restaurantId}`))
      .catch(err => next(err))
  }
}
module.exports = commentController
