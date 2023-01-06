// 前台restaurant專用的controller
const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        // 縮減字數到50 --方法1
        // const data = restaurants.map(r => ({
        //   ...r, // 展開運算子：把 r 的 key-value pair 展開，直接放進來
        //   description: r.description.substring(0, 50) // 只有description的部份會被新的（r.description.subs...）覆蓋
        // }))
        // res.render('restaurants', { restaurants: data })
        // 縮減字數到50 --方法2（用Bootstrap text-truncate class）
        res.render('restaurants', { restaurants })
      })
      .catch(err => next(err))
  },
  getRestaurantDetail: (req, res, next) => {
    const { id } = req.params
    Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('This restaurant is not existed!')
        console.log(restaurant)
        res.render('restaurant-detail', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
