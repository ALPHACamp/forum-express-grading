const { Restaurant, User, Comment } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment is required!')

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        if (!user) throw new Error("User doesn't exist!")
        return Comment.create({ text, userId, restaurantId })
      })
      .then(() => {
        req.flash('success_messages', 'Your comment is successfully posted!')
        return res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment doesn't exist!")
        return comment.destroy()
      })
      .then(deletedComment => {
        req.flash('success_messages', 'The comment is successfully deleted!')
        res.redirect(`/restaurants/${deletedComment.restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
