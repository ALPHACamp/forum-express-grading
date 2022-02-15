const { Comment, User, Restaurant } = require('../models')
const commentController = {
  postComment: async (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    try {
      if (!text) throw new Error('Comment text is required!')
      const user = await User.findByPk(userId)
      const restaurant = await Restaurant.findByPk(restaurantId)
      if (!user) throw new Error("User didn't exist!")
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await Comment.create({
        text,
        restaurantId,
        userId
      })
      res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      next(error)
    }
  },
  deleteComment: async (req, res, next) => {
    console.log(req.params)
    try {
      console.log(req.params)
      const comment = await Comment.findByPk(req.params.id)
      if (!comment) throw new Error("Comment didn't exist!")
      const deletedComment = await comment.destroy()
      res.redirect(`/restaurants/${deletedComment.restaurantId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = commentController
