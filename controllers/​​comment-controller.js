const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment text is required!')
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        if (!restaurant) throw new Error("Restaurant is didn't exist")
        if (!user) throw new Error("User is didn't exist")
        return Comment.create({
          text,
          userId,
          restaurantId
        })
          .then(() => {
            res.redirect(`/restaurants/${restaurantId}`)
          })
          .catch(err => next(err))
      })
  },
  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist!'")
        return comment.destroy()
      })
      .then(deleteComment => {
        res.redirect(`/restaurants/${deleteComment.restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
