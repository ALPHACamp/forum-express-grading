const { User, Restaurant, Comment } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id

    if (!text) throw new Error('Comment text is required!')
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User doesn't exist!")
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return Comment.create({
          text,
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect(`/restaurant/${restaurantId}`))
      .catch(err => next(err))
  }
}
module.exports = commentController
