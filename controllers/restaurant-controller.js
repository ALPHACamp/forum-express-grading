const { Restaurant, Category, Comment, User } = require('../models')
const restController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId)
    const where = {}
    if (categoryId) where.categoryId = categoryId
    return Promise.all([
      Restaurant.findAll({
        include: [Category],
        where: where,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        restaurant.increment('viewCounts')
        res.render('restaurant', { restaurant: restaurant.toJSON() })
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
        if (!restaurant) throw new Error("restaurant didn't exist")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restController
