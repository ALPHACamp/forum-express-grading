const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id
    if (!text.trim()) throw new Error('Comment field is required!')

    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User doesn't exist!")
        if (!restaurant) throw new Error("Restaurant doesn't exist!")

        return Comment.create({
          text, userId, restaurantId
        })
      })
      .then(() => {
        req.flash('success_messages', 'Comment was successfully posted')
        return res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  },

  deleteComment: (req, res, next) => {
    const commentId = req.params.id
    const { restaurantId } = req.body

    return Comment.findOne({
      where: { id: commentId, restaurantId }
    })
      .then(comment => {
        if (!comment) throw new Error("Comment doesn't exist")

        return comment.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Comment was successfully deleted')
        return res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
