// 負責處理前台餐廳相關的請求 (request)
const { Restaurant, Category } = require('../models')

const restaurantController = {
  // restaurantController是一個物件
  // getRestaurants負責處理瀏覽餐廳頁面的函式，主要為render restaurants 的樣板
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))

      return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('此restaurant不存在')

        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
