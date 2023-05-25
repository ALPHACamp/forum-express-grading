const { Restaurant, User, Comment } = require('../models')
const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment text is required')
    Promise.all([User.findByPk(userId), Restaurant.findByPk(restaurantId)])
      .then(([user, restaurant]) => {
        if (!user) throw new Error('User is not exist')
        if (!restaurant) throw new Error('Restaurant is not exist')
        return Comment.create({ text, userId, restaurantId })
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
