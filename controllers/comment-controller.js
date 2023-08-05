const { Restaurant, User, Comment } = require('../models')
const { CommentError } = require('../errors/errors')
const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { restaurantId, text } = req.body
      console.log('Type of restaurantId: ', typeof restaurantId)
      const userId = req.user.id
      if (!text) throw new CommentError('Comment text is required!')
      // 尋找restaurant與user 確定都存在
      const [restaurant, user] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        User.findByPk(userId)
      ])
      if (!restaurant) throw new CommentError('Restaurant of Comment does not exist!')
      if (!user) throw new CommentError('Restaurant of Comment does not exist!')

      await Comment.create({
        text,
        restaurantId,
        userId
      })

      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      return next(error)
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const { id } = req.params
      const comment = await Comment.findByPk(id)
      if (!comment) throw new CommentError("Comment didn't exist!")

      // 刪除後會回傳刪除的東西
      await comment.destroy()
      return res.redirect(`/restaurants/${comment.restaurantId}`) // 物件還在還是可以繼續用
    } catch (error) {
      return next(error)
    }
  }

}

module.exports = commentController
