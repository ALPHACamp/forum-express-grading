// 引入model
const { User, Restaurant, Comment } = require('../models')

const commentController = {
  // 新增評論
  postComment: (req, res, next) => {
    // 取得表單資料
    const { text, restaurantId } = req.body
    // 取得使用者id
    const userId = req.user.id

    // 判斷text是否有值，無值回傳錯誤訊息
    if (!text) throw new Error('Comment text is required!')

    // 查詢user與restaurant資料
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Restaurant.findByPk(restaurantId, { raw: true })
    ])
      .then(([user, restaurant]) => {
        // 判斷user與restaurant是否有值，若無回傳錯誤訊息
        if (!user) throw new Error("User didn't exists!")
        if (!restaurant) throw new Error("Restaurant didn't exists!")

        // 新增comment資料庫
        return Comment.create({
          text,
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect(`/restaurants/${restaurantId}`)) // 重新導向該餐廳詳細頁面
      .catch(err => next(err))
  }
}

// 匯出模組
module.exports = commentController
