const { Comment, User, Restaurant } = require('../models')

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
        if (!user) throw new Error('User did not exist!')
        if (!restaurant) throw new Error('Restaurant did no exist!')

        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
      .then(() => {
        res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  },

  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error('Comment did not exist!')
        return comment.destroy()
      })
      .then(deletedComment => {
        res.redirect(`/restaurants/${deletedComment.restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
