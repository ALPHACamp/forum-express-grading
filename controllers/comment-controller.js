const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    let { restaurantId, text } = req.body
    const userId = req.user.id
    text = text.trim()
    if (!text) throw new Error('Comment text is required!')
    Promise.all([
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        if (!restaurant) throw new Error('Restaurant does not exist!')
        if (!user) throw new Error('User does not exist!')
        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => next(err))
  }
}

module.exports = commentController
