const { Comment, User, Restaurant } = require('../models')

const commentController = {
  // 使用者發布評論
  postComment: async (req, res, next) => {
    const userId = req.user.id
    const { restaurantId, text } = req.body
    if (!text) throw new Error('Comment text is required!')

    try {
      const user = await User.findByPk(userId)
      if (!user) throw new Error("User didn't exist!")

      const restaurant = await Restaurant.findByPk(restaurantId)
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      await Comment.create({ text, restaurantId, userId })
      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (e) {
      next(e)
    }
  },
  // 管理者刪除評論
  deleteComment: async (req, res, next) => {
    const { id } = req.params
    try {
      const comment = await Comment.findByPk(id)
      if (!comment) throw new Error("Comment didn't exist!")
      const deletedComment = await comment.destroy()
      if (deletedComment) return res.redirect(`/restaurants/${deletedComment.restaurantId}`)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = commentController
