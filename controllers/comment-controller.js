const { User, Restaurant, Comment } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const userId = req.user.id
    const restaurantId = Number(req.body.restaurantId)
    const { text } = req.body
    if (!text) throw new Error('Comment can not be blank!')
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error('User is not exsited!')
        if (!restaurant) throw new Error('Restaurant is not exsited!')
        return Comment.create({ text, restaurantId, userId })
      })
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => next(err))
  }
}

module.exports = commentController
