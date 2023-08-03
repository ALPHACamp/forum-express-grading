const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        // 將首頁顯示的description截至50個字
        // 展開運算子和物件搭配時，通常是用在想要拷貝物件並做出做局部修改的時候
        const data = restaurant.map(r => ({
          ...r,
          // 修改description，若出現重複的key則會以後面的為準
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
