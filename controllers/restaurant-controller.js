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
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('此restaurant不存在')

        return restaurant.increment('viewCounts', { by: 1 })
      })

      .then(() => {
        return Restaurant.findByPk(req.params.id, {
          include: [Category]
        })
      })

      .then(updateRestaurant => {
        res.render('restaurant', {
          restaurant: updateRestaurant.toJSON()
        })
      })

      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })

      .then(restaurant => {
        if (!restaurant) throw new Error('無法獲取更新後的restaurant')

        res.render('dashboard', {
          restaurant
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
