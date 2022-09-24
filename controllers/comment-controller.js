const { Comment, User, Restaurant } = require('../models')

exports.postComment = (req, res, next) => {
  const { restaurantId, text } = req.body
  const userId = req.user.id
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
        restaurantId,
        userId
      })
    })
    .then(() => {
      res.redirect(`/restaurants/${restaurantId}`)
    })
    .catch(err => next(err))
}

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params
    const comment = await Comment.findByPk(commentId)
    if (!comment) throw new Error('Comment not found!')
    const deletedComment = await comment.destroy()
    return res.redirect(`/restaurants/${deletedComment.restaurantId}`)
  } catch (err) {
    next(err)
  }
}
