const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id

    if (!text) throw new Error('Comment text is required!')

    Promise.all([
      User.findByPk(userId), // 先做反查，確認要關聯的資料存在，存在才能新增，不然關聯的屬性會出錯誤。
      Restaurant.findByPk(restaurantId)
    ]).then(([user, restaurant]) => {
      if (!user) throw new Error("User didn't exist!")
      if (!restaurant) throw new Error("Restaurant isn't exist!")

      Comment.create({ text, userId, restaurantId })
        .then(() => res.redirect(`/restaurants/${restaurantId}`))
        .catch(error => next(error))
    })
  }
}

module.exports = commentController
