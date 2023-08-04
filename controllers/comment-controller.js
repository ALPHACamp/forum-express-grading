const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id

    if (!text) throw new Error('Comment text is required.')

    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User didn't exist.")
        if (!restaurant) throw new Error("Restaurant didn't exist.")

        return Comment.create({
          text,
          userId,
          restaurantId
        })
      })
      .then(() => {
        return res.redirect(`/restaurant/${restaurantId}`)
      })
      .catch(err => next(err))
  },
  getComments: (req, res, next) => {

  }
}

module.exports = commentController
