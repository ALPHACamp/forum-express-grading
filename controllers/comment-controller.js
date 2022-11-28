const assert = require('assert')
const { User, Restaurant, Comment } = require('../models')
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
        assert(user, "User didn't exist!")
        assert(restaurant, "Restaurant didn't exist!")
        return Comment.create({ text, restaurantId, userId })
      })
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => next(err))
  }
}

module.exports = commentController
