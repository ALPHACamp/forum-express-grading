const { Comment, User, Restaurant } = require('../models')
const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment text is required!')
    return Promise.all([User.findByPk(userId), Restaurant.findByPk(restaurantId)])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('commentCounts')
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
  deleteComment: async (req, res, next) => {
    try {
      const { restaurantId } = req.body
      const comment = await Comment.findByPk(req.params.id)
      const restaurant = await Restaurant.findByPk(restaurantId)

      if (!comment) throw new Error("Comment didn't exist!")
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      await restaurant.decrement('commentCounts')
      await comment.destroy()
      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = commentController
