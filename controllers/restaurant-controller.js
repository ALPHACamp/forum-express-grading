const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId)
    Promise.all([
      Restaurant.findAll({
        where: {
          // 展開運算子的優先值比較低，會先處理後面判斷再來展開
          ...categoryId ? { categoryId } : {}
        },
        raw: true,
        nest: true,
        include: Category
      }),
      Category.findAll({
        raw: true
      })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        res.render('restaurants', { restaurants: data, categories, categoryId })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('restaurant', { restaurant })
      })
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        console.log(restaurant.toJSON())
        res.render('dashboard', { restaurant: restaurant.toJSON() })
        // 每一次 request 增加瀏覽次數
        restaurant.increment('viewCounts', { by: 1 })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
