const { Restaurant, Category } = require('../models')
const restaurantController = {
  // getRestaurants => 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: {
          // 新增查詢條件 categoryId 是否為空值
          ...(categoryId ? { categoryId } : {})
        },
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ]).then(([restaurants, categories]) => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId
      })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  // dashboard
  getDashboard: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: [Category],
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
