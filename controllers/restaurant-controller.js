const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([Restaurant.findAll({
      raw: true,
      nest: true,
      where: { ...categoryId ? { categoryId } : {} },
      include: Category
    }),
    Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        // 將首頁顯示的description截至50個字
        // 展開運算子和物件搭配時，通常是用在想要拷貝物件並做出做局部修改的時候
        const data = restaurant.map(r => ({
          ...r,
          // 修改description，若出現重複的key則會以後面的為準
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data, categories })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist!")
        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
