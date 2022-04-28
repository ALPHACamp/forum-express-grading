const { Restaurant, Category } = require('../models')

const restaurantController = {
  // 首頁
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories
        })
      })
      .catch(err => next(err))
  },
  // 餐廳各自的詳細資料
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', { restaurant })
      })
      .then(() => {
        Restaurant.increment('view_counts', { where: { id: req.params.id } })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      raw: true,
      nest: true
    })
      .then(restaurant => {
        console.log(restaurant)
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
