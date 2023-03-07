const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => { // 瀏覽所有餐廳頁面:運用展開運算子 ...
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res, next) => { // 瀏覽單筆餐廳頁面
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('restaurant', { restaurant })
    })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
