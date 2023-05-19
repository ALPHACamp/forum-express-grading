const { Comment, Restaurant, User } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id
    try {
      if (!text) throw new Error('Comment is required')
      const [restaurant, user] = await Promise.all([Restaurant.findByPk(restaurantId), User.findByPk(userId)])
      if (!restaurant) throw new Error('restaurant did not exist')
      if (!user) throw new Error('user did not exist')
      await Comment.create({ text, restaurantId, userId })
      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (err) {
      next(err)
    }
  },
  deleteComment: async (req, res, next) => {
    const { id } = req.params
    try {
      const comment = await Comment.findByPk(id)
      if (!comment) throw new Error('Comment did not exist!')
      const deleteComment = await comment.destroy()
      return res.redirect(`/restaurants/${deleteComment.restaurantId}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = commentController
