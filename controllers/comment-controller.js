const { User, Restaurant, Comment } = require('../models')

module.exports = {
  async postComment (req, res, next) {
    try {
      const userId = req.user.id
      const { text, restaurantId } = req.body
      if (!text) throw new Error('The comment is required')

      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])
      if (!user) throw new Error('The user does not exist')
      if (!restaurant) throw new Error('The restaurant does not exist')
      await Comment.create({ text, restaurantId, userId })
      res.redirect(`/restaurants/${restaurantId}`)
    } catch (err) {
      next(err)
    }
  }
}
