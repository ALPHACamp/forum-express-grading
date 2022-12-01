const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body // 前端傳入餐廳以及評論內容
    const userId = req.user.id // 使用者(登入)id
    if (!text) throw new Error('Comment text is required!')// 檢測輸入內容是否為空
    return Promise.all([User.findByPk(userId), Restaurant.findByPk(restaurantId)])
      .then(([user, restaurant]) => {
        // 查詢使用者是否存在
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return Comment.create({ text, restaurantId, userId })
      })
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => next(err))
  }
}

module.exports = commentController
