const { Restaurant, User, Comment } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId, text } = req.body

    if (!text) throw new Error('Comment text is required!')
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return Comment.create({
          text,
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("The comment doesn't exist!")
        return comment.destroy()
      })
      .then(deletedComment => {
        res.redirect(`/restaurants/${deletedComment.restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
