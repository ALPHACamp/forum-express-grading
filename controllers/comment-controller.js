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
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    const id = req.params.id
    return Comment.findByPk(id)
      .then(comment => {
        if (!comment) throw new Error("Comment doesn't exist!")
        return comment.destroy()
      })
      .then(deleteComment => {
        res.redirect(`/restaurants/${deleteComment.restaurantId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = commentController
