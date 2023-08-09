const { Comment, Restaurant, User } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id

    if (!text) throw new Error('Comment text is required!')

    Promise.all([
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (!user) throw new Error("User didn't exist!")

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
